<template lang="pug">
    column.video-list-container(width="100%" padding="1rem" align-v="top")
        ui-button(
            v-show="(!$root.noSearch) || (videoResults.length == 0)"
            @click="showAll"
        )
            | Show All
        br
        span(v-if="videoResults.length == 0")
            | (No other videos matching this search)
        column.video-list-element(v-for="eachVideo in videoResults" @click="$root.videoInterface.goToThisVideo(eachVideo)")
            row.thumbnail(width="100%" height="100%" :background-image="eachVideo.isLocalVideo ? `url(/icon.png)` : `url(http://img.youtube.com/vi/${eachVideo.videoId}/mqdefault.jpg)`" position="relative" border-radius="0.5rem" overflow="hidden")
                //- this is just used as a thumbnail
                video(
                    v-if="eachVideo.path"
                    :src="`/videos/${eachVideo.path}`"
                    style="width: 100%;max-height: 16rem; pointer-events: none;"
                )
                span(style="background-color: rgba(0,0,0,0.45); color: white;position: absolute; bottom: 0.1rem; left: 0.1rem; padding: 0.5rem; border-radius: 0.5rem;")
                    | {{`${eachVideo.name||""}`}}
                span(style="background-color: rgba(0,0,0,0.45); color: white;position: absolute; top: 0.1rem; left: 0.1rem; padding: 0.5rem; border-radius: 0.5rem;")
                    | {{`${eachVideo.status||""}`}}
            
</template>

<script>
import { frontendDb } from '../tooling/database.js'
import { isLocalVideo,} from '../tooling/timestamp_tooling.js'
import { trigger, globalEvents } from '../tooling/events.js'
import * as videoTools from "../tooling/video_tooling.js"

export default {
    data: ()=>({
        videos: [],
    }),
    watch: {
        '$root.searchResults.videos': {
            deep: true,
            handler() {
                setTimeout(async () => {
                    this.getVideoExtraInfo().catch(console.error)
                }, 0)
            }
        },
    },
    mounted() {
        window.VideoLister = this
        setTimeout(async () => {
            this.getVideoExtraInfo().catch(console.error)
        }, 1000)
    },
    computed: {
        videoResults() {
            let selectedId = this.$root.videoInterface.videoId
            if (!selectedId) {
                return this.videos
            } else {
                let filtered = this.videos.filter(each=>each.videoId!==selectedId)
                try {
                    if (!this.$root.noSearch) {
                        const searchResultVideos = this.$root.searchResults.videos
                        const videoIds = new Set(Object.keys(searchResultVideos))
                        filtered = filtered.filter(each=>videoIds.has(each.videoId))
                    }
                } catch (error) {
                    console.error(error)
                }
                return filtered
            }
        },
    },
    methods: {
        showAll() {
            this.$root.clearSearch()
        },
        stringify: JSON.stringify,
        isLocalVideo,
        async getVideoExtraInfo() {
            let videoIds = Object.keys(this.$root.searchResults.videos)
            let videos
            if (this.$root.noSearch) {
                videos = (await trigger(globalEvents.requestVideosToList, "VideoLister"))[0]
                try {
                    // add videos that don't have an ID yet
                    videos = videos.concat(
                        (await window.backend.getLocalVideoPaths()).map(each=>({
                            videoId: null,
                            path: each,
                        }))
                    )
                } catch (error) {
                    console.warn(`[VideoLister] wasn't able to get list of videos from backend: ${error}`)
                }
            } else {
                videos = await frontendDb.getVideos(videoIds)
            }
            // consolidate by path
            const videoByPath = {}
            // console.debug(`[VideoLister] videos is:`,JSON.parse(JSON.stringify(videos)))
            for (const each of videos) {
                if (each?.path) {
                    let videoObject = {...videoByPath[each.path], ...each }
                    videoByPath[each.path] = videoObject
                    if (each.path.startsWith("https://")) {
                        videoByPath[each.path].isLocalVideo = false 
                        videoByPath[each.path].name = videoByPath[each.path].name||"[Youtube]"
                    } else {
                        videoByPath[each.path].isLocalVideo = true
                        videoByPath[each.path].name = videoTools.extractLocalVideoNameFromPath(each.path)
                    }
                    
                    let status = "Unmarked/Unwatched"
                    if ((videoObject.usersFinishedWatchingAt||{})[this.$root.email]) {
                        status = "Watched"
                    }
                    if ((videoObject.usersFinishedLabelingAt||{})[this.$root.email]) {
                        status = "Labeled"
                    }
                    if ((videoObject.usersFinishedVerifyingAt||{})[this.$root.email]) {
                        status = "Verified"
                    }
                    videoObject.status = status
                }
            }
            // remove duplicates
            this.videos = Object.values(videoByPath)
            setTimeout(() => {
                this.$forceUpdate()
            }, 1000);
        },
    }
}
</script>

<style lang='sass' scoped>
.thumbnail
    background-size: cover
    background-repeat: no-repeat

span
    color: black
    
.video-list-container
    overflow: auto

.video-list-element
    height: 14rem 
    min-height: 14rem
    width: 100%  
    margin-bottom: 2rem 
    position: relative
    cursor: pointer
    .video-title
        align-self: flex-start
        margin-bottom: 0.5rem
        
    .overlay
        width: 100%
        height: 100%
        position: absolute
</style>