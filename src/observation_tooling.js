import { toString, toRepresentation } from "./string.js"
import * as yaml from 'yaml'
import * as utils from './utils.js'
import * as csvTools from './tooling/csv_tooling.js'
import * as basics from './tooling/basics.bundle.js'

import {
    localVideoPrefix,
    isLocalVideo,
    getLocalVideoName,
    minSizeOfUnixTimestamp,
    currentFixedSizeOfYouTubeVideoId,
    minSizeOfLocalVideoId,
    videoIdIsValid,
} from './tooling/video_tooling.js'
export {
    localVideoPrefix,
    isLocalVideo,
    getLocalVideoName,
    minSizeOfUnixTimestamp,
    currentFixedSizeOfYouTubeVideoId,
    minSizeOfLocalVideoId,
    videoIdIsValid,
} from './tooling/video_tooling.js'

export const createUuid = ()=>new Date().getTime() + `${Math.random()}`.slice(1)

const namePattern = /^[a-z0-9-.]+$/
function isValidName(value) {
    if (typeof value == 'string') {
        return !!value.match(namePattern)
    }
    return false
}
export class InvalidFormatError extends Error {
    constructor(messages) {
        super("InvalidFormatError")
        this.messages = messages
    }
    toString() {
        return yaml.stringify(this.messages)
    }
}
export const createDefaultObservationEntry = (currentTime)=>({
    observationId: createUuid(),
    type: "marker",
    videoId:            null,
    startTime:          (currentTime||0).toFixed(3)-0,
    endTime:            (currentTime||0).toFixed(3)-0,
    observer:           window.storageObject.observer||"",
    isHuman:            true,
    confirmedBySomeone: false,
    rejectedBySomeone:  false,
    label:           window.storageObject.recentLabel || "example-label",
    labelConfidence: 0.95,
    comment:         "",
    spacialInfo:     {},
})

// 
// indvidual coercsion
// 
    const nameCoerce = name=>toKebabCase(name.toLowerCase().replace(/[^a-zA-Z0-9-.]/g, "-"), {keepTrailingSeparators:true, allowLongSplits:true})
    export function coerceLabel(label) {
        return nameCoerce(label)
    }
    export function coerceObserver(observer) {
        return observer
    }
    export function coerceObservationId(observationId) {
        if (typeof observationId != 'string') {
            const asString = toString(observationId)
            if (observationIdIsValid(asString)) {
                observationId = asString
            } else {
                observationId = createUuid()
            }
        }
        return observationId
    }

// 
// indvidual checks
// 
    export function observationIdIsValid(observationId) {
        if (typeof observationId != "string" || observationId.length < minSizeOfUnixTimestamp || !observationId.match(/^\d+\.\d+$/)) {
            return false
        }
        return true
    }
    export function labelConfidenceIsValid(labelConfidence) {
        if (Number.isFinite(labelConfidence)) {
            if (labelConfidence <= 1 && labelConfidence >= -1) {
                return true
            }
        }
        return false
    }
    export function observerIsValid({observer, isHuman}) {
        return (
            typeof observer == "string" &&
            (
                (isHuman && !utils.isInvalidEmail(observer))
                || (!isHuman && isValidName(observer))
            )
        )
    }
    export function labelIsValid(label) {
        if (typeof label != "string" || !isValidName(label)) {
            return false
        }
        return true
    }


