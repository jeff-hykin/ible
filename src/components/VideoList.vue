<template lang="pug">
    column.video-list-container(width="100%" padding="1rem" align-v="top")
        column.video-list-element(v-for="each in $root.relatedVideos()")
            div.overlay(@click="selectVideo($event, each)")
            youtube(
                :video-id="each"
                host="https://www.youtube-nocookie.com"
                player-width="100%"
                player-height="100%"
                style="height: 100%;width: 100%;"
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
    mounted() {
    },
    methods: {
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
    height: 12rem 
    min-height: 12rem
    width: 100%  
    margin-bottom: 1.5rem 
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