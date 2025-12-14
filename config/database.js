const mongoose = require('mongoose');
require('dotenv').config();
const dbURI = process.env.dbURI;

function connectDB() {
    return mongoose.connect(dbURI)
    .then(() => {
        console.log('MongoDB connection successful');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1);
    });     
}

module.exports = connectDB;