// 
// aggregated checks
// 
    // NOTE: it would be nice to have checks for names that are too similar (misspelled) or startTimes/endTimes that go beyond the video duration
        // however those can be a bit hard to check, particularly for video durations

    // NOTE: this isn't necessarily a complete validation check
    export function quickLocalValidationCheck({observationData, videoDuration}) {
        observationData = observationData||{}
        observationData.startTime-=0
        observationData.endTime-=0
        observationData.labelConfidence-=0
        
        return {
            startTime: observationData.startTime >= 0 && observationData.startTime <= observationData.endTime,
            endTime: observationData.endTime >= 0 && observationData.startTime <= observationData.endTime && (videoDuration?observationData.endTime <= videoDuration:true),
            label: isValidName(observationData.label),
            observer: observerIsValid(observationData),
            labelConfidence: labelConfidenceIsValid(observationData.labelConfidence),
            videoId: videoIdIsValid(observationData.videoId),
        }
    }
    /**
     * guarentees observationId will be correct and tries to help label, observer, startTime, endTime 
     */
    export function coerceObservation(observationEntry) {
        // doing this prevents/removes extraneous properties
        observationEntry = {
            observationId:      observationEntry?.observationId,
            type:               observationEntry?.startTime != observationEntry?.endTime ? "segment" : "marker",
            videoId:            observationEntry?.videoId,
            startTime:          observationEntry?.startTime,
            endTime:            observationEntry?.endTime,
            observer:           observationEntry?.observer,
            isHuman:            observationEntry?.isHuman,
            confirmedBySomeone: observationEntry?.confirmedBySomeone,
            rejectedBySomeone:  observationEntry?.rejectedBySomeone,
            label:              observationEntry?.label,
            labelConfidence:    observationEntry?.labelConfidence,
            comment:            observationEntry?.comment,
            spacialInfo:        observationEntry?.spacialInfo,
            customInfo:         observationEntry?.customInfo,
        }
        
        // 
        // enforce unix timestamp (e.g. id)
        // 
        observationEntry.observationId = coerceObservationId(observationEntry.observationId)
        
        // 
        // enforce simplfied names
        // 
        observationEntry.label = coerceLabel(observationEntry.label)

        // 
        // enforce numeric start/endTimes 
        // 
        observationEntry.startTime -= 0
        observationEntry.endTime   -= 0
        observationEntry.labelConfidence -= 0

        // help customInfo show up
        observationEntry.customInfo = observationEntry.customInfo||{}
        
        return observationEntry
    }
    export function validateObservations(observations) {
        const errorMessagesPerObservation = []
        for (const observationEntry of observations) {
            const errorMessages = []
            
            // 
            // must be object
            // 
            if (!(observationEntry instanceof Object)) {
                errorMessages.push(`An observationEntry must be an object, instead it was ${observationEntry == null ? `${observationEntry}` : typeof observationEntry}`)
            } else {
                // 
                // observationId
                // 
                if (typeof observationEntry.observationId != "string" || observationEntry.observationId.length < minSizeOfUnixTimestamp || !observationEntry.observationId.match(/^\d+\.\d+$/)) {
                    errorMessages.push(`observationEntry.observationId: ${toRepresentation(observationEntry.observationId)}\nAn observationEntry must have a "observationId" property\n- it needs to be a string\n- the string needs to contain digits of a decimal number\n- the base digits need of a unix timestamp (milliseconds)\n- and the a decimal needs to be a random number`)
                }

                // 
                // videoId
                // 
                if (!videoIdIsValid(observationEntry.videoId)) {
                    errorMessages.push(`observationEntry.videoId: ${toRepresentation(observationEntry.videoId)}\nAn observationEntry must have a "videoId" property\n- it needs to be a string\n- the string needs to not be empty\n- it should be at least 11 charcters long `)
                }

                // 
                // startTime/endTime
                // 
                const startTimeIsNumeric = Number.isFinite(observationEntry.startTime) && observationEntry.startTime >= 0
                const endTimeIsNumeric   = Number.isFinite(observationEntry.endTime)   && observationEntry.endTime >= 0
                if (!startTimeIsNumeric) {
                    errorMessages.push(`observationEntry.startTime: ${toRepresentation(observationEntry.startTime)}\nAn observationEntry must have a "startTime" property\n- it needs to be a positive number`)
                }
                if (!endTimeIsNumeric) {
                    errorMessages.push(`observationEntry.endTime: ${toRepresentation(observationEntry.endTime)}\nAn observationEntry must have a "endTime" property\n- it needs to be a positive number`)
                }
                if (startTimeIsNumeric && endTimeIsNumeric) {
                    if (observationEntry.startTime > observationEntry.endTime) {
                        errorMessages.push(`startTime: ${observationEntry.startTime}, endTime: ${observationEntry.endTime}\nAn observationEntry must have a startTime that is ≤ endTime`)
                    }
                }
                
                // 
                // observer
                // 
                if (!observerIsValid(observationEntry)) {
                    errorMessages.push(`observationEntry.observer: ${toRepresentation(observationEntry.observer)}\nAn observationEntry must have a "observer" property\n- for human observers it needs to be an email\n- for machine learning models it needs to be a string that contains only lowercase letters, numbers, dashes and periods`)
                }

                // 
                // label
                // 
                if (!labelIsValid(observationEntry.label)) {
                    errorMessages.push(`observationEntry.label: ${toRepresentation(observationEntry.label)}\nAn observationEntry must have a "label" property\n- it needs to be a string\n- the string needs to not be empty\n- it needs to contain only lowercase letters, numbers, dashes and periods`)
                }
                
                // 
                // confidence
                // 
                if (!labelConfidenceIsValid(observationEntry.labelConfidence)) {
                    errorMessages.push(`observationEntry.labelConfidence: ${toRepresentation(observationEntry.labelConfidence)}\nAn observationEntry must have a "labelConfidence" property\n- it needs to be a number\n- it needs to be between 1 and -1 (inclusive)`)
                }
                
                // 
                // boolean fields
                //
                if (observationEntry.isHuman !== true && observationEntry.isHuman !== false) {
                    errorMessages.push(`observationEntry.isHuman: ${toRepresentation(observationEntry.isHuman)}\nAn observationEntry must have a "isHuman" property\n- it needs to be a boolean\n${JSON.stringify(observationEntry)}`)
                }
                if (observationEntry.confirmedBySomeone != null && observationEntry.confirmedBySomeone !== true && observationEntry.confirmedBySomeone !== false) {
                    errorMessages.push(`observationEntry.confirmedBySomeone: ${toRepresentation(observationEntry.confirmedBySomeone)}\nThe "confirmedBySomeone" property\n- needs to be a boolean or null`)
                }
                if (observationEntry.rejectedBySomeone != null && observationEntry.rejectedBySomeone !== true && observationEntry.rejectedBySomeone !== false) {
                    errorMessages.push(`observationEntry.rejectedBySomeone: ${toRepresentation(observationEntry.rejectedBySomeone)}\nAn observationEntry needs to be a boolean or null`)
                }
            }
            errorMessagesPerObservation.push(errorMessages)
        }
        return errorMessagesPerObservation
    }
