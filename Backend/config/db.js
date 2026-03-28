const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/erp';
  const uris = primaryUri ? [primaryUri, fallbackUri] : [fallbackUri];

  for (let i = 0; i < uris.length; i++) {
    let retries = 3;
    const uri = uris[i];
    while (retries) {
      try {
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (error) {
        console.error(`Error: ${error.message}`);
        retries -= 1;
        console.log(`Retries left: ${retries}`);
        if (!retries) {
          if (i < uris.length - 1) {
            console.log('Switching to local MongoDB fallback...');
          } else {
            console.error('Could not connect to MongoDB, exiting...');
            process.exit(1);
          }
        }
        await new Promise(res => setTimeout(res, 2000));
      }
    }
  }
};

module.exports = connectDB;
