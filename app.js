const logger=require('./lib/logging');
const uuid = require('uuid');
const express = require('express');
const app = express();
const downloader = require("./lib/downloader")



//static folders for downloaded content and embedded player webpage
app.use('/videos', express.static('videos'))
app.use("/player", express.static('player'))

app.use('/download', (req, res) => {

    let video_url = req.query["url"]
    logger.log("Download request received: "+video_url)
    downloader.download(req, res, video_url)
    res.end();
})

app.use('/download_complete', (req, res) => {
    logger.log("Download complete for video: "+req.query.url_hash)
    downloader.saveToCloud(req, res, req.query.url_hash)
    res.end()
})
app.listen(process.env.PORT || 80)