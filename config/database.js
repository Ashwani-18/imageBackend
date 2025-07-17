// db.js
const mongoose = require('mongoose');

// Replace with your MongoDB URI (local or cloud)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your_database_name';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Stop the app if DB fails to connect
  }
};

module.exports = connectDB;
