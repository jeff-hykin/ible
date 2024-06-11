import { toString, toRepresentation } from "./string.js"

const localVideoPrefix = "/videos/"

export const isLocalVideo = (videoId) => toString(videoId).startsWith(localVideoPrefix)
export const getLocalVideoName = (videoId) => toString(videoId).slice(localVideoPrefix.length)
export const minSizeOfUnixTimestamp = 10
export const minSizeOfYouTubeVideoId = 11
export const minSizeOfLocalVideoId = localVideoPrefix.length

const namePattern = /^[a-z0-9-.]+$/
function isValidName(value) {
    if (typeof value == 'string') {
        return !!value.match(namePattern)
    }
    return false
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
                errorMessages.push(`(observationEntry.createdAt: ${toRepresentation(observationEntry.createdAt)})\n\nAn observationEntry must have a "createdAt" property\n- it needs to be a string\n- the string needs to contain digits of a decimal number\n- the base digits need of a unix timestamp (milliseconds)\n- and the a decimal needs to be a random number`)
            }

            // 
            // videoId
            // 
            if (typeof observationEntry.videoId != "string" || videoId.length < Math.min([minSizeOfLocalVideoId, minSizeOfYouTubeVideoId])) {
                errorMessages.push(`(observationEntry.videoId: ${toRepresentation(observationEntry.videoId)})\n\nAn observationEntry must have a "observer" property\n- it needs to be a string\n- the string needs to not be empty\n- it needs to contain only lowercase letters, numbers, dashes and periods`)
            }

            // 
            // startTime/endTime
            // 
            const startTimeIsNumeric = Number.isFinite(observationEntry.startTime) && observationEntry.startTime >= 0
            const endTimeIsNumeric   = Number.isFinite(observationEntry.endTime)   && observationEntry.endTime >= 0
            if (!startTimeIsNumeric) {
                errorMessages.push(`(observationEntry.startTime: ${toRepresentation(observationEntry.startTime)})\n\nAn observationEntry must have a "startTime" property\n- it needs to be a positive number`)
            }
            if (!endTimeIsNumeric) {
                errorMessages.push(`(observationEntry.endTime: ${toRepresentation(observationEntry.endTime)})\n\nAn observationEntry must have a "endTime" property\n- it needs to be a positive number`)
            }
            if (startTimeIsNumeric && endTimeIsNumeric) {
                if (observationEntry.startTime >= observationEntry.endTime) {
                    errorMessages.push(`(startTime: ${observationEntry.startTime}, endTime: ${observationEntry.endTime})\n\nAn observationEntry must have a startTime that is < endTime`)
                }
            }
            
            // 
            // observer
            // 
            if (typeof observationEntry.observer != "string" || !isValidName(observationEntry.observer)) {
                errorMessages.push(`(observationEntry.observer: ${toRepresentation(observationEntry.observer)})\n\nAn observationEntry must have a "observer" property\n- it needs to be a string\n- the string needs to not be empty\n- it needs to contain only lowercase letters, numbers, dashes and periods`)
            }

            // 
            // observation
            // 
            if (!(observationEntry.observation instanceof Object) ) {
                errorMessages.push(`(observationEntry.observation: ${toRepresentation(observationEntry.observation)})\n\nAn observationEntry must have a "observation" property\n- it needs to be an object`)
            }

            // 
            // label
            // 
            if (typeof observationEntry?.observation?.label != "string" || !isValidName(observationEntry.observation.label)) {
                errorMessages.push(`(observationEntry.observation.label: ${toRepresentation(observationEntry.observation.label)})\n\nAn observationEntry must have a "observation": { "label":  }\n- it needs to be a string\n- the string needs to not be empty\n- it needs to contain only lowercase letters, numbers, dashes and periods`)
            }
            
            // 
            // confidence
            // 
            if (!Number.isFinite(observationEntry?.observation?.labelConfidence) || observationEntry.observation.labelConfidence < -1 || observationEntry.observation.labelConfidence > 1) {
                errorMessages.push(`(observationEntry.observation.labelConfidence: ${toRepresentation(observationEntry.observation.label)})\n\nAn observationEntry must have a "observation": { "labelConfidence": }\n- it needs to be a number\n- it needs to be between 1 and -1 (inclusive)`)
            }
            
            // return {
            //     startTime: observationData.startTime >= 0 && observationData.startTime < observationData.endTime,
            //     endTime: observationData.endTime > 0 && observationData.startTime < observationData.endTime && observationData.endTime <= window.player.duration,
            //     label: isValidName(get(observationData, ["label"])),
            //     observer: isValidName(get(observationData, ["observer"])),
            //     labelConfidence: labelConfidenceCheck(observationData.labelConfidence),
            //     videoId: isString(observationData.videoId) && (observationData.videoId.length == currentFixedSizeOfYouTubeVideoId || observationData.videoId.startsWith("/videos/")),
            // }
        }
        errorMessagesPerObservation.push(errorMessages)
    }
    return errorMessagesPerObservation
}