import { frontendDb } from "./database.js"
import { Event, trigger, everyTime, once, globalEvents } from "./events.js"
import * as observationTooling from "./observation_tooling.js"
import Vue from "vue"

// listens to:
//     globalEvents.updateObservationRequest
//     globalEvents.deleteObservationRequest
// triggers:
//     globalEvents.observationStorageUpdatedEntries
//     globalEvents.observationStorageDeletedEntries
//     globalEvents.addLabelRequest
//     globalEvents.rootRetriveLabelsRequest

// TASKS:
    // check that these are being triggered
    // make the upload system use globalEvents.updateObservationRequest
    // make the observation editor use globalEvents.updateObservationRequest

const name = "observationStorageManager"
everyTime(globalEvents.updateObservationRequest).then(async (who, newObservationData)=>{
    console.log(`${name} saw [updateObservationRequest] from ${who}`)
    if (!(newObservationData instanceof Array)) {
        newObservationData = [newObservationData]
    }
    for (let observationEntry of newObservationData) {
        observationEntry = observationTooling.coerceObservation(observationEntry)
        
        // 
        // send request to database
        // 
        try {
            await frontendDb.setObservation(observationEntry, {withCoersion:true})
        } catch (error) {
            Vue.toasted.show(`There was an error on the database`).goAway(5500)
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
    }
    trigger(globalEvents.observationStorageUpdatedEntries, name, newObservationData)
    return { success: true, errorMessage: "" }
})

everyTime(globalEvents.deleteObservationRequest).then(async (who, observationId)=>{
    await frontendDb.deleteObservation({uuidOfSelectedSegment: observationId })
    trigger(globalEvents.observationStorageDeletedEntries, name, [observationId])
})
