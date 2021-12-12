const PORT = 4343;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const systemRouter = require('./routes/system');
const streamRouter = require('./routes/stream');
const filmRouter = require('./routes/film');

const { init } = require('./db');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/sys', systemRouter);
app.use('/film', filmRouter);
app.use('/stream', streamRouter);

init(() => {
    console.log('Database ready.')
    app.listen(PORT, '0.0.0.0', () => console.log(`backend running on port ${PORT}`));
});