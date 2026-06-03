const mongoose = require('mongoose');
const { mongodbUri, nodeEnv } = require('./env');

async function connectDB() {
  try {
    await mongoose.connect(mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB (${nodeEnv} mode)`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB disconnect error:', error.message);
  }
}

module.exports = { connectDB, disconnectDB };
