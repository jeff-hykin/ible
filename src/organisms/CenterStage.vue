<template lang="pug">
    column(
        width="100%"
        height="100vh"
        align-h="center"
        align-v="top"
        overflow="auto"
        overflow-x="hidden"
    )
        WrappedTopSearch
        
        column(v-if="!get($root, ['routeData$', 'videoId'], false)" width="100%" height="100vh" flex-shrink="1" color="gray")
            h5 No Video Selected
            
        transition(name="fade")
            row.center-stage(v-show="get($root, ['routeData$', 'videoId'], false)" align-v="top" align-h="center" padding-top="8rem")
                column.main-container(flex-grow=1 align-v="top")
                    row.below-video-search(flex-basis="100%" padding-top="1rem" align-v="top" :opacity="get($root, ['routeData$', 'videoId'], false)? 1 : 0")
                        //- Video area
                        column(align-v="top").video-width-sizer
                            row(width="96%" position="relative")
                                VideoPlayer(ref="videoPlayer" v-model="videoData" :videoId="get($root, ['routeData$', 'videoId'], false)")
                            container.below-video
                                //- BACK
                                SideButton.left-side-button(left @click='decrementIndex')
                                //- segments
                                SegmentDisplay(:jumpSegment="jumpSegment" :videoDuration="videoData.duration")
                                //- NEXT
                                SideButton.right-side-button(right @click='incrementIndex')
                column.side-container(align-v="top" overflow="visible" min-height="50rem" width="fit-content")
                    ObservationEditor(
                        :jumpSegment="jumpSegment"
                        :currentTime="videoData.currentTime"
                        :duration="videoData.duration"
                    )
                    InfoSection.info-section(
                        :labelName="get($root, ['routeData$', 'labelName'], '')"
                        :videoId="get($root, ['routeData$', 'videoId'], null)"
                        :segmentUuid="get($root, ['selectedSegment', '$uuid'], null)"
                        :currentTime="videoData.currentTime"
                    )
</template>
<script>
const { wrapIndex } = require('../utils')
export default {
    props: [],
    components: {
        SideButton: require("../atoms/SideButton").default,
        VideoPlayer: require("../atoms/VideoPlayer").default,
        InfoSection: require("../molecules/InfoSection").default,
        ObservationEditor: require("../organisms/ObservationEditor").default,
        SegmentDisplay: require("../organisms/SegmentDisplay").default,
        WrappedTopSearch: require("../organisms/WrappedTopSearch").default,
        Card: require("../molecules/Card").default,
        VideoLister: require("../organisms/VideoLister").default,
    },
    data: ()=>({
        get,
        videoData: {
            duration: null,
            currentTime: null,
        },
    }),
    mounted() {
        window.centerStage = this
    },
    watch: {
        "videoData.duration": function() {
            console.debug(`[watch] this.videoData.duration is:`,this.videoData.duration)
            window.SegmentDisplay.seekToSegmentStart()
        },
        "videoData.currentTime": function(value, prevValue) {
            let playing = get(this.$refs, ["vuePlyr","player","playing"], false)
            if (playing) {
                let endTime = get(this.$root, ["selectedSegment", "endTime",], Infinity)
                if (value >= endTime && prevValue < endTime) {
                    // pause video
                    this.$refs.vuePlyr.player.pause()
                    this.$toasted.show(`(End of Clip)`).goAway(2000)
                }
            }
        },
    },
    rootHooks: {
        watch: {
            selectedSegment() {
            },
        }
    },
    windowListeners: {
        keydown(eventObject) {
            if (eventObject.target == document.body || get(eventObject, ["path"], []).includes(this.$el)) {
                // 
                // key controls
                // 
                switch (eventObject.key) {
                    case "ArrowRight":
                        if (eventObject.ctrlKey) {
                            console.log(`going to next clip`)
                            eventObject.preventDefault()
                            this.incrementIndex()
                        }
                        break
                    case "ArrowLeft":
                        if (eventObject.ctrlKey) {
                            console.log(`going to previous clip`)
                            eventObject.preventDefault()
                            this.decrementIndex()
                        }
                        break
                    // case "ArrowUp":
                    //     if (eventObject.ctrlKey) {
                    //         eventObject.preventDefault()
                    //         // TODO: go to previous video in video list
                    //     }
                    //     break
                    // case "ArrowDown":
                    //     if (eventObject.ctrlKey) {
                    //         eventObject.preventDefault()
                    //         // TODO: go to next video in video list
                    //     }
                    //     break
                }
            }
        }
    },
    methods: {
        incrementIndex() {
            this.jumpSegment(this.$root.selectedSegment.$displayIndex+1)
        },
        decrementIndex() {
            this.jumpSegment(this.$root.selectedSegment.$displayIndex-1)
        },
        async jumpSegment(newIndex) {
            window.SegmentDisplay.jumpSegment(newIndex)
        },
    }
}
</script>
<style lang='sass' scoped>
.center-stage
    .side-container
        padding-left: 5rem
        padding-right: 5rem
        padding-top: 0.5rem
        
        .info-section
            margin-bottom: 2rem
        
    .main-container
        flex-shrink: 0
        min-height: 44vw
        transition: opacity ease 0.5s
        width: fit-content
        min-width: fit-content
        padding-left: 6rem
        
        .below-video-search
            width: 100%
            max-width: 100vw
            margin-bottom: 5.5rem
            
            .video-width-sizer
                --max-width: calc(70rem)
                width: 50vw
                min-width: 18rem
                max-width: var(--max-width)
                height: fit-content
        
        .below-video
            position: relative
            padding: 1rem
            background: white
            border-radius: 1rem
            box-shadow: var(--shadow-1)
            width: 100%
            --from-top: 5.3rem
            
            .left-side-button
                position: absolute
                left: 0rem
                top: var(--from-top)
                transform: translate(-100%, -50%)
            
            .right-side-button
                position: absolute
                right: 0rem
                top: var(--from-top)
                transform: translate(100%, -50%)
    
    .fade-enter-active, .fade-leave-active
        transition: opacity 2.5s
    
    .fade-enter, .fade-leave-to
        opacity: 0
    
</style>