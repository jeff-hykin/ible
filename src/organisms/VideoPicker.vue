<template lang="pug">
    container.nub(align-self="top" @mouseover="onHover")
        | Videos
        portal(to="right-panel")
            VideoLister

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
        },
    },
    mounted() {
    },
    methods: {
        onHover() {
            openPanel()
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