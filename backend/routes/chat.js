const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

function scoreBike(bike, allBikes) {
  const prices = allBikes.map(b => b.price);
  const fuelAvgs = allBikes.map(b => (b.fuelAverage.city + b.fuelAverage.highway) / 2);
  const ccs = allBikes.map(b => b.engineCC);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minFuel = Math.min(...fuelAvgs);
  const maxFuel = Math.max(...fuelAvgs);
  const minCC = Math.min(...ccs);
  const maxCC = Math.max(...ccs);

  const avgFuel = (bike.fuelAverage.city + bike.fuelAverage.highway) / 2;

  // Price: lower is better (20pts)
  const priceScore = maxPrice === minPrice ? 20 :
    ((maxPrice - bike.price) / (maxPrice - minPrice)) * 20;

  // Fuel Average: higher is better (20pts)
  const fuelScore = maxFuel === minFuel ? 20 :
    ((avgFuel - minFuel) / (maxFuel - minFuel)) * 20;

  // Engine CC: higher is better (20pts)
  const ccScore = maxCC === minCC ? 20 :
    ((bike.engineCC - minCC) / (maxCC - minCC)) * 20;

  // Value for Money (20pts)
  const valueRatios = allBikes.map(b =>
    ((b.fuelAverage.city + b.fuelAverage.highway) / 2) / (b.price / 1000)
  );
  const bikeRatio = avgFuel / (bike.price / 1000);
  const minRatio = Math.min(...valueRatios);
  const maxRatio = Math.max(...valueRatios);
  const valueScore = maxRatio === minRatio ? 20 :
    ((bikeRatio - minRatio) / (maxRatio - minRatio)) * 20;

  // Features & Colors (20pts)
  const featureCounts = allBikes.map(b => b.features.length + b.colorOptions.length);
  const bikeFeatureCount = bike.features.length + bike.colorOptions.length;
  const minFeatures = Math.min(...featureCounts);
  const maxFeatures = Math.max(...featureCounts);
  const featureScore = maxFeatures === minFeatures ? 20 :
    ((bikeFeatureCount - minFeatures) / (maxFeatures - minFeatures)) * 20;

  return {
    price: Math.round(priceScore),
    fuelAverage: Math.round(fuelScore),
    engineCC: Math.round(ccScore),
    valueForMoney: Math.round(valueScore),
    featuresAndColors: Math.round(featureScore),
    total: Math.round(priceScore + fuelScore + ccScore + valueScore + featureScore),
  };
}

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    const allBikes = await Bike.find();
    const bikeNames = allBikes.map(b => b.name);

    const systemPrompt = `You are BikeExpert AI, an expert assistant helping users compare and choose motorcycles in Pakistan.

Available bikes in database: ${bikeNames.join(', ')}

Your conversation flow:
1. Greet the user warmly and ask how many bikes they want to compare (2-5)
2. Ask for bike names one by one and confirm each
3. Once you have ALL the bike names confirmed, respond with ONLY this JSON (no other text):
{"action": "compare", "bikes": ["Bike Name 1", "Bike Name 2"]}
4. After receiving comparison data, present it clearly and give a detailed recommendation

Rules:
- Match bike names case-insensitively to the database
- Be friendly and conversational
- Only output the JSON when you have ALL bike names confirmed
- When outputting the JSON, output ONLY the JSON, nothing else`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    console.log('Groq response:', JSON.stringify(data, null, 2));

    if (data.error) {
      console.error('Groq API error:', data.error);
      return res.json({
        reply: `AI Error: ${data.error.message}`,
        type: 'text',
      });
    }

    if (!data.choices || !data.choices[0]) {
      console.error('No choices in response:', data);
      return res.json({
        reply: 'AI service unavailable. Please try again.',
        type: 'text',
      });
    }

    const reply = data.choices[0].message.content;

    // Check if AI wants to do a comparison
    try {
      const jsonMatch = reply.match(/\{[\s\S]*"action"\s*:\s*"compare"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const bikeNamesToCompare = parsed.bikes;

        const bikeDocs = await Promise.all(
          bikeNamesToCompare.map(name =>
            Bike.findOne({ name: { $regex: new RegExp(name, 'i') } })
          )
        );

        const foundBikes = bikeDocs.filter(Boolean);

        if (foundBikes.length < 2) {
          return res.json({
            reply: 'I could not find some of those bikes. Available bikes: ' + bikeNames.join(', '),
            type: 'text',
          });
        }

        const scoredBikes = foundBikes.map(bike => ({
          bike,
          scores: scoreBike(bike, foundBikes),
        }));

        const winner = scoredBikes.reduce((a, b) =>
          a.scores.total > b.scores.total ? a : b
        );

        return res.json({
          reply: 'Here is the comparison of your selected bikes:',
          type: 'comparison',
          comparison: scoredBikes.map(({ bike, scores }) => ({
            name: bike.name,
            model: bike.model,
            price: bike.price,
            engineCC: bike.engineCC,
            fuelAverage: bike.fuelAverage,
            colorOptions: bike.colorOptions,
            features: bike.features,
            scores,
          })),
          winner: {
            name: winner.bike.name,
            totalScore: winner.scores.total,
            scores: winner.scores,
          },
        });
      }
    } catch (e) {
      console.error('Comparison parse error:', e);
    }

    res.json({ reply, type: 'text' });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ reply: 'Something went wrong. Please try again.', type: 'text' });
  }
});

module.exports = router;