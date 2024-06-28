import { frontendDb } from "../database.js"
import { Event, trigger, everyTime, once, globalEvents } from "./events.js"
import * as basics from "./basics.bundle.js"

// listens to:
//     globalEvents.updateVideoRequest
//     globalEvents.requestVideosToList
//     globalEvents.requestVideos
// triggers:
//     globalEvents.videoStorageEntriesUpated

const name = "videoStorageManager"
everyTime(globalEvents.updateVideoRequest).then(async (who, updatedVideos)=>{
    console.log(`${name} saw [updateVideoRequest] from ${who} with ${JSON.stringify(updatedVideos)}`)
    if (!(updatedVideos instanceof Array)) {
        updatedVideos = [updatedVideos]
    }
    const ids = updatedVideos.map(each=>each.videoId)
    const oldData = await frontendDb.getVideos(ids)
    // 
    // detect what actually changed (if anything)
    // 
    const actuallyUpdatedVideos = []
    for (const [eachOld, eachNew] of basics.zip(oldData, updatedVideos)) {
        for (const [key, value] of Object.entries(eachNew)) {
            if (!eachOld || JSON.stringify(eachOld[key]) != JSON.stringify(value)) {
                console.debug(`oldData is:`,   JSON.stringify(eachOld))
                console.debug(`newData is:`,   JSON.stringify(eachNew))
                const mergedData = basics.merge({oldData: eachOld, newData: eachNew})
                console.debug(`mergedData is:`,JSON.stringify(mergedData))
                actuallyUpdatedVideos.push(mergedData)
                break
            }
        }
    }
    await frontendDb.updateVideos(actuallyUpdatedVideos)
    if (actuallyUpdatedVideos.length > 0) {
        return trigger(globalEvents.videoStorageEntriesUpated, name, actuallyUpdatedVideos)
    }
})

// i know, seems like useless redirection/but having an event-log of who talks to who is nice
everyTime(globalEvents.requestVideosToList).then((who)=>{
    return frontendDb.getAllVideos()
})

everyTime(globalEvents.requestVideos).then((who, videoIds)=>{
    return frontendDb.getVideos(videoIds)
})