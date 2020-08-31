<template lang="pug">
    column.video-panel(v-if='segments' :opacity='segments? 1 : 0' flex-grow=1)
        row.next
        column.video-sizer(height="40vw" width='100%')
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
        row(align-h="space-between" width="100%")
            ui-button.btn(color="primary" @click='deincrementIndex')
                | Prevous
            
            ui-button.btn(color="primary" @click='incrementIndex')
                | Next

</template>

<script>
import { wrapIndex, EventEmitter } from '../utils'
import JsonTree from 'vue-json-tree'

export let videoEvents = new EventEmitter()

import { segmentEvents } from "./Segments"


export default {
    props: [ 'segments' ],
    components: { JsonTree },
    data: ()=>({
        player: null,
        whichSegment: 0,
        videoInitilized: false,
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
        ready(event) {
            this.player = event.target
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
        deincrementIndex() {
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

<style lang='sass'>
.video-panel
    border: 2.5rem solid transparent
    flex-shrink: 0
    min-height: 44vw
    transition: opacity ease 0.5s
    width: 72vw
    min-width: fit-content
    .video-sizer
        min-width: 18rem
        
.btn
    margin: 1rem
    margin-top: 2rem

</style>