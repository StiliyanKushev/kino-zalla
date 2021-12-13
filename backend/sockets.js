const systemEmitter = require('./socket-handlers/system');

module.exports = io => {
    io.on("connection", socket => { });
    systemEmitter(io);
}