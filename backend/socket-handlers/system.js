const osu = require('node-os-utils')

const stats = async () => {
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

    return result;
}

const systemEmitter = io => {
    setInterval(async () => {
        io.emit('system-info', await stats());
    }, 10000);
};

module.exports = systemEmitter;