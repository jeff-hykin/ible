<template lang="pug">
    row(width="100%")
        row.message(v-if='!videoId')
            | No Video Selected
        row.message(v-if='videoId && !videoLoaded')
            | Video Loading...
        vue-plyr(ref="vuePlyr" :style="`opacity: ${videoId && videoLoaded ? 1 : 0}`" :key="videoId")
            div.plyr__video-embed
                iframe(
                    ref="videoPlayer"
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
            console.log(`videoId for video player changed`)
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
        window.VideoPlayer = this // debugging
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
            const newVideoId = this.videoId
            let safteyCheck = (reject) => (this.videoId != newVideoId) && reject()
            this.videoLoaded = false
            this.player = null
            
            if (typeof this.videoId != "string" || this.videoId.length == 0) {
                return
            }
            
            // 
            // wait for the player to load
            // 
            this.videoLoading = new Promise(async (resolve, reject) => {
                let checkForPlayer = (resolve, reject) => () => {
                    safteyCheck(reject)
                    if (this.$refs.videoPlayer && this.$refs.videoPlayer.plyr && this.$refs.videoPlayer.plyr.duration) {
                        this.player = this.$refs.videoPlayer.plyr
                        this.$emit("VideoPlayer-loaded", this.$refs.videoPlayer.plyr)
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
    }
}
</script>

<style lang='sass'>
.message
    position: absolute
    bottom: 2rem

.plyr
    width: 100%

.plyr__poster
    z-index: -1 !important

</style>