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
                    :src="`https://www.youtube.com/embed/${videoId}?amp;iv_load_policy=3&amp;modestbranding=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`"
                    allowtransparency
                    controls
                )
        
</template>
<script>
// TODO: fix the fullscreen mode
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
            // BACKTRACK: remove this promise
            videoLoading: new Promise((resolve, reject)=>setTimeout(()=>this.videoLoading.then(resolve).catch(reject), 0)),
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
                for (let each of this.eventLine) {
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
                            this.player.forward(1/32)
                        } catch (err) {}
                        // this.incrementIndex()
                        break
                    case ",":
                        eventObj.preventDefault()
                        try {
                            // skip back 1 frame
                            this.player.rewind(1/32)
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
            this.player && this.player.destroy()
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
                        let focusWatcher = () => {
                            let iframe = this.player.elements.wrapper.children[0]
                            // we don't want to focus on the iframe ever
                            if (document.activeElement == iframe) {
                                // delayed recurse just as a check
                                setTimeout(focusWatcher, 0)
                                // focusing on nothing to move the focus to the body
                                document.activeElement.blur()
                                // alternatively focus directly on the player itself
                                // this.player.elements.buttons.play[0].focus()
                                // this.player.elements.buttons.play[1].focus()
                            }
                        }
                        window.addEventListener("focus",focusWatcher)
                        window.addEventListener("blur",focusWatcher)
                        Object.defineProperty(Object.getPrototypeOf(this.player), "currentTime", {
                            set(input) {
                                // Bail if media duration isn't available yet
                                if (!this.duration) { return }
                                // Validate input
                                input = input-0
                                const inputIsValid = (input == input) && input >= 0
                                if (inputIsValid) {
                                    // Set
                                    this.media.currentTime = Math.min(input, this.duration)
                                    let location = (input / this.duration) * 100
                                    setTimeout(() => {
                                        this.elements.inputs.seek.setAttribute("value", location)
                                        this.elements.inputs.seek.setAttribute("aria-valuenow", location)
                                        this.elements.inputs.seek.style.setProperty("--value", `${location}%`)
                                    }, 0)
                                }
                                // Logging
                                this.debug.log(`Seeking to ${this.currentTime} seconds`)
                            }
                        })
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
                console.debug(`startTime is:`,startTime)
                console.debug(`this.player.duration is:`,this.player.duration)
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