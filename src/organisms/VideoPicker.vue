<template lang="pug">
    container.nub(align-self="top" @mouseover="onHover" :visibility="$root.selectedLabel? 'visible' : 'hidden'")
        | Videos
        portal(to="right-panel")
            VideoLister
            //- h5(style="width: 100%; text-align: center; padding-top: 1rem; padding-bottom: 1rem; color: gray; text-decoration: underline;")
            //-     | Videos With Label: {{$root.getSelectedLabelName()}}
            //- column.video-list-container(width="100%" padding="1rem" align-v="top")
            //-     span(v-if="videoList() instanceof Array && videoList().length == 0")
            //-         | (Loading or no other videos with this label)
            //-     column.video-list-element(v-for="eachVideoId in videoList()" @click="selectVideo($event, eachVideoId)")
            //-         //- span.video-title
            //-         //-     | {{getTitleFor(eachVideoId)}}
            //-         row.thumbnail(width="100%" height="100%" :background-image="`url(http://img.youtube.com/vi/${eachVideoId}/mqdefault.jpg)`" position="relative")
</template>

<script>
const { wrapIndex } = require('../utils')
const { dynamicSort, logBlock } = require("good-js")
const { openPanel } = require("../templates/RightSidePanel")

export default {
    props: [],
    components: { 
        VideoLister: require('../organisms/VideoLister').default,
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
        onHover() {
            openPanel()
        },
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
                this.backend.then(backend=>{
                    console.log(`requesting video title`)
                    backend.mongoInterface.get({
                        from: 'videos',
                        keyList: [videoId, "summary", "title"],
                    }).then(title=>{
                        console.log(`received title ${title}`)
                        if (!(videoObject.summary instanceof Object)) {
                            videoObject.summary = {}
                        }
                        videoObject.summary.title = title || null
                        this.$forceUpdate()
                    })
                })
                return "Loading..."
            }
        },
        selectVideo(eventObj, videoId) {
            console.log(`changing selected video from VideoPicker`)
            console.debug(`videoId of selected is:`,videoId)
            this.$router.push({ name: "video", params: { videoId, labelName: this.$route.params.labelName } })
        },
    }
}
</script>

<style lang='sass' scoped>
.nub
    position: fixed
    top: 0
    right: 0
    left: unset
    height: var(--nub-size)
    width: var(--nub-size)
    background: var(--red)
    color: white
    padding: 1rem
    padding-top: 2rem
    border-bottom-left-radius: var(--nub-size)
    text-align: right
    align-items: flex-end

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