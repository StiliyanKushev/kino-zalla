const streamRouter = require('express').Router()
const TorrentSearchApi = require('torrent-search-api');
const torrentStream = require('torrent-stream');
const { v4: uuidv4 } = require('uuid');

TorrentSearchApi.enablePublicProviders();

// we store the mp4 files in here ( seed:mp4File )
// todo use something like node-cache instead
let localStorage = { };

streamRouter.get('/film/:name', async function (req, res) {
    const film = req.params.name;

    // search for a magnet link
    const torrents = await TorrentSearchApi.search(film, 'Movies', 20);
    const magnets = (await Promise.all(torrents.map(async t => await TorrentSearchApi.getMagnet(t))))
    
    // create engine for each magnet and wait for them to load
    let engines = await Promise.all(magnets.map(m => {
        if(!m) return m; // provider blocked scrape call
        return torrentStream(m);
    }).map(async e => {
        if(!e) return;
        return await new Promise((resolve, reject) => e.on('ready', () => resolve(e)))
    }));


    let mp4Data = await new Promise((resolve, reject) => {
        let foundMp4 = false;
        let list = [];
        for(let engine of engines){
            if(!engine) {
                list.push(undefined)
                continue;
            }
            for(let file of engine.files){
                if(file.name.toLocaleLowerCase().endsWith('.mp4')){
                    list.push(file);
                    foundMp4 = true;
                }
            }
        }

        // no mp4 files found
        if(!foundMp4) resolve(undefined);

        // resolve all mp4 files
        resolve(list);
    });

    if(mp4Data === undefined || mp4Data.length === 0) return res.json({ success: false })

    //     uuid: 'asda-da-sd-ag-a-asda',
    //     name: 'Name.of.biggest.file.mp4',
    //     size: '2.4GB',
    //     seeds: '4521',

    let responseData = mp4Data.map((mp4, index) => {
        if(!mp4) return mp4;

        // save it to localStorage
        let uuid = uuidv4();
        localStorage[uuid] = mp4;

        return {
            uuid,
            name: mp4.name,
            size: (mp4.length / Math.pow(1024, 3)).toFixed(1) + 'GB',
            seeds: torrents[index].seeds,
        }
    });

    // remove failed torrent scrapes now
    // that wasn't done before because
    // I needed to keep the indexes
    // so I can get the seeds of each mp4 file
    responseData = responseData.filter(e => e != null)
    res.json({ options: responseData })
});

streamRouter.get('/play/:id', async function (req, res) {
    const id = req.params.id;
    const range = req.headers.range;
    
    console.log(id);

    if (!range)
    res.status(400).send("Requires Range header");

    // Parse Range
    const videoSize = localStorage[id].length;
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : videoSize-1
    const contentLength = (end-start)+1

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
    const videoStream = localStorage[id].createReadStream({ start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
});

module.exports = streamRouter;