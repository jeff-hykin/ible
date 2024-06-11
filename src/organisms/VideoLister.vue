<template lang="pug">
    column.video-list-container(width="100%" padding="1rem" align-v="top")
        span(v-if="videoResults.length == 0")
            | (No other videos matching this search)
        column.video-list-element(v-for="eachVideoId in videoResults" @click="selectVideo($event, eachVideoId)")
            row.thumbnail(width="100%" height="100%" :background-image="isLocalVideo(eachVideoId) ? `url(/icon.png)` : `url(http://img.youtube.com/vi/${eachVideoId}/mqdefault.jpg)`" position="relative" border-radius="0.5rem")
                span(style="background-color: rgba(0,0,0,0.10); position: absolute; bottom: 0.1rem; left: 0.1rem; padding: 0.5rem; border-radius: 0.5rem;")
                    | {{!isLocalVideo(eachVideoId)?"":`${getLocalVideoName(eachVideoId)}`}}
</template>

<script>
import { backendHelpers, fakeBackend } from '../iilvd-api.js'
import { set } from '../object.js'
import { isLocalVideo, getLocalVideoName } from '../observation_tooling.js'

export default {
    data: ()=>({
        get
    }),
    computed: {
        videoResults() {
            let videos = this.$root.searchResults.videos
            let selectedId = this.$root?.routeData$?.videoId
            let filtered = Object.keys(videos).filter(each=>each!==selectedId)
            return filtered
        }
    },
    methods: {
        isLocalVideo,
        getLocalVideoName,
        getTitleFor(videoId) {
            let videoObject = this.$root.getCachedVideoObject(videoId)
            let title = videoObject&&videoObject.summary&&videoObject.summary.title
            if (title === null) {
                return "[Title not in database]"
            }
            if (title != undefined) {
                return title
            } else {
                backendHelpers.getVideoTitle(videoId).then(async (title)=>{
                    console.debug(`BACKEND: title is:`,title)
                    console.debug(`FAKE   : title is:`,await fakeBackend.getVideoTitle(videoId))
                    console.log(`received title ${title}`)
                    if (!(videoObject.summary instanceof Object)) {
                        videoObject.summary = {}
                    }
                    videoObject.summary.title = title || null
                    this.$forceUpdate()
                })
                return "Loading..."
            }
        },
        selectVideo(eventObj, videoId) {
            console.log(`clicked video ${videoId}`)
            window.resetPlayer = true
            this.$root.push({videoId})
            // setTimeout(()=>{
            //     window.location.reload()
            // }, 50)
            
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
    overflow: scroll

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