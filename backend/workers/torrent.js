const { parentPort, threadId } = require('worker_threads');
const TorrentSearchApi = require('torrent-search-api');
const torrentStream = require('torrent-stream');
TorrentSearchApi.enablePublicProviders();

(async() => {
    console.log(`thread ${threadId} is up and running.`);
    parentPort.on('message', async (film) => {
        parentPort.postMessage(await search(film));
    });
})();

const timeout = (prom, time) => {
	let timer;
	return Promise.race([
		prom,
		new Promise((_r, rej) => timer = setTimeout(rej, time))
	]).finally(() => clearTimeout(timer));
}

async function search(film) {
    console.log(`Searching for ${film}`);

    // search for a magnet link
    const torrents = await TorrentSearchApi.search(film, 'Movies', 20);
    const magnets = (await Promise.all(torrents.map(async t => await TorrentSearchApi.getMagnet(t))))

    // create engine for each magnet and wait for them to load
    let engines = await Promise.all(magnets.map(m => !m ? m : torrentStream(m))
    .map(async e => !e ? e : await timeout(new Promise(resolve => e.on('ready', () => resolve(e))), 8000).catch(() => {})));

    // at this stage I only need the stats
    // don't need to stay connected
    engines.map(e => e && e.destroy())

    let mp4Data = await new Promise((resolve, reject) => {
        let list = [];
        for(let engine of engines){
            // if engine failed to load fill index with undefined
            if(!engine) {
                list.push(undefined);
                continue;
            }

            // get all mp4 files in that torrent
            let engineVideos = [];
            for(let file of engine.files)
                if(file.name.toLocaleLowerCase().endsWith('.mp4')) engineVideos.push(file);

            // if no videos in torrent then fill index with undefined
            if(engineVideos.length === 0) list.push(undefined);
            else {
                // push the biggest mp4 file
                const biggest = engineVideos.reduce((c, p) => c.length > p.length ? c : p);
                list.push(biggest);
            }
        }

        // resolve all mp4 files
        resolve(list);
    });

    if(mp4Data.length === 0) return undefined;

    //     magnet: 'magnet:?...',
    //     name: 'Name.of.biggest.file.mp4',
    //     size: '2.4GB',
    //     seeds: '4521',

    let responseData = mp4Data.map((mp4, index) => {
        if(!mp4) return null;
        
        // browsers don't support the hvec 265 codec
        if(mp4.name.includes('265')) return null;

        return {
            magnet: magnets[index],
            name: mp4.name,
            size: (mp4.length / Math.pow(1024, 3)).toFixed(1) + 'GB',
            seeds: torrents[index].seeds,
        }
    });

    // remove failed torrent scrapes now.
    // That wasn't done before because
    // I needed to keep the indexes
    // so I can get the seeds of each mp4 file
    responseData = responseData.filter(e => e != null)
    if(responseData.length > 8) responseData = responseData.splice(0, 8);

    if(responseData.length === 0) return undefined;
    return responseData;
}