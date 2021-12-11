const Film = require('../models/film');
const filmRouter = require('express').Router()

filmRouter.get('/getStarred', async function (req, res) {
    let films = await Film.find({ name: { $in: req.query.names } });
    res.json({ success:true, data: films })
});

filmRouter.post('/star/:name/:year/:image', async function (req, res) {
    let { name, year, image } = req.params;
    image = decodeURIComponent(image);
    await new Film({ name, year, image }).save();
    res.json({ success: true })
});

filmRouter.post('/unstar/:name', async function (req, res) {
    await Film.findOneAndDelete({ name: req.params.name });
    res.json({ success: true })
});


module.exports = filmRouter;