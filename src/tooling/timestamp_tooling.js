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

export class Timestamp {
    constructor(arg={},{currentTime=0, observer="", recentLabel=""}={currentTime:0, observer:"",recentLabel:""}) {
        this.timestampId         = createUuid()
        this.videoId             = null
        this.startTime           = (currentTime||0).toFixed(3)-0
        this.endTime             = (currentTime||0).toFixed(3)-0
        this.observer            = observer||""
        this.isHuman             = true
        this.confirmedBy         = []
        this.rejectedBy          = []
        this.label               = recentLabel || "example-label"
        this.labelConfidence     = 1.0
        this.comment             = ""
        this.spacialInfo         = {}
        for (const [key, value] of Object.entries(arg||{})) {
            try {
                this[key] = value
            } catch (error) {
                
            }
        }
        this.confirmedBy = this.confirmedBy||[]
        this.rejectedBy  = this.rejectedBy||[]
    }
    
    /**
     * guarentees timestampId will be correct and tries to help label, observer, startTime, endTime 
     */
    coerce() {
        // 
        // enforce unix timestamp (e.g. id)
        // 
        this.timestampId = coerceTimestampId(this.timestampId)
        
        // 
        // enforce simplfied names
        // 
        this.label = coerceLabel(this.label)

        // 
        // enforce numeric start/endTimes 
        // 
        this.startTime -= 0
        this.endTime   -= 0
        this.labelConfidence -= 0

        // help customInfo show up
        this.customInfo = this.customInfo||{}
        
        return this
    }

    get type() { return this.startTime !== this.endTime ? "segment" : "marker" }
    get confirmedBySomeone() { return this.confirmedBy.length>0 }
    get rejectedBySomeone() { return this.rejectedBy.length>0 }
    get duration() { return this.endTime - this.startTime }
    
    toJSON() {
        return {
            timestampId:            this.timestampId,
            "(type)":               this.type,
            videoId:                this.videoId,
            startTime:              this.startTime,
            endTime:                this.endTime,
            observer:               this.observer,
            isHuman:                this.isHuman,
            "(confirmedBySomeone)": this.confirmedBySomeone,
            "(rejectedBySomeone)":  this.rejectedBySomeone,
            confirmedBy:            [...this.confirmedBy],
            rejectedBy:             [...this.rejectedBy],
            label:                  this.label,
            labelConfidence:        this.labelConfidence,
            comment:                this.comment,
            spacialInfo:            JSON.parse(JSON.stringify(this.spacialInfo||{})),
            customInfo:             JSON.parse(JSON.stringify(this.customInfo||{})),
        }
    }
}

export const createUuid = ()=>`v${new Date().getTime()}${Math.random()}`.slice(1)

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
    export function timestampsToCsv(entries) {
        const timestamps = []
        for (const each of entries) {
            const outputTimestamp = (new Timestamp(each)).toJSON()
            timestamps.push(outputTimestamp)
            // NOTE: there is no video key
            // // flatten out video
            // for (const [key, value] of Object.entries(each.video||{})) {
            //     timestamps.slice(-1)[0][`(video.${key})`] = value
            // }
            // flatten out customInfo
            for (const [key, value] of Object.entries(each.customInfo||{})) {
                timestamps.slice(-1)[0][`customInfo.${key}`] = value
            }
        }
        const output = typedCsv.stringify(timestamps)
        return output
    }
    
    const autoProcessKeys = Object.keys(new Timestamp()).filter(key=>key!="customInfo")
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
            
            for (const detectedKey of autoProcessKeys) {
                if (uploadAction=="update") {
                    if (eachEntry[detectedKey] != null) {
                        timestampObject[detectedKey] = eachEntry[detectedKey]
                    }
                } else if (uploadAction=="overwrite") {
                    timestampObject[detectedKey] = eachEntry[detectedKey]
                }
            }
            
            timestampActions.push([ uploadAction, [timestampId], timestampObject ])
        }
        return timestampActions    
    }

