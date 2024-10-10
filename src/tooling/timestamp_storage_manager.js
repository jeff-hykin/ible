import { frontendDb } from "./database.js"
import { Event, trigger, everyTime, once, globalEvents } from "./events.js"
import * as timestampTooling from "./timestamp_tooling.js"
import Vue from "vue"

// listens to:
//     globalEvents.updateTimestampRequest
//     globalEvents.deleteTimestampRequest
// triggers:
//     globalEvents.timestampStorageUpdatedEntries
//     globalEvents.timestampStorageDeletedEntries
//     globalEvents.addLabelRequest
//     globalEvents.rootRetriveLabelsRequest

// TASKS:
    // check that these are being triggered
    // make the upload system use globalEvents.updateTimestampRequest
    // make the timestamp editor use globalEvents.updateTimestampRequest

const name = "timestampStorageManager"
everyTime(globalEvents.updateTimestampRequest).then(async (who, newTimestampData)=>{
    console.log(`${name} saw [updateTimestampRequest] from ${who}`)
    if (!(newTimestampData instanceof Array)) {
        newTimestampData = [newTimestampData]
    }
    let index = 0
    for (const each of newTimestampData) {
        if (!(each instanceof timestampTooling.Timestamp)) {
            newTimestampData[index++] = new timestampTooling.Timestamp(each)
        }
    }
    try {
        await frontendDb.setTimestamps(newTimestampData, {withCoersion:true})
    } catch (error) {
        Vue.toasted.show(`There was an error saving to the database`).goAway(5500)
        console.error("# ")
        console.error("# Database ERROR")
        console.error("# ")
        console.error(error.stack)
        console.error(error)
        console.error("# ")
        Vue.toasted.show(error.message.slice(0,65), {
            closeOnSwipe: false,
            action: { text:'Close', onClick: (e, toastObject)=>{toastObject.goAway(0)} },
        })
        Vue.toasted.show(`(Full error log in the console)`).goAway(6500)
        // throw error
        return { success: false, errorMessage: "" }
    }
    trigger(globalEvents.timestampStorageUpdatedEntries, name, newTimestampData)
    return { success: true, errorMessage: "" }
})

everyTime(globalEvents.deleteTimestampRequest).then(async (who, timestampId)=>{
    await frontendDb.deleteTimestamp({uuidOfSelectedTimestamp: timestampId })
    trigger(globalEvents.timestampStorageDeletedEntries, name, [timestampId])
})
