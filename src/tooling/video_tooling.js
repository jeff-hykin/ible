import { Path, toString } from "./basics.bundle.js"
import { videoExtensions } from "../utils.js"
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
            
            // NOTE: 
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
                "=latestVideoAction": latestVideoAction,
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
        console.debug(`videoEntries is:`,videoEntries)
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
        let videoObserverRows = []
        for (const each of videos) {
            const usersFinishedWatching  = each.usersFinishedWatchingAt||{}
            const usersFinishedLabeling  = each.usersFinishedLabelingAt||{}
            const usersFinishedVerifying = each.usersFinishedVerifyingAt||{}
            
            for (const [username, timeFinished] of Object.entries(usersFinishedWatching)) {
                videoObserverRows.push({
                    "uploadAction": "update",
                    "videoId": each.videoId,
                    "observer": username,
                    "observerAction": "watch",
                    "timeFinished": new Date(timeFinished),
                })
            }
            for (const [username, timeFinished] of Object.entries(usersFinishedLabeling)) {
                videoObserverRows.push({
                    "uploadAction": "update",
                    "videoId": each.videoId,
                    "observer": username,
                    "observerAction": "label",
                    "timeFinished": new Date(timeFinished),
                })
            }
            for (const [username, timeFinished] of Object.entries(usersFinishedVerifying)) {
                videoObserverRows.push({
                    "uploadAction": "update",
                    "videoId": each.videoId,
                    "observer": username,
                    "observerAction": "verify",
                    "timeFinished": new Date(timeFinished),
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

    export const videoObserverTableCsvToActions = async (csvString) => {
        const videoObserverRows = await csvTools.parseCsv(csvString)
        const headers = videoObserverRows.shift()
        const videos = {}
        const videoActions = []
        for (const eachRow of videoObserverRows) {
            const { uploadAction, videoId, observer, observerAction, timeFinished, ...other } = Object.fromEntries(basics.zip(headers, eachRow))
            if (uploadAction == "ignore") {
                continue
            }
            if (typeof videoId != "string") {
                continue
            }
            if (typeof observer != "string") {
                continue
            }
            if (uploadAction == "delete") {
                const keyList = [ "videoId", ]
                if (observerAction == "watch") {
                    keyList.push("usersFinishedWatchingAt")
                    keyList.push(observer)
                } else if (observerAction == "label") {
                    keyList.push("usersFinishedLabelingAt")
                    keyList.push(observer)
                } else if (observerAction == "verify") {
                    keyList.push("usersFinishedVerifyingAt")
                    keyList.push(observer)
                }
                videoActions.push([ uploadAction, keyList ])
                continue
            }

            videos[videoId] = videos[videoId] || {videoId}
            const videoObject = videos[videoId]
            if (observerAction == "watch") {
                videoObject.usersFinishedWatchingAt = videoObject.usersFinishedWatchingAt || {}
                videoObject.usersFinishedWatchingAt[observer] = timeFinished-0
            } else if (observerAction == "label") {
                videoObject.usersFinishedLabelingAt = videoObject.usersFinishedLabelingAt || {}
                videoObject.usersFinishedLabelingAt[observer] = timeFinished-0
            } else if (observerAction == "verify") {
                videoObject.usersFinishedVerifyingAt = videoObject.usersFinishedVerifyingAt || {}
                videoObject.usersFinishedVerifyingAt[observer] = timeFinished-0
            }
        }
        for (const [videoId, videoObject] of Object.entries(videos)) {
            videoActions.push([ "update", [videoId], videoObject ])
        }
        return videoActions
    }