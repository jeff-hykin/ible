import * as utils from './pure_tools.js'
import * as basics from './basics.bundle.js'
// import * as typedCsv from './typed_csv.js' // see the run/build script for why we can't just import this (and why its a global)
import { toString, toRepresentation } from './basics.bundle.js'
import { toKebabCase } from './string_helpers.js'

import {
    isLocalVideo,
    minSizeOfUnixTimestamp,
    currentFixedSizeOfYouTubeVideoId,
    videoIdIsValid,
} from './video_tooling.js'
export {
    isLocalVideo,
    minSizeOfUnixTimestamp,
    currentFixedSizeOfYouTubeVideoId,
    videoIdIsValid,
} from './video_tooling.js'

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
export const createDefaultTimestampEntry = (currentTime)=>({
    timestampId: createUuid(),
    type: "marker",
    videoId:            null,
    startTime:          (currentTime||0).toFixed(3)-0,
    endTime:            (currentTime||0).toFixed(3)-0,
    observer:           window.storageObject.observer||"",
    isHuman:            true,
    confirmedBySomeone: false,
    rejectedBySomeone:  false,
    confirmedBy:        [],
    rejectedBy:         [],
    label:           window.storageObject.recentLabel || "example-label",
    labelConfidence: 0.95,
    comment:         "",
    spacialInfo:     {},
})

// 
// indvidual coercsion
// 
    const nameCoerce = name=>toKebabCase((name||"").toLowerCase().replace(/[^a-zA-Z0-9-.]/g, "-"), {keepTrailingSeparators:true, allowLongSplits:true})
    export function coerceLabel(label) {
        return nameCoerce(label)
    }
    export function coerceObserver(observer) {
        return observer
    }
    export function coerceTimestampId(timestampId) {
        if (typeof timestampId != 'string') {
            const asString = toString(timestampId)
            if (timestampIdIsValid(asString)) {
                timestampId = asString
            } else {
                timestampId = createUuid()
            }
        }
        return timestampId
    }

