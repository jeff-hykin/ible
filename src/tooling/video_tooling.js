import { Path, toString } from "./basics.bundle.js"
import { videoExtensions } from "./pure_tools.js"
import * as csvTools from "./csv_tooling.js"
export const localVideoPrefix = "/videos/"

export const minimumLocalIdSize = 7
export const minSizeOfUnixTimestamp = 10
export const currentFixedSizeOfYouTubeVideoId = 11

// 
// Video Data Structures (As of right now, June 27 2024)
// 
    // (conceptually/ideally) its this:
        // {
        //     videoId: String,
        //     durationInSeconds: Number,
        //     path: String,
        //     comment: String or null,
        //     customInfo: {
        //         [key]: String,
        //     },
        //     usersFinishedWatchingAt: {
        //         [username]: unix timestamp in milliseconds as Number,
        //     },
        //     usersFinishedLabelingAt: {
        //         [username]: unix timestamp in milliseconds as Number,
        //     },
        //     usersFinishedVerifyingAt: {
        //         [username]: unix timestamp in milliseconds as Number,
        //     },
        // }

// 
// simple helpers/validation
// 
    export const enforceStandardVideoFormat = (videoInfo) => {
        videoInfo = videoInfo || {}
        return {
            videoId: videoInfo.videoId,
            durationInSeconds: videoInfo.durationInSeconds,
            path: videoInfo.path,
            comment: videoInfo.comment,
            customInfo: videoInfo.customInfo,
            usersFinishedWatchingAt: videoInfo.usersFinishedWatchingAt||{},
            usersFinishedLabelingAt: videoInfo.usersFinishedLabelingAt||{},
            usersFinishedVerifyingAt: videoInfo.usersFinishedVerifyingAt||{},
        }
    }
    export const isYoutubeVideoUrl = (videoId) => typeof videoId == "string" && (
            (videoId.match(/.*www\.youtube\.com/) && videoId.match(/.+(?:\?|&)v=(.{11})/))
            ||
            (videoId.match(/.*youtu\.be\//) && videoId.match(/.*youtu.be\/(.{11})/))
        )
    export const isLocalVideo = (videoId) => videoId && !isYoutubeVideoUrl(videoId)

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
        if (typeof videoId == "string") {
            if (isYoutubeVideoUrl(videoId) && videoId.length == currentFixedSizeOfYouTubeVideoId) {
                return true
            } else if (isLocalVideo(videoId) && videoId.trim().length >= minimumLocalIdSize) {
                return true
            }
        }
        return false
    }

// 
// complicated one-off helpers
// 
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
                path: searchTerm,
            }
        }
    }

