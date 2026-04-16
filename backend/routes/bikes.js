const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');

// GET all bikes
router.get('/', async (req, res) => {
  try {
    const bikes = await Bike.find();
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bikes' });
  }
});

// GET single bike by ID
router.get('/:id', async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ error: 'Bike not found' });
    res.json(bike);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bike' });
  }
});

module.exports = router;