<template lang="pug">
    column.main-container(v-if='segments' :opacity='segments? 1 : 0' flex-grow=1)
        //- Video area
        row.video-container(flex-basis="100%")
            //- BACK
            div.circle-button.left(@click='decrementIndex')
                span
                    | ←
            //- VIDEO
            column.video-sizer
                youtube(
                    v-if='segments'
                    :video-id="segment.video_id"
                    :player-vars='{start: segment.start}'
                    host="https://www.youtube-nocookie.com"
                    @ready="ready"
                    @playing="playing"
                    player-width="100%"
                    player-height="100%"
                    style="height: 100%;width: 100%;"
                )
                
                //- Segments
                column.segments(align-h="left")
                    h5
                        | Moments
                    row.level(v-for="(eachLevel, index) in organizedSegments" align-h="space-between" position="relative")
                        row.segment(
                            v-for="(eachSegment, index) in eachLevel"
                            @click="jumpSegment(eachSegment.index)"
                            :left="`${(eachSegment.effectiveStart/duration)*100}%`"
                            :width="`${(eachSegment.effectiveEnd - eachSegment.effectiveStart)*100/duration}%`"
                        )
                            ui-tooltip(position="left" animation="fade")
                                | label: {{ eachSegment.label }}
                                br
                                | length: {{ eachSegment.end - eachSegment.start }} sec
                                br
                                | start: {{ eachSegment.start }} sec
            //- NEXT
            div.circle-button.right(@click='incrementIndex')
                span
                    | →
        
</template>

<script>
import { wrapIndex, EventEmitter } from '../utils'
import JsonTree from 'vue-json-tree'

export let videoEvents = new EventEmitter()

import { segmentEvents } from "./Segments"
import index from 'vue-youtube-embed'

let { dynamicSort } = require("good-js")
let windowListenerMixin = require("../mixins/window-listeners")



export default {
    props: [ 'segments' ],
    components: { JsonTree },
    mixins: [
        windowListenerMixin
    ],
    data: ()=>({
        player: null,
        organizedSegments: [],
        whichSegment: 0,
        duration: null,
        videoInitilized: false,
        windowListeners$: {
            keydown(eventObj) {
                // 
                // arrow key controls
                // 
                switch (eventObj.key) {
                    case "ArrowRight":
                        this.incrementIndex()
                        break
                    case "ArrowLeft":
                        this.decrementIndex()
                        break
                    default:
                        // we dont care about other keys
                        break
                }
            }
        }
    }),
    mounted() {
        segmentEvents.on('whichSegment:update', (data)=>{
            if (JSON.stringify(this.whichSegment) != JSON.stringify(data.whichSegment)) {
                this.whichSegment = data.whichSegment
            }
        })
    },
    watch: {
        segments(value, oldValue) {
            // reset the segment count
            this.whichSegment = 0
            this.videoInitilized = false
            this.seekToSegmentStart()
            this.organizeSegments()
        },
        whichSegment(value) {
            videoEvents.emit("whichSegment:update", { whichSegment: this.whichSegment })
            this.seekToSegmentStart()
            this.organizeSegments()
        }
    },
    computed: {
        segment() {
            return this.segments && this.segments[this.whichSegment]
        }
    },
    methods: {
        organizeSegments() {
            let whichVideo = this.segment.video_id
            console.debug(`whichVideo is:`,whichVideo)
            let videoSegments = []
            // 2 percent of the width of the video
            let minWidth = this.duration / 50
            if (whichVideo) {
                videoSegments = this.segments.map((each, index)=>{
                    let effectiveStart = each.start
                    let effectiveEnd = each.end
                    let segmentDuration = each.end - each.start
                    // if segment is too small artificially make it bigger
                    if (segmentDuration < minWidth) {
                        let additionalAmount = (minWidth - segmentDuration)/2
                        // sometimes this will result in a negative amount, but thats okay
                        // the UI can handle it, the user just needs to be able to see it
                        effectiveStart -= additionalAmount
                        effectiveEnd += additionalAmount
                    }
                    return {
                        ...each,
                        index,
                        effectiveStart,
                        effectiveEnd,
                    }
                }).filter(each=>each.video_id == whichVideo)
            }
            let levels = []
            for (let eachSegment of videoSegments.sort(dynamicSort("effectiveStart"))) {
                // find the smallest viable level
                let level = 0
                while (levels[level] != undefined && eachSegment.effectiveStart <= levels[level][ levels[level].length-1 ].effectiveEnd) {
                    ++level
                }
                // create level if it didn't exist
                if (levels[level] == undefined) {
                    levels[level] = [ eachSegment ]
                // otherwise add it to the end of the level
                } else {
                    levels[level].push(eachSegment)
                }
            }
            this.organizedSegments = levels
        },
        ready(event) {
            this.player = event.target
            this.duration = this.player.getDuration()
            this.organizeSegments()
            window.player = this.player
        },
        playing() {
            console.log(`playing`)
        },
        waitThenPause(seekBackToStart=null) {
            // if already playing
            if (this.player && this.player.getPlayerState() == 1) {
                // then pause
                this.player.pauseVideo()
                this.videoInitilized = true
                // if there is a seek back time, go there
                if (seekBackToStart) {
                    this.player.seekTo(this.segment.start)
                }
            } else {
                setTimeout(() => {
                    // init the video by pressing play
                    if (!this.videoInitilized) {
                        this.player.playVideo()
                    }
                    this.waitThenPause(seekBackToStart)
                }, 0)
            }
        },
        isPlaying() {
            return this.player.getPlayerState() == 1
        },
        incrementIndex() {
            this.whichSegment = wrapIndex(++this.whichSegment, this.segments)
        },
        decrementIndex() {
            this.whichSegment = wrapIndex(--this.whichSegment, this.segments)
        },
        jumpSegment(index) {
            console.debug(`index is:`,index)
            console.debug(`this.segments is:`,this.segments)
            this.whichSegment = wrapIndex(index, this.segments)
        },
        notYetImplemented() {
            this.$toasted.show(`Sadly this doesn't do anything yet`).goAway(2500)
        },
        seekToSegmentStart() {
            // if the player doesn't exist, reschedule the seek action
            if (!this.player) {
                return setTimeout(() => {
                    this.seekToSegmentStart()
                }, 0)
            }
            this.player.seekTo(this.segment.start)
            
            // in this state the player (after seeking) will start playing
            // which isn't the best UX, so pause it immediately
            const VIDEO_HASNT_STARTED_STATE = 5
            const VIDEO_PAUSED_STATE = 2
            let state = this.player.getPlayerState()
            if (state == VIDEO_HASNT_STARTED_STATE || (state == VIDEO_PAUSED_STATE && !this.videoInitilized)) {
                let seekBackToStart = true
                // give it enough time to load the frame (otherwise it loads infinitely)
                this.player.playVideo()
                // tell the pause exactly where to jump back to after pausing
                this.waitThenPause(seekBackToStart)
            }
        }
    }
}
</script>

