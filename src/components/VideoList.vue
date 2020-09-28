<template lang="pug">
    column.video-list-container(width="100%" padding="1rem" align-v="top")
        span(v-if="videoList() instanceof Array && videoList().length == 0")
            | (no other videos with this label)
        column.video-list-element(v-for="eachVideoId in videoList()" @click="selectVideo($event, eachVideoId)")
            span.video-title
                | {{getTitleFor(eachVideoId)}}
            row(width="100%" height="100%" :background="`url(http://img.youtube.com/vi/${eachVideoId}/mqdefault.jpg)`" position="relative")
                //- containe
</template>

<script>
const endpoints = require("../iilvd-api").endpoints
const { wrapIndex } = require('../utils')
const { dynamicSort, logBlock } = require("good-js")

export default {
    props: [],
    components: { 
        JsonTree: require('vue-json-tree').default,
    },
    data: ()=>({
    }),
    watch: {
    },
    windowListeners: {
        "CenterStage: videoIsReady": function() {
            console.log(`force updating because the video is ready`)
            console.debug(`window.player is:`,window.player)
            this.$forceUpdate()
            console.debug(`this.$root.relatedVideos() is:`, this.$root.relatedVideos())
        },
    },
    mounted() {
    },
    methods: {
        host() {
            return window.player ? 'http://www.youtube-nocookie.com/' : 'https://www.youtube.com'
        },
        videoList() {
            console.log(`returning relatedVideos()`)
            if (window.player) {
                return this.$root.relatedVideos()
            } else {
                return []
            }
        },
        getTitleFor(videoId) {
            let videoObject = this.$root.getCachedVideoObject(videoId)
            let title = videoObject&&videoObject.summary&&videoObject.summary.title
            if (title === null) {
                return "[Title not in database]"
            }
            if (title != undefined) {
                return title
            } else {
                endpoints.then(endpoints=>{
                    console.log(`requesting video title`)
                    endpoints.videos.get({ keyList: [videoId, "summary", "title"] }).then(title=>{
                        console.log(`received title ${title}`)
                        if (!(videoObject.summary instanceof Object)) {
                            videoObject.summary = {}
                        }
                        videoObject.summary.title = title
                        this.$forceUpdate()
                    })
                })
                return "Loading..."
            }
        },
        selectVideo(eventObj, videoId) {
            console.debug(`eventObj is:`,eventObj)
            console.log(`changing selected video from VideoList`)
            this.$root.selectedVideo = ""
            setTimeout(() => {
                console.debug(`videoId of selected is:`,videoId)
                // get it from the cache (auto-adds to cache if needed)
                this.$root.selectedVideo = this.$root.getCachedVideoObject(videoId)
                console.debug(`this.$root.selectedVideo is:`,JSON.stringify(this.$root.selectedVideo))
            }, 200)
        },
    }
}
</script>

<style lang='sass' scoped>

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