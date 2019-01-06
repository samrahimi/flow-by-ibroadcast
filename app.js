const logger=require('./lib/logging');
const uuid = require('uuid');
const express = require('express');
const app = express();
const render = require("./index")
const downloader = require("./lib/downloader")



//expose the chart images to http for the client
app.use('/charts', express.static('charts'))
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
//generate charts based on recent data, then refresh them every half an hour
render.startRenderingJob();