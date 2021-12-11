const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let dbConnection = null;
const getConnection = () => dbConnection;

function init(onReady) {
    mongoose.connect('mongodb://localhost/homemovies', {useNewUrlParser:true, useUnifiedTopology:true});
    dbConnection = mongoose.connection;
    dbConnection.once("open", (err) => {
        if (err) throw err;
        onReady();
    });
    dbConnection.on("error", (err) => console.log(`Database error: ${err}`));
}

module.exports = { init, getConnection };