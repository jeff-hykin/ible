<template lang="pug">
    column.main-container(v-if='segments' :opacity='segments? 1 : 0' flex-grow=1)
        //- Video area
        row.video-container(flex-basis="100%" margin-top="-8rem")
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
                            :left="eachSegment.leftPercent"
                            :width="eachSegment.widthPercent"
                            @click="jumpSegment(eachSegment.index)"
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

let { dynamicSort, logBlock } = require("good-js")
let windowListenerMixin = require("../mixins/window-listeners")



let video = {
    IS_LOADING: -1,
    IS_PLAYING: 1,
    IS_PAUSED: 2,
    HASNT_EVEN_INITILIZED: null,
    HASNT_STARTED_STATE: 5,
}

export default {
    props: [ 'segments' ],
    components: { JsonTree },
    mixins: [
        windowListenerMixin
    ],
    data: ()=>({
        player: null,
        organizedSegments: [],
        whichVideo: null,
        whichSegment: 0,
        duration: null,
        videoInitilized: false,
        scheduledToggle: {},
        windowListeners$: {
            keydown(eventObj) {
                console.debug(`eventObj.key is:`,eventObj.key)
                // 
                // key controls
                // 
                switch (eventObj.key) {
                    case "ArrowRight":
                        this.incrementIndex()
                        break
                    case "ArrowLeft":
                        this.decrementIndex()
                        break
                    case " ":
                        this.player.pauseVideo()
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
            this.checkIfVideoChanged()
            this.seekToSegmentStart()
            this.organizeSegments()
        },
        whichSegment(value) {
            videoEvents.emit("whichSegment:update", { whichSegment: this.whichSegment })
            this.checkIfVideoChanged()
            this.seekToSegmentStart()
            this.organizeSegments()
        },
        // when the video changes
        whichVideo(value) {
            logBlock({name: "whichVideo"}, ()=>{
                console.debug(`this.whichVideo is:`, this.whichVideo)
                // it hasn't been initilized
                this.videoInitilized = false
                // manually wipe the info (otherwise old video info will still be there)
                if (this.player) {
                    this.player.playerInfo.duration = null
                    console.debug(`this.player.getDuration() is:`,this.player.getDuration())
                }
                // load / init the video
                this.seekToSegmentStart()
                // the duration changed so the segments need to be recalculated
                this.organizeSegments()
            })
        }
    },
    computed: {
        segment() {
            return this.segments && this.segments[this.whichSegment]
        }
    },
    methods: {
        checkIfVideoChanged() {
            if (this.segment.video_id != this.whichVideo) {
                this.whichVideo = this.segment.video_id
            }
        },
        organizeSegments() {
            logBlock({name: "organizeSegments"}, ()=>{
                // wait until player is initilized
                if (!this.videoInitilized) {
                    return setTimeout(() => this.organizeSegments(), 100)
                }
                let videoSegments = []
                // 2 percent of the width of the video
                if (this.whichVideo) {
                    let duration = this.player.getDuration()
                    console.debug(`duration is:`,duration)
                    let minWidth = duration / 50
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
                            effectiveEnd,
                            effectiveStart,
                            // how wide the element should be
                            widthPercent: `${(effectiveEnd - effectiveStart)*100/duration}%`,
                            // how close to the left the element should be
                            leftPercent: `${(effectiveStart/duration)*100}%`,
                        }
                    }).filter(each=>each.video_id == this.whichVideo)
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
            })
        },
        ready(event) {
            console.log(`video is ready`)
            this.player = event.target
            window.player = this.player
            this.organizeSegments()
        },
        playing() {
            console.log(`video is playing`)
            this.player.playerInfo.playerState = video.IS_PLAYING
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
                return setTimeout(()=>this.seekToSegmentStart(), 0)
            }
            this.player.seekTo(this.segment.start)
            
            // in this state the player (after seeking) will start playing
            // which isn't the best UX, so pause it immediately
            let state = this.player.playerInfo.playerState
            if (state == video.HASNT_STARTED_STATE || (state == video.IS_PAUSED && !this.videoInitilized)) {
                let seekBackToStart = true
                // give it enough time to load the frame (otherwise it loads infinitely)
                this.player.playVideo()
                // tell the pause exactly where to jump back to after pausing
                this.waitThenPause(seekBackToStart)
            }
        },
        pauseVideo() {
            // TODO: check me
            
            // cancel scheduled play
            if (this.scheduledToggle.type == "play") {
                clearTimeout(this.scheduledToggle.id)
            }
            // reset the schedule
            this.scheduledToggle = {}
            
            if (!this.player) {
                return
            }
            
            this.player.pauseVideo()
            // if video is playing
            if (this.player.playerInfo.playerState == video.IS_PLAYING) {
                // schedule another pause for good measure
                this.scheduledToggle.type = "pause"
                this.scheduledToggle.id = setTimeout(()=>this.pauseVideo(), 50)
            }
        },
        playVideo() {
            // TODO: check me
            
            // cancel scheduled pause
            if (this.scheduledToggle.type == "pause") {
                clearTimeout(this.scheduledToggle.id)
            }
            // reset the schedule
            this.scheduledToggle = {}
            
            if (!this.player) {
                return
            }
            // try to play
            this.player.playVideo()
            
            // if video isn't playing
            if (this.player.playerInfo.playerState != video.IS_PLAYING) {
                // schedule another play for good measure
                this.scheduledToggle.type = "play"
                this.scheduledToggle.id = setTimeout(()=>this.playVideo(), 50)
            }
        },
        videoIsPaused() {
            // TODO: check me
            
            if (this.scheduledToggle.type == "play") {
                return false
            }
            if (this.player == null || this.scheduledToggle.type == "pause") {
                return true
            }
            switch (this.player.playerInfo.playerState) {
                case video.IS_PLAYING:
                    return false
                case video.HASNT_EVEN_INITILIZED:
                case video.HASNT_STARTED_STATE:
                case video.IS_LOADING: // this might not always be true, but I'm not sure
                case video.IS_PAUSED:
                    return true
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
    padding: 2.3rem
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