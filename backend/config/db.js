const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Database connection error', err));

module.exports = mongoose;