<style lang='sass' scoped>
.main-container
    flex-shrink: 0
    min-height: 44vw
    transition: opacity ease 0.5s
    width: 100%
    min-width: fit-content

    .video-container
        width: 100%
        max-width: 100vw
        --height: 80vh
        height: var(--height)
        max-height: var(--height)
        min-height: var(--height)
        
        .video-sizer
            position: relative
            width: 100%
            height: 100%
            min-width: 18rem
            min-height: 40vh
            --max-width: calc(40rem + 30vw)
            max-width: var(--max-width)
            max-height: calc(var(--max-width) * 0.55)
    
    
    .segments
        h5
            color: gray
            margin-bottom: 5px
            margin-left: 10px
            font-weight: 100
            
        position: absolute
        transform: translateY(100%)
        bottom: 0
        width: 103%
        align-items: flex-start
        text-align: left
        padding: 1rem
        background: white
        border-radius: 1rem
        box-shadow: var(--shadow-1)
        
        .level
            width: 100%
            height: 2.2rem
            border-bottom: #e0e0e0 1px solid
            .segment
                position: absolute
                min-height: 1.4rem
                background-color: var(--blue)
                padding: 2px
                border-radius: 2px
                transition: all ease 0.5s
                &:hover
                    box-shadow: var(--shadow-1)
                    opacity: 0.9
                // border: 2px white solid
                
                // border-top-left-radius: 1rem
                // border-top-right-radius: 1rem
                // border-bottom-left-radius: 1rem
                // border-bottom-right-radius: 1rem
                // border-bottom: 4px var(--red) solid
                // border-left: 4px var(--red) solid
                // border-right: 4px var(--red) solid
                    
                // background-color: var(--blue)
                // min-height: 1rem
                // position: absolute
                // border: 1px solid white
                // border-radius: 4px

.circle-button
    background: var(--red)
    color: white
    padding: 2rem
    --radius: 5rem
    cursor: pointer
    
    &.left
        padding-right: 0
        margin-right: -10px
        border-top-left-radius: var(--radius)
        border-bottom-left-radius: var(--radius)
        span
            position: relative
            left: -100%
    &.right
        padding-left: 0
        margin-left: -10px
        border-top-right-radius: var(--radius)
        border-bottom-right-radius: var(--radius)
        span
            position: relative
            right: -100%

</style>