export const localVideoPrefix = "/videos/"

export const isLocalVideo = (videoId) => !(
        (videoId.match(/.*www\.youtube\.com/) && videoId.match(/.+(?:\?|&)v=(.{11})/))
        ||
        (videoId.match(/.*youtu\.be\//) && videoId.match(/.*youtu.be\/(.{11})/))
    )
    // toString(videoId).replace(/\\videos\\/g, "/videos/").startsWith(localVideoPrefix)
export const getLocalVideoName = (videoPath) => videoPath
export const createUuid = ()=>new Date().getTime() + `${Math.random()}`.slice(1)
export const minSizeOfUnixTimestamp = 10
export const currentFixedSizeOfYouTubeVideoId = 11
export const minSizeOfLocalVideoId = localVideoPrefix.length