// 
// indvidual checks
// 
    export function timestampIdIsValid(timestampId) {
        if (typeof timestampId != "string" || timestampId.length < minSizeOfUnixTimestamp || !timestampId.match(/^\d+\.\d+$/)) {
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
    export function quickLocalValidationCheck({timestampData, videoDuration}) {
        timestampData = timestampData||{}
        timestampData.startTime-=0
        timestampData.endTime-=0
        timestampData.labelConfidence-=0
        
        return {
            startTime: timestampData.startTime >= 0 && timestampData.startTime <= timestampData.endTime,
            endTime: timestampData.endTime >= 0 && timestampData.startTime <= timestampData.endTime && (videoDuration?timestampData.endTime <= videoDuration:true),
            label: isValidName(timestampData.label),
            observer: observerIsValid(timestampData),
            labelConfidence: labelConfidenceIsValid(timestampData.labelConfidence),
            videoId: videoIdIsValid(timestampData.videoId),
        }
    }
    /**
     * guarentees timestampId will be correct and tries to help label, observer, startTime, endTime 
     */
    export function coerceTimestamp(timestampEntry) {
        // doing this prevents/removes extraneous properties
        timestampEntry = {
            timestampId:      timestampEntry?.timestampId,
            type:               timestampEntry?.startTime != timestampEntry?.endTime ? "segment" : "marker",
            videoId:            timestampEntry?.videoId,
            startTime:          timestampEntry?.startTime,
            endTime:            timestampEntry?.endTime,
            observer:           timestampEntry?.observer,
            isHuman:            timestampEntry?.isHuman,
            confirmedBySomeone: timestampEntry?.confirmedBySomeone,
            rejectedBySomeone:  timestampEntry?.rejectedBySomeone,
            confirmedBy:        timestampEntry?.confirmedBy||[],
            rejectedBy:         timestampEntry?.rejectedBy||[],
            label:              timestampEntry?.label,
            labelConfidence:    timestampEntry?.labelConfidence,
            comment:            timestampEntry?.comment,
            spacialInfo:        timestampEntry?.spacialInfo,
            customInfo:         timestampEntry?.customInfo,
        }
        
        // 
        // enforce unix timestamp (e.g. id)
        // 
        timestampEntry.timestampId = coerceTimestampId(timestampEntry.timestampId)
        
        // 
        // enforce simplfied names
        // 
        timestampEntry.label = coerceLabel(timestampEntry.label)

        // 
        // enforce numeric start/endTimes 
        // 
        timestampEntry.startTime -= 0
        timestampEntry.endTime   -= 0
        timestampEntry.labelConfidence -= 0

        // help customInfo show up
        timestampEntry.customInfo = timestampEntry.customInfo||{}
        
        return timestampEntry
    }
    export function validateTimestamps(timestamps) {
        const errorMessagesPerTimestamp = []
        for (const timestampEntry of timestamps) {
            const errorMessages = []
            
            // 
            // must be object
            // 
            if (!(timestampEntry instanceof Object)) {
                errorMessages.push(`An timestampEntry must be an object, instead it was ${timestampEntry == null ? `${timestampEntry}` : typeof timestampEntry}`)
            } else {
                // 
                // timestampId
                // 
                if (typeof timestampEntry.timestampId != "string" || timestampEntry.timestampId.length < minSizeOfUnixTimestamp || !timestampEntry.timestampId.match(/^\d+\.\d+$/)) {
                    errorMessages.push(`timestampEntry.timestampId: ${toRepresentation(timestampEntry.timestampId)}\nAn timestampEntry must have a "timestampId" property\n- it needs to be a string\n- the string needs to contain digits of a decimal number\n- the base digits need of a unix timestamp (milliseconds)\n- and the a decimal needs to be a random number`)
                }

                // 
                // videoId
                // 
                if (!videoIdIsValid(timestampEntry.videoId)) {
                    errorMessages.push(`timestampEntry.videoId: ${toRepresentation(timestampEntry.videoId)}\nAn timestampEntry must have a "videoId" property\n- it needs to be a string\n- the string needs to not be empty\n- it should be at least 11 charcters long `)
                }

                // 
                // startTime/endTime
                // 
                const startTimeIsNumeric = Number.isFinite(timestampEntry.startTime) && timestampEntry.startTime >= 0
                const endTimeIsNumeric   = Number.isFinite(timestampEntry.endTime)   && timestampEntry.endTime >= 0
                if (!startTimeIsNumeric) {
                    errorMessages.push(`timestampEntry.startTime: ${toRepresentation(timestampEntry.startTime)}\nAn timestampEntry must have a "startTime" property\n- it needs to be a positive number`)
                }
                if (!endTimeIsNumeric) {
                    errorMessages.push(`timestampEntry.endTime: ${toRepresentation(timestampEntry.endTime)}\nAn timestampEntry must have a "endTime" property\n- it needs to be a positive number`)
                }
                if (startTimeIsNumeric && endTimeIsNumeric) {
                    if (timestampEntry.startTime > timestampEntry.endTime) {
                        errorMessages.push(`startTime: ${timestampEntry.startTime}, endTime: ${timestampEntry.endTime}\nAn timestampEntry must have a startTime that is ≤ endTime`)
                    }
                }
                
                // 
                // observer
                // 
                if (!observerIsValid(timestampEntry)) {
                    errorMessages.push(`timestampEntry.observer: ${toRepresentation(timestampEntry.observer)}\nAn timestampEntry must have a "observer" property\n- for human observers it needs to be an email\n- for machine learning models it needs to be a string that contains only lowercase letters, numbers, dashes and periods`)
                }

                // 
                // label
                // 
                if (!labelIsValid(timestampEntry.label)) {
                    errorMessages.push(`timestampEntry.label: ${toRepresentation(timestampEntry.label)}\nAn timestampEntry must have a "label" property\n- it needs to be a string\n- the string needs to not be empty\n- it needs to contain only lowercase letters, numbers, dashes and periods`)
                }
                
                // 
                // confidence
                // 
                if (!labelConfidenceIsValid(timestampEntry.labelConfidence)) {
                    errorMessages.push(`timestampEntry.labelConfidence: ${toRepresentation(timestampEntry.labelConfidence)}\nAn timestampEntry must have a "labelConfidence" property\n- it needs to be a number\n- it needs to be between 1 and -1 (inclusive)`)
                }
                
                // 
                // boolean fields
                //
                if (timestampEntry.isHuman !== true && timestampEntry.isHuman !== false) {
                    errorMessages.push(`timestampEntry.isHuman: ${toRepresentation(timestampEntry.isHuman)}\nAn timestampEntry must have a "isHuman" property\n- it needs to be a boolean\n${JSON.stringify(timestampEntry)}`)
                }
                if (timestampEntry.confirmedBySomeone != null && timestampEntry.confirmedBySomeone !== true && timestampEntry.confirmedBySomeone !== false) {
                    errorMessages.push(`timestampEntry.confirmedBySomeone: ${toRepresentation(timestampEntry.confirmedBySomeone)}\nThe "confirmedBySomeone" property\n- needs to be a boolean or null`)
                }
                if (timestampEntry.rejectedBySomeone != null && timestampEntry.rejectedBySomeone !== true && timestampEntry.rejectedBySomeone !== false) {
                    errorMessages.push(`timestampEntry.rejectedBySomeone: ${toRepresentation(timestampEntry.rejectedBySomeone)}\nAn timestampEntry needs to be a boolean or null`)
                }
                if (timestampEntry.confirmedBy != null && !(timestampEntry.confirmedBy instanceof Array)) {
                    errorMessages.push(`timestampEntry.confirmedBy: ${toRepresentation(timestampEntry.confirmedBy)}\nAn timestampEntry "confirmedBy" property needs to be an array of strings`)
                }
                if (timestampEntry.rejectedBy != null && !(timestampEntry.rejectedBy instanceof Array)) {
                    errorMessages.push(`timestampEntry.rejectedBy: ${toRepresentation(timestampEntry.rejectedBy)}\nAn timestampEntry "rejectedBy" property needs to be an array of strings`)
                }
            }
            errorMessagesPerTimestamp.push(errorMessages)
        }
        return errorMessagesPerTimestamp
    }
// 
// CSV
// 
    const timestampDownlaodHeaders = [
        "uploadAction",
        "timestampId",
        "(type)",
        "videoId",
        "startTime",
        "endTime",
        "observer",
        "isHuman",
        "(confirmedBySomeone)",
        "(rejectedBySomeone)",
        "confirmedBy",
        "rejectedBy",
        "label",
        "labelConfidence",
        "comment",
        "spacialInfo",
    ]
    export function timestampsToCsv(entries) {
        const timestamps = []
        for (const each of entries) {
            // TODO: do coersion of correctness on download
            let confirmedBy = (each?.confirmedBy||[])
            if (!confirmedBy||(confirmedBy instanceof Array&&confirmedBy.length==0)) {
                confirmedBy = null
            }
            let rejectedBy = (each?.rejectedBy||[])
            if (!rejectedBy||(rejectedBy instanceof Array&&rejectedBy.length==0)) {
                rejectedBy = null
            }
            timestamps.push({
                "uploadAction": "update",
                "timestampId": each.timestampId,
                "(type)": each.startTime != each.endTime ? "segment" : "marker",
                "videoId": each.videoId,
                "startTime": each.startTime,
                "endTime": each.endTime,
                "observer": each.observer,
                "isHuman": each.isHuman,
                "(confirmedBySomeone)": each.confirmedBy instanceof Array && each.confirmedBy.length > 0,
                "(rejectedBySomeone)": each.rejectedBy instanceof Array && each.rejectedBy.length > 0,
                confirmedBy,
                rejectedBy,
                "label": each.label,
                "labelConfidence": each.labelConfidence,
                "comment": each.comment||null,
                "spacialInfo": Object.keys(each?.spacialInfo||{}).length > 0 ? each.spacialInfo : null,
            })
            // flatten out video
            for (const [key, value] of Object.entries(each.video||{})) {
                timestamps.slice(-1)[0][`(video.${key})`] = value
            }
            // flatten out customInfo
            for (const [key, value] of Object.entries(each.customInfo||{})) {
                timestamps.slice(-1)[0][`customInfo.${key}`] = value
            }
        }
        const output = typedCsv.stringify(timestamps)
        return output
    }

    export const timestampsCsvToActions = async (csvString) => {
        const { headers, rows: timestampEntries } = typedCsv.parse(csvString)
        const timestampActions = []
        for (const eachRow of timestampEntries) {
            const { uploadAction, timestampId, ...eachEntry } = Object.fromEntries(basics.zip(headers, eachRow))
            if (uploadAction == "ignore") {
                continue
            }
            if (typeof timestampId != "string") {
                continue
            }
            const timestampObject = {
                timestampId,
                customInfo: {},
            }
            // rebuild customInfo
            for (const [key, value] of Object.entries(eachEntry)) {
                if (key.startsWith("customInfo.")) {
                    const customInfoKey = key.replace(/^customInfo\./, "")
                    timestampObject.customInfo[customInfoKey] = value
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
                        timestampObject[detectedKey] = eachEntry[detectedKey]
                    }
                } else if (uploadAction=="overwrite") {
                    timestampObject[detectedKey] = eachEntry[detectedKey]
                }
            }
            eachEntry.confirmedBy = `${eachEntry.confirmedBy}`.split(",")
            eachEntry.rejectedBy  = `${eachEntry.rejectedBy}`.split(",")
            
            timestampActions.push([ uploadAction, [timestampId], timestampObject ])
        }
        return timestampActions    
    }

