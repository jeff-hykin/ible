import { Path, toString } from "./basics.bundle.js"
import { videoExtensions } from "../utils.js"
import * as csvTools from "./csv_tooling.js"
export const localVideoPrefix = "/videos/"

export const isLocalVideo = (videoId) => videoId && !(
        (videoId.match(/.*www\.youtube\.com/) && videoId.match(/.+(?:\?|&)v=(.{11})/))
        ||
        (videoId.match(/.*youtu\.be\//) && videoId.match(/.*youtu.be\/(.{11})/))
    )
    // toString(videoId).replace(/\\videos\\/g, "/videos/").startsWith(localVideoPrefix)
export const minSizeOfUnixTimestamp = 10
export const currentFixedSizeOfYouTubeVideoId = 11
export const minSizeOfLocalVideoId = localVideoPrefix.length
export const endsWithVideoExtension = (videoPath) => {
    const ending = toString(videoPath).split(".").slice(-1)[0]
    return videoPath.includes(".") && videoExtensions.includes(ending)
}

export const extractYoutubeVideoId = (newVideoId) => {
     try {
        if (newVideoId.match(/.*www\.youtube\.com/)) {
            return newVideoId.match(/.+(?:\?|&)v=(.{11})/)[1]
        } else if (newVideoId.match(/.*youtu\.be\//)) {
            return newVideoId.match(/.*youtu.be\/(.{11})/)[1]
        }
    } catch (error) {}
    return undefined
}

const minimumLocalIdSize = 7
export const extractLocalVideoId = (path) => {
    let fileName = Path.basename(toString(path))
    if (!fileName.includes(".") || !endsWithVideoExtension(path) || fileName.split(".").length <= 2 || fileName.split(".").slice(-2)[0].length < minimumLocalIdSize) {
        return null
    } else {
        return fileName.split(".").slice(-2)[0]
    }
}
export const extractLocalVideoNameFromPath = (videoPath) => {
    if (!videoPath) {
        return ""
    }
    const localId = extractLocalVideoId(videoPath)
    if (!localId) {
        return Path.basename(videoPath)
    } else {
        let nameParts = Path.basename(videoPath).split(".")
        return nameParts.slice(0,-2).join(".")
    }
}

export function videoIdIsValid(videoId) {
    // FIXME: 
    if (typeof videoId == "string") {
        console.debug(`isLocalVideo(${videoId}) is:`,isLocalVideo(videoId))
        if (isLocalVideo(videoId) || videoId.length == currentFixedSizeOfYouTubeVideoId) {
            return true
        }
    }
    return false
}

/**
 * searchTermToVideoInfo
 *
 * @example
 *     console.log(
 *        searchTermToVideoInfo("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
 *     )
 *     // {
 *     //     isYoutubeUrl: true,
 *     //     hasProblem: false,
 *     //     videoId: "dQw4w9WgXcQ",
 *     //     path: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
 *     // }
 */
export const searchTermToVideoInfo = (searchTerm)=>{
    if (!searchTerm) {
        return null
    }
    const isYoutubeUrl = !isLocalVideo(searchTerm)
    if (isYoutubeUrl) {
        return {
            isYoutubeUrl: true,
            videoId: extractYoutubeVideoId(searchTerm),
            path: searchTerm,
        }
    } else {
        const localVideoId = extractLocalVideoId(searchTerm)
        return {
            isYoutubeUrl: false,
            videoId: localVideoId,
            path: `/videos/${searchTerm}`,
        }
    }
}

export const videosToCsv = async (videos) => {
    const headers = []
    let videoRows = []
    for (const each of videos) {
        const usersWhoFinishedWatching  = Object.keys(each.usersFinishedWatchingAt||{})
        const usersWhoFinishedLabeling  = Object.keys(each.usersFinishedLabelingAt||{})
        const usersWhoFinishedVerifying = Object.keys(each.usersFinishedVerifyingAt||{})
        
        videoRows.push({
            "uploadAction": "update",
            "videoId": each.videoId,
            "path": each.path,
            "duration": each.duration,
            "comment": each.comment||"",
            "=numberOfObservations": each.numberOfObservations,
            "=numberOfWatchers": usersWhoFinishedWatching.length,
            "=numberOfLabelers": usersWhoFinishedLabeling.length,
            "=numberOfVerifiers": usersWhoFinishedVerifying.length,
            "=usersWhoFinishedWatching": usersWhoFinishedWatching.join(","),
            "=usersWhoFinishedLabeling": usersWhoFinishedLabeling.join(","),
            "=usersWhoFinishedVerifying": usersWhoFinishedVerifying.join(","),
        })
        // flatten out customInfo
        for (const [key, value] of Object.entries(each.customInfo||{})) {
            videoRows.slice(-1)[0][`customInfo.${key}`] = JSON.stringify(value)
        }
    }
    
    return csvTools.convertToCsv(
        videoRows, 
        {
            defaultHeaders: [
                "uploadAction",
                "videoId",
                "path",
                "duration",
            ],
        }
    )
}

export const videoObserverTableToCsv = async (videos) => {
    let videoObserverRows = []
    for (const each of videos) {
        const usersWhoFinishedWatching  = Object.keys(each.usersFinishedWatchingAt||{})
        const usersWhoFinishedLabeling  = Object.keys(each.usersFinishedLabelingAt||{})
        const usersWhoFinishedVerifying = Object.keys(each.usersFinishedVerifyingAt||{})
        
        for (const [username, timeFinished] of Object.entries(usersWhoFinishedWatching)) {
            videoObserverRows.push({
                "uploadAction": "update",
                "videoId": each.videoId,
                "observer": username,
                "observerAction": "watch",
                "timeFinished": new Date(timeFinished).toISOString(),
            })
        }
        for (const [username, timeFinished] of Object.entries(usersWhoFinishedLabeling)) {
            videoObserverRows.push({
                "uploadAction": "update",
                "videoId": each.videoId,
                "observer": username,
                "observerAction": "label",
                "timeFinished": new Date(timeFinished).toISOString(),
            })
        }
        for (const [username, timeFinished] of Object.entries(usersWhoFinishedVerifying)) {
            videoObserverRows.push({
                "uploadAction": "update",
                "videoId": each.videoId,
                "observer": username,
                "observerAction": "verify",
                "timeFinished": new Date(timeFinished).toISOString(),
            })
        }
    }
    
    return csvTools.convertToCsv(
        videoObserverRows, 
        {
            defaultHeaders: [
                "uploadAction",
                "videoId",
                "observer",
                "observerAction",
                "timeFinished",
            ],
        }
    )
}