// 
// CSV
// 
    const observationDownlaodHeaders = [
        "uploadAction",
        "observationId",
        "=type",
        "videoId",
        "startTime",
        "endTime",
        "observer",
        "isHuman",
        "=confirmedBySomeone",
        "=rejectedBySomeone",
        "label",
        "labelConfidence",
        "comment",
        "spacialInfo",
    ]
    export function observationsToCsv(entries) {
        const observations = []
        for (const each of entries) {
            // TODO: do coersion of correctness on download
            observations.push({
                "uploadAction": "update",
                "observationId": each.observationId,
                "=type": each.startTime != each.endTime ? "segment" : "marker",
                "videoId": each.videoId,
                "startTime": each.startTime,
                "endTime": each.endTime,
                "observer": each.observer,
                "isHuman": each.isHuman,
                "=confirmedBySomeone": each.confirmedBySomeone,
                "=rejectedBySomeone": each.rejectedBySomeone,
                "label": each.label,
                "labelConfidence": each.labelConfidence,
                "comment": each.comment,
                "spacialInfo": each.spacialInfo,
            })
            // flatten out video
            for (const [key, value] of Object.entries(each.video||{})) {
                observations.slice(-1)[0][`=video.${key}`] = value
            }
            // flatten out customInfo
            for (const [key, value] of Object.entries(each.customInfo||{})) {
                observations.slice(-1)[0][`customInfo.${key}`] = value
            }
        }
        
        return csvTools.convertToCsv(
            observations, 
            {
                defaultHeaders: observationDownlaodHeaders,
            }
        )
    }

    export const observationsCsvToActions = async (csvString) => {
        const observationEntries = await csvTools.parseCsv(csvString)
        const headers = observationEntries.shift()
        const observationActions = []
        for (const eachRow of observationEntries) {
            const { uploadAction, observationId, ...eachEntry } = Object.fromEntries(basics.zip(headers, eachRow))
            if (uploadAction == "ignore") {
                continue
            }
            if (typeof observationId != "string") {
                continue
            }
            const observationObject = {
                observationId,
                customInfo: {},
            }
            // rebuild customInfo
            for (const [key, value] of Object.entries(eachEntry)) {
                if (key.startsWith("customInfo.")) {
                    const customInfoKey = key.replace(/^customInfo\./, "")
                    observationObject.customInfo[customInfoKey] = value
                }
            }
            
            const detectedKeys = [
                "videoId",
                "startTime",
                "endTime",
                "observer",
                "isHuman",
                "label",
                "labelConfidence",
                "comment",
                "spacialInfo",
            ]
            for (const detectedKey of detectedKeys) {
                if (uploadAction=="update") {
                    if (eachEntry[detectedKey] != null) {
                        observationObject[detectedKey] = eachEntry[detectedKey]
                    }
                } else if (uploadAction=="overwrite") {
                    observationObject[detectedKey] = eachEntry[detectedKey]
                }
            }
            
            observationActions.push([ uploadAction, [observationId], observationObject ])
        }
        return observationActions    
    }

