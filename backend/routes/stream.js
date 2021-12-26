const streamRouter = require('express').Router()
const torrentStream = require('torrent-stream');
const { StaticPool } = require('node-worker-threads-pool');
const { convert } = require('subtitle-converter');
const DecompressZip = require('decompress-zip');
const { unrar } = require('unrar-promise');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// use workers for searching
const staticPool = new StaticPool({
    size: os.cpus().length,
    shareEnv: true,
    task: path.join(process.cwd(), './workers/torrent.js'),
});

streamRouter.get('/film/:name', async function (req, res) {
    const responseData = await staticPool.exec(req.params.name);
    res.json(responseData ? { options: responseData } : { success: false })
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
    const film = req.params.name;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://subsunacs.net/search.php');

    // trigger search for movie
    await page.evaluate(async (filmName) => {
        let [ input, submit ] = document.querySelectorAll('#divTop input')
        input.value = filmName;
        submit.click();
    }, film);

    // wait for results to show
    await page.waitForNavigation();
    
    // prepare the download path
    const uuid = Math.random();
    const downloadPath = path.join(__dirname,`../tmp/${uuid}`);
    if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath);

    // set the default download path
    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath,
    });

    // download one of the subtitle files
    await page.evaluate(async (filmName) => {
        let allLinks = document.querySelectorAll('tbody a.tooltip');
        let anchor = Array.from(allLinks).find(a => a.textContent.trim() === filmName);
        anchor.click();
    }, film);

    // wait for the file to be downloaded
    const waitFile = async folderPath => {
        const delay = time => new Promise(resolve => setTimeout(resolve, time));
        return await new Promise(async (resolve, reject) => {
            if (fs.readdirSync(folderPath).length === 0) {
                await delay(1000);
                resolve(await waitFile(folderPath));
            } else resolve(path.join(folderPath, fs.readdirSync(folderPath)[0]));
        })
    }
    const archivePath = await waitFile(downloadPath);

    // job done, close the browser
    await browser.close();

    // begin extracting the zip
    if(archivePath.endsWith('.zip')){
        const unzipper = new DecompressZip(archivePath);
        unzipper.extract({ path: downloadPath });

        // wait for extraction to complete
        await new Promise(resolve => () => unzipper.on('extract', () => resolve()));
    }
    // the other variant is rar
    else await unrar(archivePath, downloadPath);

    // get the subtitles file
    const subsPath = path.join(downloadPath,fs.readdirSync(downloadPath)
    .find(f => !(f.endsWith('.rar') || f.endsWith('.zip') || f.endsWith('.txt'))));    
    const subsContent = fs.readFileSync(subsPath, { encoding: 'utf-8' });

    // convert it to vtt (supported by browsers)
    const { subtitle } = convert(subsContent, '.vtt', { removeTextFormatting: true });

    // decode the text to cyrillic
    const final = await (await import('windows-1251')).decode(subtitle);
    console.log(final);

    // remove the files at the end
    fs.rmSync(downloadPath, { recursive: true });

    // return the subs
    res.json({ subs: final });
});

module.exports = streamRouter;