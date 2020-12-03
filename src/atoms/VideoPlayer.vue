<template lang="pug">
    row(width="100%")
        row.message(v-if='!videoId')
            | No Video Selected
        row.message(v-if='videoId && !videoLoaded')
            | Video Loading...
        vue-plyr(playsinline controls)
            div.plyr__video-embed 
                iframe(
                    ref="youtube"
                    :src="`https://www.youtube.com/embed/${videoId}?amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`"
                    allowfullscreen
                    allowtransparency
                    controls
                    playsinline
                    allow="autoplay"
                )
        
</template>
<script>
const video = {
    IS_LOADING: -1,
    HAS_ENDED: 0,
    IS_PLAYING: 1,
    IS_PAUSED: 2,
    BUFFERING: 3,
    HASNT_EVEN_INITILIZED: null,
    IS_CUED: 5,
}
export default {
    props: [
        "videoId",
        "eventLine",
    ],
    components: {
    },
    data() {
        return {
            player: null,
            videoLoading: new Promise((resolve, reject)=>{
                setTimeout(() => {
                    this.videoLoading.then(resolve).catch(reject)
                }, 0)
            }),
            videoLoaded: false,
        }
    },
    watch: {
        videoId() {
            this.loadVideo()
        },
        eventLine: {
            deep: true,
            handler() {
                // schedule all the events
                for (let each of [this.eventLine]) {
                    this[each.function](...each.args)
                    // remove each one
                    this.eventLine.shift()
                }
            }
        }
    },
    mounted() {
        window.YoutubePlayer = this // debugging
        // init
        this.loadVideo()
    },
    // allow things to dynamically hook into the updated event
    updated() {
        this.$emit("VideoPlayer-updated")
    },
    windowListeners: {
        keydown(eventObj) {
            // only when focused on the nothing or this element
            // (this is to exclude textboxes)
            if (eventObj.target == this.$el || eventObj.target == document.body) {
                // 
                // key controls
                // 
                switch (eventObj.key) {
                    case ".":
                        eventObj.preventDefault()
                        try {
                            // skip ahead 1 frame
                            this.player.forward(1/60)
                        } catch (err) {}
                        // this.incrementIndex()
                        break
                    case ",":
                        eventObj.preventDefault()
                        try {
                            // skip back 1 frame
                            this.player.rewind(1/60)
                        } catch (err) {}
                        eventObj.preventDefault()
                        break
                    default:
                        // we dont care about other keys
                        break
                }
            }
        }
    },
    methods: {
        loadVideo() {
            console.log(`loading video`)
            const newVideoId = this.videoId
            this.videoLoaded = false
            let safteyCheck = (reject) => (this.videoId != newVideoId) && reject()
            
            if (typeof this.videoId != "string" || this.videoId.length == 0) {
                console.debug(`loadVideo: this.videoId is:`,this.videoId)
                return
            }
            // 
            // wait for the player to load
            // 
            this.videoLoading = new Promise(async (resolve, reject)=>{
                let checkForPlayer = (resolve, reject) => () => {
                    safteyCheck(reject)
                    if (this.$refs.youtube && this.$refs.youtube.plyr) {
                        this.player = this.$refs.youtube.plyr
                        this.$emit("VideoPlayer-loaded", this.$refs.youtube.plyr)
                        this.videoLoaded = true
                        resolve(this.player)
                    } else {
                        // recursively wait because theres no callback API
                        // (the ready callback doens't work 100% of the time)
                        setTimeout(checkForPlayer(resolve, reject), 500)
                    }
                }
                this.$once("VideoPlayer-updated", checkForPlayer(resolve, reject))
                this.$forceUpdate()
            })
        },
        resetVideo() {
            this.player = null
            // fully remove the old player to prevent loading issues
            if (this.$refs.youtube && this.$refs.youtube.$destroy instanceof Function) {
                this.$refs.youtube.$destroy()
            }
        },
        // 
        // actions
        // 
        async seekTo(startTime) {
            const videoId = this.videoId
            await this.videoLoading
            // if the video hasn't changed
            if (videoId == this.videoId) {
                this.player.currentTime = startTime
            }
        },
        // 
        // events
        // 
        paused (event) { this.$emit("VideoPlayer-paused"); window.dispatchEvent(new CustomEvent("CenterStage: paused")) }, // FIXME
        playing(event) {
            console.log("VideoPlayer-playing")
            this.$emit("VideoPlayer-playing")
        },
    }
}
</script>

<style lang='sass' scoped>
.video-width-sizer
    --max-width: calc(70rem)
    width: 50vw
    min-width: 18rem
    max-width: var(--max-width)
    height: fit-content
    
    .video-sizer
        position: relative
        padding: 0 1rem 
        // width
        width: 96%
        max-width: inherit
        min-width: inherit
        // height
        height: 0
        padding-top: 56.25%
.message
    position: absolute
    top: 2rem
.plyr
    width: 100%
</style>