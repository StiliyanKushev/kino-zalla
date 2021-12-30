const streamRouter = require('express').Router()
const torrentStream = require('torrent-stream');
const { StaticPool } = require('node-worker-threads-pool');
const path = require('path');
const os = require('os');

// use workers for searching torrents
const torrentSearch = new StaticPool({
    size: os.cpus().length,
    shareEnv: true,
    task: path.join(process.cwd(), './workers/torrent.js'),
});

// use workers for searching subtitles
const subtitlesSearch = new StaticPool({
    size: os.cpus().length,
    shareEnv: true,
    task: path.join(process.cwd(), './workers/subtitles.js'),
});

streamRouter.get('/film/:name', async function (req, res) {
    const responseData = await torrentSearch.exec(req.params.name);
    res.json(responseData ? { options: responseData } : { success: false });
});

streamRouter.get('/play/:magnet', async function (req, res) {
    const magnet = decodeURIComponent(req.params.magnet);
    const range = req.headers.range;
    
    // helpful for debugging
    console.log(`Received request: ${magnet}`);

    if (!range)
    return res.status(400).send("Requires Range header");

    // reconstuct the torrentStream engine
    let engine = torrentStream(magnet);
    await new Promise(resolve => engine.on('ready', () => resolve()))

    // get mp4 file
    const mp4 = engine.files.find(f => f.name.toLocaleLowerCase().endsWith('.mp4'));

    if(!mp4){
        engine.files.map(f => console.log(f.name));
    }

    // Parse Range
    const videoSize = mp4.length;
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
    const contentLength = (end - start) + 1;

    // Create Headers
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = mp4.createReadStream({ start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
});

// find and return movie's bulgarian subtitles
streamRouter.get('/subs/:name', async function (req, res) {
    const responseData = await subtitlesSearch.exec(req.params.name);
    res.json({ subs: responseData });
});

module.exports = streamRouter;