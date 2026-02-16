const mongoose = require('mongoose');

const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (!retries) {
        console.error('Could not connect to MongoDB, exiting...');
        process.exit(1);
      }
      // Wait 2 seconds before retrying
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

module.exports = connectDB;
