import { Path, toString } from "./basics.bundle.js"
import { videoExtensions } from "../utils.js"
export const localVideoPrefix = "/videos/"

export const isLocalVideo = (videoId) => videoId && !(
        (videoId.match(/.*www\.youtube\.com/) && videoId.match(/.+(?:\?|&)v=(.{11})/))
        ||
        (videoId.match(/.*youtu\.be\//) && videoId.match(/.*youtu.be\/(.{11})/))
    )
    // toString(videoId).replace(/\\videos\\/g, "/videos/").startsWith(localVideoPrefix)
export const getLocalVideoName = (videoPath) => videoPath
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
        console.debug(`searchTerm is:`,searchTerm)
        const localVideoId = extractLocalVideoId(searchTerm)
        return {
            isYoutubeUrl: false,
            videoId: localVideoId,
            path: `/videos/${searchTerm}`,
        }
    }
}