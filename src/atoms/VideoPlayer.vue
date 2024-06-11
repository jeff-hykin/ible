<template lang="pug">
    row(width="100%")
        transition(name="fade")
            row.message(v-if='!videoId')
                | No Video Selected
        transition(name="fade")
            row.message(v-if='videoId && !player')
                | Video Loading...
        video(v-if='isLocalVideo' ref="nativePlayer" controls style="width: 100%; z-index: 7;")
           source(:src="videoId" type="video/mp4")
        //- vue-plyr(v-if='isLocalVideo' ref="vuePlyr1" :style="`transition: all ease 0.6s; opacity: ${videoId && player ? 1 : 0}`" :key="`${Math.random()}`.replace('.','')")
        vue-plyr(v-if='!isLocalVideo' ref="vuePlyr2" :style="`transition: all ease 0.6s; opacity: ${videoId && player ? 1 : 0}`" :key="`${Math.random()}`.replace('.','')")
            div.plyr__video-embed(v-if='!isLocalVideo')
                iframe(
                    ref="videoPlayer"
                    :src="`https://www.youtube.com/embed/${videoId}?amp;iv_load_policy=3&amp;modestbranding=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`"
                    allowtransparency
                    controls
                )
        
</template>
<script>
const { deferredPromise } = require("../utils.js")
window.resetPlayer = false
// TODO: fix the fullscreen mode
export default {
    props: [
        "value",
        "videoId",
        "eventLine",
    ],
    components: {
    },
    data() {
        return {
            player: null,
            videoLoading: this.$root.videoLoadedPromise,
        }
    },
    computed: {
        isLocalVideo: {
            get() {
                return `${this.videoId}`.startsWith("/videos/")
            }
        },
        externalData: {
            get() {
                return this.value
            },
            set(value) {
                this.$emit("input", value)
            }
        }
    },
    watch: {
        externalData: {
            deep: true,
            handler() {
                this.$emit("input", this.externalData)
            }
        },
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
        this.intervalId = setInterval(this.focusWatcher, 500)
    },
    // allow things to dynamically hook into the updated event
    updated() {
        this.$emit("VideoPlayer-updated")
    },
    destroyed() {
        clearInterval(this.intervalId)
    },
    windowListeners: {
        focus(...args) {
            this.focusWatcher(...args)
        },
        blur(...args) {
            this.focusWatcher(...args)
        },
        keydown(eventObject) {
            this.keydownControls(eventObject)
        }
    },
    methods: {
        focusWatcher() {
            // 
            // don't let focus stay on YouTube player
            // 
            
            // we don't want to focus on the iframe ever
            if (document.activeElement.tagName === "IFRAME" || document.activeElement.tagName === "VIDEO") {
                // focusing on nothing to move the focus to the body
                document.activeElement.blur()
            }
        },
        loadVideo() {
            const newVideoId = this.videoId
            let safteyCheck = (reject) => (this.videoId != newVideoId) && reject()
            // 
            // reset existing data  
            // 
            this.externalData.duration = null
            this.externalData.currentTime = null
            
            // if video is un-selected, reset was the only thing needed
            if (typeof this.videoId != "string" || this.videoId.length == 0) {
                return
            }
            
            // 
            // start waiting for the player to load
            // 
            // starting with the next update, keep checking until the video has loaded
            this.videoLoading = new Promise(async (resolve, reject) => {
                console.log(`waiting for video to load`)
                // a seperate function is needed so that recursion is possible
                let checkForPlayer = (resolve, reject) => () => {
                    console.log(`checking For Player`)
                    safteyCheck(reject)
                    const vuePlyr = this.$refs.nativePlayer || (this.$refs.vuePlyr2)&&this.$refs.vuePlyr2.player
                    if (get(vuePlyr, ["duration"], 0) !== 0) {
                        window.resetPlayer = false
                        this.player = vuePlyr
                        let checkDuration = () => {
                            if (this.player.duration != undefined) {
                                this.$root.videoLoadedPromise.resolve(this.player)
                            } else {
                                setTimeout(checkDuration, 50)
                            }
                        }
                        setTimeout(checkDuration, 0)
                        // hacky I know but the more obvious ways are not working (e.g. this.$refs.vuePlyr2.player)
                        // I'm also fighting interal-vue errors because vue2 is end-of-life and buggy
                        Object.defineProperty(window, "player", {
                            get:() => {
                                if (window.resetPlayer) {
                                    return { currentTime: 0 }
                                }
                                let output
                                if (this.$refs.nativePlayer) {
                                    output = this.$refs.nativePlayer
                                } else {
                                    output = document.querySelector(".plyr").__vue__.player.media
                                }
                                return output
                            }
                        })
                        console.debug(`this.player is:`,this.player)
                        this.setupPlayer(this.player)
                        this.$emit("VideoPlayer-loaded", this.player)
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
        setupPlayer(player) {
            // 
            // add listeners to the player
            //
            this.externalData.duration = player.duration
            
            // 
            // fix the scubber update issue
            // 
                if (!this.isLocalVideo) {
                    let that = this
                    Object.defineProperty(Object.getPrototypeOf(player), "currentTime", {
                        set(input) {
                            // Bail if media duration isn't available yet
                            if (!this.duration) { return }
                            // Validate input
                            input = input-0
                            if (input < 0) {
                                input = 0
                            }
                            const inputIsValid = (input == input) && input >= 0
                            if (inputIsValid) {
                                // Set
                                this.media.currentTime = Math.min(input, this.duration)
                                that.externalData.currentTime = this.media.currentTime
                            }
                            // Logging
                            this.debug.log(`Seeking to ${this.currentTime} seconds`)
                        }
                    })
                }
            
            // 
            // add custom controls
            //
            try {
                // plyr
                player.elements.container.addEventListener("keydown", this.keydownControls)
            } catch (error) {
                // native player
                player.addEventListener("keydown", this.keydownControls)
            }
        },
        keydownControls(eventObject) {
            console.debug(`eventObject is:`,eventObject)
            // only when focused on the nothing or this element
            // (this is to exclude textboxes)
            if (["DIV", "BUTTON", "BODY"].includes(eventObject.target.tagName) || get(eventObject, ["path"], []).includes(this.$el) || `${eventObject.target.id}`.startsWith("plyr-")) {
                // 
                // key controls
                // 
                switch (eventObject.key) {
                    case " ":
                    case "k":
                        console.log(`toggling play/pause!`)
                        eventObject.preventDefault()
                        eventObject.stopPropagation()
                        // yes, this 50ms delay is necessary otherwise it sometimes fights with the bulitin window listeners from plyr (and sometimes doesn't depending on what element is selected)
                        if (!window.player.paused) {
                            setTimeout(() => {
                                window.player.pause()
                            },50)
                        } else {
                            setTimeout(() => {
                                window.player.play()
                            },50)
                        }
                        break
                    case ".":
                        eventObject.preventDefault()
                        window.player.currentTime += (1/32)
                        break
                    case ",":
                        eventObject.preventDefault()
                        window.player.currentTime -= (1/32)
                        break
                    case "ArrowRight":
                        if (eventObject.shiftKey) {
                            eventObject.preventDefault()
                            window.player.currentTime += (1/32)
                        } else if (eventObject.altKey) {
                            eventObject.preventDefault()
                            window.player.currentTime += (10)
                        } else if (!eventObject.ctrlKey) {
                            eventObject.preventDefault()
                            window.player.currentTime += (5)
                        }
                        break
                    case "ArrowLeft":
                        if (eventObject.shiftKey) {
                            eventObject.preventDefault()
                            window.player.currentTime -= (1/32)
                        } else if (eventObject.altKey) {
                            eventObject.preventDefault()
                            window.player.currentTime -= (10)
                        } else if (!eventObject.ctrlKey) {
                            eventObject.preventDefault()
                            window.player.currentTime -= (5)
                        }
                        break
                    case "ArrowUp":
                        if (eventObject.shiftKey) {
                            eventObject.preventDefault()
                            window.player.playbackRate *= 2
                        }
                        break
                    case "ArrowDown":
                        if (eventObject.shiftKey) {
                            eventObject.preventDefault()
                            window.player.playbackRate *= 0.5
                        }
                        break
                }
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
                window.player.currentTime = startTime
                // always focus on the video immediately after seeking
                document.activeElement.blur()
            }
        },
    }
}
</script>

<style lang='sass' scoped>
.message
    position: absolute
    bottom: 2rem
    color: gray

::v-deep .plyr
    width: 100%

::v-deep .plyr__poster
    z-index: -1 !important

</style>