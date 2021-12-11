const Film = require('../models/film');
const filmRouter = require('express').Router()

filmRouter.get('/getStarred', async function (req, res) {
    let films = await Film.find({ title: { $in: req.query.titles } });
    res.json({ success:true, data: films })
});

filmRouter.get('/getStarredAll', async function (req, res) {
    let films = await Film.find({});
    res.json({ success:true, data: films })
});

filmRouter.post('/star/:imdbId/:title/:year/:image', async function (req, res) {
    let { imdbId, title, year, image } = req.params;
    image = decodeURIComponent(image);
    await new Film({ title, year, image, starred: true, imdbId }).save();
    res.json({ success: true })
});

filmRouter.post('/unstar/:title', async function (req, res) {
    await Film.findOneAndDelete({ title: req.params.title });
    res.json({ success: true })
});


module.exports = filmRouter;