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
            //- NEXT
            div.circle-button.right(@click='incrementIndex')
                span
                    | →
        
        //- Segments
        column.segments
            row.level(v-for="(eachLevel, index) in organizedSegments")
                row.segment(v-for="(eachSegment, index) in eachLevel")
                    | {{eachSegment.start}}
        
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
        },
        whichSegment(value) {
            videoEvents.emit("whichSegment:update", { whichSegment: this.whichSegment })
            this.seekToSegmentStart()
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
            let videoSegments = []
            if (whichVideo) {
                videoSegments = this.segments.filter(each=>each.video_id == whichVideo)
            }
            let levels = []
            for (let eachSegment of videoSegments.sort(dynamicSort("start"))) {
                // find the smallest viable level
                let level = 0
                while (levels[level] != undefined && eachSegment.start <= levels[level][ levels[level].length-1 ].end) {
                    ++level
                }
                // create level if it didn't exist
                if (levels[level] == undefined) {
                    levels[level] = [ eachSegment ]
                // otherwise add it to the end of the level
                } else {
                    levels.push(eachSegment)
                }
            }
            console.debug(`levels is:`, levels)
            this.organizedSegments = levels
        },
        ready(event) {
            this.player = event.target
            this.duration = this.player.duration
            console.debug(`this.duration is:`,this.duration)
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
        
        .video-sizer
            width: 100%
            height: 50%
            min-width: 18rem
            min-height: 40vw
            --max-width: calc(40rem + 30vw)
            max-width: var(--max-width)
            max-height: calc(var(--max-width) / 2)

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