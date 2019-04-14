const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Database structure

const googlebooks = new Schema({
    title: String, 
    authors: String,
    rating: Number,
    publisher: String,
    publishedDate: String,
    description: String,
    thumbnail: String,
    price: Number,
    purchase: String
});

module.exports = mongoose.model('Books', googlebooks);