const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDB connected successfully');
    } catch (e) {
        console.log('MongoDB connection failed', { error: e });
        process.exit(1)
    }
};

module.exports = connectDB;