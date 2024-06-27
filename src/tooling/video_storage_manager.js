import { frontendDb } from "../iilvd-api.js"
import { Event, trigger, everyTime, once, globalEvents } from "./events.js"

// listens to:
//     globalEvents.updateVideoPathsRequest
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
