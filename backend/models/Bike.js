const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  fuelAverage: {
    city: { type: Number, required: true },
    highway: { type: Number, required: true },
  },
  colorOptions: {
    type: [String],
    required: true,
  },
  engineCC: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  features: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('Bike', bikeSchema);