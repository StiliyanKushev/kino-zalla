const systemRouter = require('express').Router()
const osu = require('node-os-utils')

systemRouter.get('/info', async function (req, res) {
    // get cpu utalization
    let cpuInfo = await osu.cpu.usage();
    let result = `CPU: ${cpuInfo}% | `;
    // get memory usage
    let memInfo = await osu.mem.info();
    result += `Memory: ${Math.round(memInfo.usedMemMb / 1000)}/${Math.round(memInfo.totalMemMb / 1000)}GB | `;
    // get disk usage
    let diskInfo = await osu.drive.info();
    result += `Disk: ${diskInfo.usedGb}/${diskInfo.totalGb}GB | `;
    // get OS name
    let osInfo = await osu.os.oos();
    result += `OS: ${osInfo} `;
    res.json({ data: result })
});

module.exports = systemRouter;