// 
// csv operations
// 
    export const videosToCsv = async (videos) => {
        let videoRows = []
        for (const each of videos) {
            const usersWhoFinishedWatching  = Object.keys(each.usersFinishedWatchingAt||{})
            const usersWhoFinishedLabeling  = Object.keys(each.usersFinishedLabelingAt||{})
            const usersWhoFinishedVerifying = Object.keys(each.usersFinishedVerifyingAt||{})
            
            const latestVideoAction = Math.max([
                ...Object.values(each.usersFinishedWatchingAt||{}),
                ...Object.values(each.usersFinishedLabelingAt||{}),
                ...Object.values(each.usersFinishedVerifyingAt||{}),
            ])
            
            videoRows.push({
                "uploadAction": "update",
                "videoId": each.videoId,
                "path": each.path,
                "durationInSeconds": each.durationInSeconds,
                "comment": each.comment,
                // "(latestVideoAction)": latestVideoAction,
                "(numberOfObservations)": each.numberOfObservations,
                "(numberOfWatchers)": usersWhoFinishedWatching.length,
                "(numberOfLabelers)": usersWhoFinishedLabeling.length,
                "(numberOfVerifiers)": usersWhoFinishedVerifying.length,
                "(usersWhoFinishedWatching)": usersWhoFinishedWatching,
                "(usersWhoFinishedLabeling)": usersWhoFinishedLabeling,
                "(usersWhoFinishedVerifying)": usersWhoFinishedVerifying,
            })
            // flatten out customInfo
            for (const [key, value] of Object.entries(each.customInfo||{})) {
                videoRows.slice(-1)[0][`customInfo.${key}`] = value
            }
        }
        
        return csvTools.convertToCsv(
            videoRows, 
            {
                defaultHeaders: [
                    "uploadAction",
                    "videoId",
                    "path",
                    "durationInSeconds",
                    "comment",
                ],
            }
        )
    }

    export const videosCsvToActions = async (csvString) => {
        const videoEntries = await csvTools.parseCsv(csvString)
        const headers = videoEntries.shift()
        const videoActions = []
        for (const eachRow of videoEntries) {
            const { uploadAction, videoId, ...eachEntry } = Object.fromEntries(basics.zip(headers, eachRow))
            if (uploadAction == "ignore") {
                continue
            }
            if (typeof videoId != "string") {
                continue
            }
            const videoObject = {
                videoId,
                customInfo: {},
            }
            // rebuild customInfo
            for (const [key, value] of Object.entries(eachEntry)) {
                if (key.startsWith("customInfo.")) {
                    const customInfoKey = key.replace(/^customInfo\./, "")
                    videoObject.customInfo[customInfoKey] = value
                }
            }
            
            const detectedKeys = [
                "durationInSeconds",
                "path",
                "comment",
            ]
            for (const detectedKey of detectedKeys) {
                if (uploadAction=="update") {
                    if (eachEntry[detectedKey] != null) {
                        videoObject[detectedKey] = eachEntry[detectedKey]
                    }
                } else if (uploadAction=="overwrite") {
                    videoObject[detectedKey] = eachEntry[detectedKey]
                }
            }
            
            videoActions.push([ uploadAction, [videoId], videoObject ])
        }
        return videoActions
    }

    export const videoObserverTableToCsv = async (videos) => {
        const videoObservers = {}
        for (const each of videos) {
            if (!each.videoId) {
                continue
            }
            const usersFinishedWatching  = each.usersFinishedWatchingAt||{}
            const usersFinishedLabeling  = each.usersFinishedLabelingAt||{}
            const usersFinishedVerifying = each.usersFinishedVerifyingAt||{}
            const initEntry = (observer)=>{
                const id = JSON.stringify([observer, each.videoId])
                videoObservers[id] = videoObservers[id] || {
                    uploadAction: "update",
                    videoId: each.videoId,
                    observer: observer,
                    watchedVideoAt: null,
                    labeledVideoAt: null,
                    verifiedVideoAt: null,
                }
                return videoObservers[id]
            }
            
            for (const [username, timeFinished] of Object.entries(usersFinishedWatching)) {
                const entry = initEntry(username)
                if (timeFinished != null) {
                    entry.watchedVideoAt = new Date(timeFinished)
                }
            }
            for (const [username, timeFinished] of Object.entries(usersFinishedLabeling)) {
                const entry = initEntry(username)
                if (timeFinished != null) {
                    entry.labeledVideoAt = new Date(timeFinished)
                }
            }
            for (const [username, timeFinished] of Object.entries(usersFinishedVerifying)) {
                const entry = initEntry(username)
                if (timeFinished != null) { 
                    entry.verifiedVideoAt = new Date(timeFinished)
                }
            }
        }
        
        return csvTools.convertToCsv(
            Object.values(videoObservers), 
            {
                defaultHeaders: [
                    "uploadAction",
                    "videoId",
                    "observer",
                    "watchedVideoAt",
                    "labeledVideoAt",
                    "verifiedVideoAt",
                ],
            }
        )
    }

    export const videoObserverTableCsvToActions = async (csvString) => {
        const videoObserverRows = await csvTools.parseCsv(csvString)
        const headers = videoObserverRows.shift()
        const videos = {}
        const videoActions = []
        for (const eachRow of videoObserverRows) {
            let { uploadAction, videoId, observer, watchedVideoAt, labeledVideoAt, verifiedVideoAt, ...other } = Object.fromEntries(basics.zip(headers, eachRow))
            if (uploadAction == "ignore") {
                continue
            }
            if (typeof videoId != "string") {
                continue
            }
            if (typeof observer != "string") {
                continue
            }

            videos[videoId] = videos[videoId] || {videoId}
            const videoObject = videos[videoId]
            videoObject.usersFinishedWatchingAt = videoObject.usersFinishedWatchingAt || {}
            videoObject.usersFinishedLabelingAt = videoObject.usersFinishedLabelingAt || {}
            videoObject.usersFinishedVerifyingAt = videoObject.usersFinishedVerifyingAt || {}
            
            const videoMergeData = {videoId}
            if (uploadAction == "delete") {
                videoObject.usersFinishedWatchingAt[observer] = null
                videoObject.usersFinishedWatchingAt[observer] = null
                videoObject.usersFinishedLabelingAt[observer] = null
                continue
            }
            
            // TODO: if string, try to convert to date or unix timestamp

            // convert to unix timestamp
            if (watchedVideoAt instanceof Date) { watchedVideoAt = watchedVideoAt.getTime() }
            if (labeledVideoAt instanceof Date) { labeledVideoAt = watchedVideoAt.getTime() }
            if (verifiedVideoAt instanceof Date) { verifiedVideoAt = watchedVideoAt.getTime() }

            videoObject.usersFinishedWatchingAt[observer]  = watchedVideoAt
            videoObject.usersFinishedLabelingAt[observer]  = labeledVideoAt
            videoObject.usersFinishedVerifyingAt[observer] = verifiedVideoAt
        }
        for (const [videoId, videoObject] of Object.entries(videos)) {
            videoActions.push([ "update", [videoId], videoObject ])
        }
        return videoActions
    }