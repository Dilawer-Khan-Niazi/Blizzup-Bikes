const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bikeRoutes = require('./routes/bikes');
const chatRoutes = require('./routes/chat');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bikes', bikeRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Blizzup Bikes API is running!' });
});

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGODB_URI, {
  ssl: true,
  family: 4
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });