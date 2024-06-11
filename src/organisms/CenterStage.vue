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
        
        column(v-if="!get({ keyList: ['routeData$', 'videoId'], from: $root, failValue: false })" width="100%" height="100vh" flex-shrink="1" color="gray")
            h5 No Video Selected
            
        transition(name="fade")
            row.center-stage(v-show="get({ keyList: ['routeData$', 'videoId'], from: $root, failValue: false })" align-v="top" align-h="center" padding-top="8rem")
                column.main-container(flex-grow=1 align-v="top")
                    row.below-video-search(flex-basis="100%" padding-top="1rem" align-v="top" :opacity="get({ keyList: ['routeData$', 'videoId'], from: $root, failValue: false })? 1 : 0")
                        //- Video area
                        column(align-v="top").video-width-sizer
                            row(width="96%" position="relative")
                                VideoPlayer(ref="videoPlayer" v-model="videoData" :videoId="get({ keyList: ['routeData$', 'videoId'], from: $root, failValue: false })")
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
                        :labelName="get({ keyList: ['routeData$', 'labelName'], from: $root, failValue: '' })"
                        :videoId="get({ keyList: ['routeData$', 'videoId'], from: $root, failValue: false })"
                        :segmentUuid="get({ keyList: ['routeData$', 'segmentUuid'], from: $root, failValue: null })"
                        :currentTime="videoData.currentTime"
                    )
</template>
<script>
const { wrapIndex } = require('../utils')
import { get } from "../object.js"

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
            window.dispatchEvent(new CustomEvent("SegmentDisplay-updateSegments"))
        },
        "videoData.currentTime": function(value, prevValue) {
            let playing = !window.player?.paused
            if (playing) {
                let endTime = this.$root?.selectedSegment?.endTime||Infinity
                if (value >= endTime && prevValue < endTime) {
                    // pause video
                    vuePlyr.player.pause()
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
            if (["DIV", "BUTTON", "BODY"].includes(eventObject.target.tagName) || get({ keyList: ["path"], from: eventObject, failValue: [] }).includes(this.$el) || `${eventObject.target.id}`.startsWith("plyr-")) {
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
        closestSegment({time, forward=true}) {
            if (window.SegmentDisplay.$data.segmentsInfo.organizedSegments.length == 0) {
                return null
            } else {
                let finalIndex = 0
                if (forward) {
                    let runningIndex = 0
                    for (const each of window.SegmentDisplay.$data.segmentsInfo.organizedSegments) {
                        runningIndex += 1
                        if (each.startTime > time) {
                            finalIndex = runningIndex
                            break
                        }
                    }
                } else {
                    let finalIndex = 0
                    let runningIndex = 0
                    const segmentsBackwards = [...window.SegmentDisplay.$data.segmentsInfo.organizedSegments]
                    // first one is largest number of seconds
                    segmentsBackwards.sort((a,b)=>b.endTime-a.endTime)
                    for (const each of segmentsBackwards) {
                        runningIndex += 1
                        if (each.endTime < time) {
                            finalIndex = runningIndex
                            break
                        }
                    }
                    // because reversed:
                    // 0 => last (length-1)
                    // 1 => second to last (length-2)
                    finalIndex = segmentsBackwards.length-(finalIndex+1)
                }
                return window.SegmentDisplay.$data.segmentsInfo.organizedSegments[finalIndex]
            }
        },
        incrementIndex() {
            let segment = this.$root.selectedSegment
            if (!segment) {
                segment = this.closestSegment({time: window.player.currentTime, forward: true})
            }
            if (segment) {
                this.jumpSegment(segment.$displayIndex+1)
            }
        },
        decrementIndex() {
            let segment = this.$root.selectedSegment
            if (!segment) {
                segment = this.closestSegment({time: window.player.currentTime, forward: false})
            }
            if (segment) {
                this.jumpSegment(segment.$displayIndex-1)
            }
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