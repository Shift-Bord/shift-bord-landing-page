const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shiftbord';

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`🍃  MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌  MongoDB Connection Error: ${error.message}`);
    console.log(`ℹ️   Make sure MongoDB is running or check your MONGODB_URI in .env`);
  }
}

module.exports = connectDB;
