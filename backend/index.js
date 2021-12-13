const PORT = 4343;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);

// socket.io
const { Server } = require("socket.io");
const io = new Server(server, {cors: {origin: "*"}});
require('./sockets')(io);

const streamRouter = require('./routes/stream');
const filmRouter = require('./routes/film');

const { init } = require('./db');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/film', filmRouter);
app.use('/stream', streamRouter);

init(() => {
    console.log('Database ready.')
    server.listen(PORT, '0.0.0.0', () => console.log(`backend running on port ${PORT}`));
});