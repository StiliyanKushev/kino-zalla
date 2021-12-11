const mongoose = require('mongoose');

let filmSchema = new mongoose.Schema({
    title:String,
    year:Number,
    image:String,
    starred:{ type: Boolean, default: true },
    imdbId:String
});

let Film = mongoose.model('Film', filmSchema);

module.exports = Film;