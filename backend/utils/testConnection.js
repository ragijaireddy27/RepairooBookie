const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/repairooBookie'; // Local MongoDB URI

// Test the connection to MongoDB
async function testConnection() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connection successful');
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error);
  }
}

testConnection();
