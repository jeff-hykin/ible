<template lang="pug">
    column.video-panel(:width="segments? '72vw' : '0' " :opacity='segments? 1 : 0' flex-grow=1)
        column(height="40vw" width='100%')
            youtube(
                v-if='segments'
                :video-id="segment.videoId"
                :player-vars='{start: segment.start}'
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
        column
            row(
                v-for="(each, index) in segments"
                shadow=2
                padding='1pc 2rem'
                border-radius='1rem'
                margin-bottom='1rem'
                :background="index==whichSegment ? 'gray' : 'transparent' "
                :color="index==whichSegment ? 'white' : 'inherit' "
                :opacity="index==whichSegment ? 1 : 0.7 "
                @click="jumpSegment(index)"
                max-width='75vw'
                wrap
            )
                h4 Segment
                row(width="1rem") 
                JsonTree.json-tree-root(:data='each')
</template>

<script>
import { wrapIndex } from '../utils'
import JsonTree from 'vue-json-tree'

export default {
    props: [ 'segments' ],
    components: { JsonTree },
    data: ()=>({
        player: null,
        whichSegment: 0,
    }),
    watch: {
        segments(value, oldValue) {
            this.seekToSegmentStart()
        },
        whichSegment(value) {
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
                // if there is a seek back time, go there
                if (seekBackToStart) {
                    this.player.seekTo(this.segment.start)
                }
            } else {
                setTimeout(() => {
                    this.player.playVideo()
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
            // console.log(`seeking to segment start`)
            this.player.seekTo(this.segment.start)
            // console.log(`this.player.getPlayerState() is:`,this.player.getPlayerState())
            
            // in this state the player (after seeking) will start playing
            // which isn't the best UX, so pause it immediately
            const VIDEO_HASNT_STARTED_STATE = 5
            const VIDEO_PAUSED_STATE = 2
            let state = this.player.getPlayerState()
            if (state == VIDEO_HASNT_STARTED_STATE || state == VIDEO_PAUSED_STATE) {
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
    overflow: hidden
    border: 2.5rem solid transparent
    flex-shrink: 0
    min-height: 44vw
    transition: opacity ease 0.5s
.btn
    margin: 1rem
    margin-top: 2rem
.json-tree-root
    border-radius: 1rem
    border: gray solid 2px
    max-width: 50vw
    min-width: 0
    
</style>