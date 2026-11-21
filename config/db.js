const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ahmedelgendyfci_db_user:4CyY4ekt3IylZtEj@shift-bord-requests.tbmdjui.mongodb.net/shiftbord?retryWrites=true&w=majority';

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
