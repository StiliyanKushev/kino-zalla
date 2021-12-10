const PORT = 4343;
const express = require('express');
const cors = require('cors');
const systemRouter = require('./system');
const app = express();
app.use(cors());
app.use('/sys', systemRouter);
app.listen(PORT, '0.0.0.0', () => console.log(`backend running on port ${PORT}`));