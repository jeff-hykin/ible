import { frontendDb } from "../iilvd-api.js"
import { Event, trigger, everyTime, once, globalEvents } from "./events.js"

const name = "videoStorageManager"
everyTime(globalEvents.updateVideoPaths).then(async (who, newVideoData)=>{
    console.log(`${name} saw [updateVideoPaths] from ${who}`)
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
