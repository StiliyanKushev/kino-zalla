const { parentPort, threadId } = require('worker_threads');
const { convert } = require('subtitle-converter');
const DecompressZip = require('decompress-zip');
const { unrar } = require('unrar-promise');
const playwright = require('playwright');
const encoding = require("encoding");
const path = require('path');
const fs = require('fs');

(async() => {
    console.log(`thread ${threadId} is up and running.`);
    parentPort.on('message', async (name) => {
        parentPort.postMessage(await search(name));
    });
})();

async function search(filmName) {
    const film = filmName.replaceAll(/(\W)/gm, ' ');
    console.log(`Search subtitles for ${film}`)

    const browser = await playwright.chromium.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();
    await page.setDefaultNavigationTimeout(0);
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
    const client = await context.newCDPSession(page);
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath,
    });

    // download one of the subtitle files
    const found = await page.evaluate(async (filmName) => {
        let allLinks = document.querySelectorAll('tbody a.tooltip');
        if(!allLinks.length) return false;

        // smart way to compare if the title is the same
        // disregards the special characters and extra white space
        const compare = entry => {
            const real_s = entry.split(/\W/).filter(String).map(s => s.toLowerCase())
            const mine_s = filmName.split(/\W/).filter(String).map(s => s.toLowerCase())
            return real_s.length === mine_s.length && real_s.every((value, index) => value === mine_s[index]);
        }

        let anchor = Array.from(allLinks).find(a => compare(a.textContent));
        if(!anchor) return false;

        anchor.click();
        return true;
    }, film);

    // did not find any subtitles
    if(!found) {
        browser.close();
        return '';
    }

    // wait for the file to be downloaded
    const waitFile = async folderPath => {
        const delay = time => new Promise(resolve => setTimeout(resolve, time));
        return await new Promise(async (resolve, reject) => {
            if (fs.readdirSync(folderPath).length === 0) {
                await delay(1000);
                resolve(await waitFile(folderPath));
            } else {
                const filePath = path.join(folderPath, fs.readdirSync(folderPath)[0]);
                if(filePath.endsWith('.crdownload')){ // file is still downloading
                    await delay(1000);
                    resolve(await waitFile(folderPath));
                } else {
                    resolve(filePath);
                }
            };
        })
    }
    const archivePath = await waitFile(downloadPath);

    // job done, close the browser
    await browser.close();

    // begin extracting the zip
    if(archivePath.endsWith('.zip')){
        // wait for extraction to complete
        await new Promise(resolve => {
            const unzipper = new DecompressZip(archivePath);
            unzipper.on('extract', () => resolve());
            unzipper.extract({ path: downloadPath });
        });
    }
    // the other variant is rar
    else await unrar(archivePath, downloadPath);

    // get the subtitles file
    const subsPath = path.join(downloadPath,fs.readdirSync(downloadPath)
    .find(f => !(f.endsWith('.rar') || f.endsWith('.zip') || f.endsWith('.txt'))));    
    const subsContent = fs.readFileSync(subsPath, { encoding: 'binary' });

    // convert to vtt standard (supported by browsers)
    const { subtitle } = convert(subsContent, '.vtt', { removeTextFormatting: true });

    // convert the cyrillic to utf-8
    const converted = encoding.convert(subtitle, 'UTF-8', 'win1251').toString();

    // remove the files at the end
    fs.rmSync(downloadPath, { recursive: true });

    // return the subtitles
    return converted;
}