<template lang="pug">
    column.video-list-container(width="100%" padding="1rem" align-v="top")
        span(v-if="videoResults.length == 0")
            | (No other videos matching this search)
        column.video-list-element(v-for="eachVideoId in videoResults" @click="$root.videoInterface.goToThisVideo({videoId:eachVideoId})")
            row.thumbnail(width="100%" height="100%" :background-image="isLocalVideo(eachVideoId) ? `url(/icon.png)` : `url(http://img.youtube.com/vi/${eachVideoId}/mqdefault.jpg)`" position="relative" border-radius="0.5rem" overflow="hidden")
                //- this is just used as a thumbnail
                video(
                    v-if="isLocalVideo(eachVideoId)"
                    :src="videoPaths[eachVideoId]"
                    style="width: 100%;max-height: 16rem; pointer-events: none;"
                )
                span(style="background-color: rgba(0,0,0,0.45); color: white;position: absolute; bottom: 0.1rem; left: 0.1rem; padding: 0.5rem; border-radius: 0.5rem;")
                    | {{!isLocalVideo(eachVideoId)?"":`${videoNames[eachVideoId]||""}`}}
</template>

<script>
import { frontendDb } from '../tooling/database.js'
import { isLocalVideo,} from '../observation_tooling.js'
import { trigger, globalEvents } from '../tooling/events.js'
import * as videoTools from "../tooling/video_tooling.js"

export default {
    data: ()=>({
        videoNames: {},
        videoPaths: {},
        videoIds: [],
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
            let filtered = this.videoIds.filter(each=>each!==selectedId)
            return filtered
        },
    },
    methods: {
        isLocalVideo,
        async getVideoExtraInfo() {
            let videoIds = Object.keys(this.$root.searchResults.videos)
            let videos
            if (this.$root.noSearch) {
                videos = (await trigger(globalEvents.requestVideosToList, "VideoLister"))[0]
            } else {
                videos = await frontendDb.getVideos(videoIds)
            }
            const videoNames = {}
            const videoPaths = {}
            videoIds = []
            for (const each of videos) {
                videoIds.push(each.videoId)
                if (each?.videoId) {
                    videoPaths[each.videoId] = `/videos/${each.path}`
                    videoNames[each.videoId]  = videoTools.extractLocalVideoNameFromPath(each.path)
                }
            }
            this.videoNames = videoNames
            this.videoPaths = videoPaths
            this.videoIds = videoIds
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