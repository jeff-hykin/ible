import { toString, toRepresentation } from "./string.js"
import * as yaml from 'yaml'

const localVideoPrefix = "/videos/"

export const isLocalVideo = (videoId) => toString(videoId).startsWith(localVideoPrefix)
export const getLocalVideoName = (videoId) => toString(videoId).slice(localVideoPrefix.length)
export const createUuid = ()=>new Date().getTime() + `${Math.random()}`.slice(1)
export const minSizeOfUnixTimestamp = 10
export const currentFixedSizeOfYouTubeVideoId = 11
export const minSizeOfLocalVideoId = localVideoPrefix.length

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
export const createDefaultObservationEntry = ()=>({
    createdAt: createUuid(),
    type: "segment",
    videoId:            null,
    startTime:          (window.player?.currentTime||0).toFixed(3)-0,
    endTime:            ((window.player?.currentTime||0)+0.01).toFixed(3)-0,
    observer:           storageObject.observer||"",
    isHuman:            true,
    confirmedBySomeone: false,
    rejectedBySomeone:  false,
    observation: {
        label:           storageObject.recentLabel || "example-label",
        labelConfidence: 0.95,
        spacialInfo:     {},
    },
    customInfo: {},
})

// 
// indvidual coercsion
// 
    const nameCoerce = name=>toKebabCase(name.toLowerCase().replace(/[^a-zA-Z0-9-.]/g, "-"), {keepTrailingSeparators:true, allowLongSplits:true})
    export function coerceLabel(label) {
        return nameCoerce(label)
    }
    export function coerceObserver(observer) {
        return nameCoerce(observer)
    }
    export function coerceCreatedAt(createdAt) {
        if (typeof createdAt != 'string') {
            const asString = toString(createdAt)
            if (createdAtIsValid(asString)) {
                createdAt = asString
            } else {
                createdAt = createUuid()
            }
        }
        return createdAt
    }

// 
// indvidual checks
// 
    export function createdAtIsValid(createdAt) {
        if (typeof createdAt != "string" || createdAt.length < minSizeOfUnixTimestamp || !createdAt.match(/^\d+\.\d+$/)) {
            return false
        }
        return true
    }
    export function videoIdIsValid(videoId) {
        if (typeof videoId == "string") {
            if (isLocalVideo(videoId) || videoId.length == currentFixedSizeOfYouTubeVideoId) {
                return true
            }
        }
        return false
    }
    export function labelConfidenceIsValid(labelConfidence) {
        if (Number.isFinite(labelConfidence)) {
            if (labelConfidence <= 1 && labelConfidence >= -1) {
                return true
            }
        }
        return false
    }
    export function observerIsValid(observer) {
        if (typeof observer != "string" || !isValidName(observer)) {
            return false
        }
        return true
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
        observationData.startTime-=0
        observationData.endTime-=0
        observationData.labelConfidence-=0
        
        return {
            startTime: observationData.startTime >= 0 && observationData.startTime < observationData.endTime,
            endTime: observationData.endTime > 0 && observationData.startTime < observationData.endTime && (videoDuration?observationData.endTime <= videoDuration:true),
            label: isValidName(observationData?.label),
            observer: isValidName(observationData?.observer),
            labelConfidence: labelConfidenceIsValid(observationData.labelConfidence),
            videoId: videoIdIsValid(observationData.videoId),
        }
    }
    /**
     * guarentees createdAt will be correct and tries to help label, observer, startTime, endTime 
     */
    export function coerceObservation(observationEntry) {
        observationEntry = {...observationEntry}
        // 
        // enforce unix timestamp (e.g. id)
        // 
        observationEntry.createdAt = coerceCreatedAt(observationEntry.createdAt)
        
        // 
        // enforce simplfied names
        // 
        observationEntry.observer = coerceObserver(observationEntry.observer)
        if (!(observationEntry.observation instanceof Object)) {
            observationEntry.observation = {}
        }
        observationEntry.observation.label = coerceLabel(observationEntry.observation.label)

        // 
        // enforce numeric start/endTimes 
        // 
        observationEntry.startTime -= 0
        observationEntry.endTime   -= 0
        observationEntry.observation.labelConfidence -= 0

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
                // createdAt
                // 
                if (typeof observationEntry.createdAt != "string" || observationEntry.createdAt.length < minSizeOfUnixTimestamp || !observationEntry.createdAt.match(/^\d+\.\d+$/)) {
                    errorMessages.push(`observationEntry.createdAt: ${toRepresentation(observationEntry.createdAt)}\nAn observationEntry must have a "createdAt" property\n- it needs to be a string\n- the string needs to contain digits of a decimal number\n- the base digits need of a unix timestamp (milliseconds)\n- and the a decimal needs to be a random number`)
                }

                // 
                // videoId
                // 
                if (!videoIdIsValid(observationEntry.videoId)) {
                    errorMessages.push(`observationEntry.videoId: ${toRepresentation(observationEntry.videoId)}\nAn observationEntry must have a "videoId" property\n- it needs to be a string\n- the string needs to not be empty\n- it needs to either start with "/videos/" for local videos or be exactly 11 characters long for YouTube video ids`)
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
                    if (observationEntry.startTime >= observationEntry.endTime) {
                        errorMessages.push(`startTime: ${observationEntry.startTime}, endTime: ${observationEntry.endTime}\nAn observationEntry must have a startTime that is < endTime`)
                    }
                }
                
                // 
                // observer
                // 
                if (!observerIsValid(observationEntry.observer)) {
                    errorMessages.push(`observationEntry.observer: ${toRepresentation(observationEntry.observer)}\nAn observationEntry must have a "observer" property\n- it needs to be a string\n- the string needs to not be empty\n- it needs to contain only lowercase letters, numbers, dashes and periods`)
                }

                // 
                // observation
                // 
                if (!(observationEntry.observation instanceof Object) ) {
                    errorMessages.push(`observationEntry.observation: ${toRepresentation(observationEntry.observation)}\nAn observationEntry must have a "observation" property\n- it needs to be an object`)
                }

                // 
                // label
                // 
                if (!labelIsValid(observationEntry?.observation?.label)) {
                    errorMessages.push(`observationEntry.observation.label: ${toRepresentation(observationEntry.observation.label)}\nAn observationEntry must have a "observation": { "label":  }\n- it needs to be a string\n- the string needs to not be empty\n- it needs to contain only lowercase letters, numbers, dashes and periods`)
                }
                
                // 
                // confidence
                // 
                if (!labelConfidenceIsValid(observationEntry?.observation?.labelConfidence)) {
                    errorMessages.push(`observationEntry.observation.labelConfidence: ${toRepresentation(observationEntry.observation.label)}\nAn observationEntry must have a "observation": { "labelConfidence": }\n- it needs to be a number\n- it needs to be between 1 and -1 (inclusive)`)
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