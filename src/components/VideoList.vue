<template lang="pug">
    column.video-list-container(width="100%" padding="1rem" align-v="top")
        
        column.video-list-element(v-for="each in videoList()")
            div.overlay(@click="selectVideo($event, each)")
                //- host="https://www.youtube-nocookie.com"
                //- :host="'https://www.youtube.com'"
            row(width="100%" height="100%" background="lightgrey" position="relative")
                container(position="absolute" color="black" z-index="1")
                    | loading...
                youtube(
                    :video-id="each"
                    :host="host()"
                    player-width="100%"
                    player-height="100%"
                    style="height: 100%;width: 100%; z-index: 2"
                )
</template>

<script>
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
            this.$forceUpdate()
        },
    },
    mounted() {
    },
    methods: {
        host() {
            return window.player ? 'http://www.youtube-nocookie.com/' : 'https://www.youtube.com'
        },
        videoList() {
            console.debug(`window is:`,window)
            if (window.player) {
                return this.$root.relatedVideos()
            } else {
                return []
            }
        },
        selectVideo(eventObj, videoId) {
            console.debug(`eventObj is:`,eventObj)
            // get it from the cache (auto-adds to cache if needed)
            this.$root.selectedVideo = this.$root.getCachedVideoObject(videoId)
        },
    }
}
</script>

<style lang='sass' scoped>

.video-list-container
    overflow: scroll

.video-list-element
    height: 14rem 
    min-height: 14rem
    width: 100%  
    margin-bottom: 2rem 
    position: relative
    .overlay
        width: 100%
        height: 100%
        position: absolute
    
.segment
    border-top: gray solid 2px
    background: #f7f8f9
    padding-top: 1pc
    margin-bottom: 1rem
    min-width: 100%
    color: black
    opacity: 0.7
    transition: all 0.25s ease-out
    
    .json-tree-root
        border-bottom: gray solid 2px
        max-width: 50vw
        min-width: 3rem
        width: 100%
        padding: 1rem
        border-radius: 0
    
    h5
        padding: 0 1pc
        
    &.selected
        padding-bottom: 2pc
        font-weight: bold
        background: #2196f3
        color: white
        opacity: 1
        
        .json-tree-root
            margin-left: 1rem
            margin-right: 1rem
            
        h5
            padding: 1pc 1pc
</style>