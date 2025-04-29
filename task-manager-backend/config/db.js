const mongoose = require('mongoose');
require('dotenv').config(); // Ensure environment variables are loaded

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;