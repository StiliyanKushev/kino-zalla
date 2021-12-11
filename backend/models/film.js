const mongoose = require('mongoose');

let filmSchema = new mongoose.Schema({
    name:String,
    year:Number,
    image:String
});

let Film = mongoose.model('Film', filmSchema);

module.exports = Film;