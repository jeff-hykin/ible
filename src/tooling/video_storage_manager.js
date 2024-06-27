import { frontendDb } from "../iilvd-api.js"
import { Event, trigger, everyTime, once, globalEvents } from "./events.js"

// listens to:
//     globalEvents.updateVideoPathsRequest
//     globalEvents.requestVideosToList
// triggers:
//     globalEvents.videoStorageUpated

const name = "videoStorageManager"
everyTime(globalEvents.updateVideoPathsRequest).then(async (who, newVideoData)=>{
    console.log(`${name} saw [updateVideoPathsRequest] from ${who}`)
    let addressValuePairs = []
    for (const {videoId, path} of newVideoData) {
        if (path && videoId) {
            addressValuePairs.push([
            ["videos", videoId, "path"],
                path,
            ])
        }
    }
    await indexDb.puts(addressValuePairs)
    trigger(globalEvents.videoStorageUpated, name, newVideoData)
})

everyTime(globalEvents.requestVideosToList).then(async (who)=>{
    let videos = []
    for await (const [ key, each ] of indexDb.iter.videos) {
        videos.push(each)
    }
    return videos
})