const mongoose = require('mongoose');
require('dotenv').config();
const Bike = require('./models/Bike');
const bikes = [
  {
    name: 'Honda CB150F',
    model: '2024 Standard',
    price: 339000,
    fuelAverage: { city: 45, highway: 55 },
    colorOptions: ['Pearl Nightstar Black', 'Candy Chromosphere Red', 'Excel White'],
    engineCC: 150,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600',
    ],
    features: ['Digital speedometer', 'Alloy wheels', 'Disc brake (front)', 'Self start', 'USB charging port'],
  },
  {
    name: 'Yamaha YBR 125G',
    model: '2024 G-Series',
    price: 299000,
    fuelAverage: { city: 50, highway: 60 },
    colorOptions: ['Midnight Black', 'Racing Blue', 'Metallic Red'],
    engineCC: 125,
    images: [
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=600',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600',
    ],
    features: ['Fuel efficient engine', 'Spoke wheels', 'Drum brakes', 'Self start', 'Long seat comfort'],
  },
  {
    name: 'Suzuki GS150',
    model: '2024 SE',
    price: 319000,
    fuelAverage: { city: 42, highway: 52 },
    colorOptions: ['Glass Sparkle Black', 'Candy Sonoma Red', 'Pearl Glacier White'],
    engineCC: 150,
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600',
      'https://images.unsplash.com/photo-1525160354320-d8e92641b563?w=600',
    ],
    features: ['Multi-reflector headlight', 'Alloy wheels', 'Self start', 'Digital analog combo meter', 'Side stand indicator'],
  },
  {
    name: 'Honda CG125',
    model: '2024 Classic',
    price: 219000,
    fuelAverage: { city: 55, highway: 65 },
    colorOptions: ['Black', 'Red', 'Blue'],
    engineCC: 125,
    images: [
      'https://images.unsplash.com/photo-1517994112540-009c47ea476b?w=600',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    ],
    features: ['Proven reliable engine', 'Kick start', 'Simple maintenance', 'Fuel efficient', 'Wide service network'],
  },
  {
    name: 'Road Prince RP150CC',
    model: '2024 Deluxe',
    price: 265000,
    fuelAverage: { city: 48, highway: 58 },
    colorOptions: ['Black', 'Red', 'Blue', 'Green'],
    engineCC: 150,
    images: [
      'https://images.unsplash.com/photo-1622185135505-2d795003994a?w=600',
      'https://images.unsplash.com/photo-1558981285-6f0c8db71eb1?w=600',
    ],
    features: ['Disc brake (front)', 'Alloy wheels', 'Self start', 'Digital meter', '4 color options'],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      ssl: true,
      family: 4,
    });
    console.log('✅ Connected to MongoDB');

    await Bike.deleteMany({});
    console.log('🗑️  Cleared existing bikes');

    await Bike.insertMany(bikes);
    console.log('🏍️  5 bikes seeded successfully!');

    mongoose.connection.close();
    console.log('🔒 Connection closed');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
};

seedDB();