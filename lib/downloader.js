const storage = require("./storage")
const { exec } = require('child_process');
const logger=require('./logging');
const uuid = require('uuid');
const videos = global.GLOBAL["videos"] = {}

const hashString = function(s){
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
  }
  
module.exports = {
    download: (req, res, video_url) => {
        //we create a unique session id for each download-and-store job
        let sessionId = uuid.v4();
        let vidHash = hashString(video_url).toString().replace('-', 'X')

        videos[vidHash] = {
            sessionId: sessionId, 
            url: video_url,
            status: "pending"
        }
    
        //spawn a python bot that downloads the movie
        //requires that youtube-dl be installed and invokable via bash
        let downloadCmd = `youtube-dl '${video_url}' -o 'videos/${vidHash}.%(ext)s' -f 'bestvideo+bestaudio/best' --recode-video mp4 --write-info-json`
        console.log(`executing shell cmd: ${downloadCmd}`)
        exec(downloadCmd)

        //return sessionid for future use
        videos[vidHash].status = "downloading"
        res.send(videos[vidHash]);
    },
    saveToCloud: (req, res, url_hash) => {
        let video = videos[url_hash]
        if (!video) logger.log("Error: no job found with "+url_hash)
        //load info json
        let j = require("./videos/"+url_hash+".info.json")
        console.log("video info json: "+JSON.stringify(j, null, 2))
        storage.uploadToCloudAsync("./videos/"+url_hash+".mp4").then(result => {
            logger.log("GC upload complete for "+url_hash)
            videos[url_hash].status = "ready"
            logger.log(JSON.stringify(result, null, 2))
        })
    }

}