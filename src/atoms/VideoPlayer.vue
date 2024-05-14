<template lang="pug">
    row(width="100%")
        transition(name="fade")
            row.message(v-if='!videoId')
                | No Video Selected
        transition(name="fade")
            row.message(v-if='videoId && !player')
                | Video Loading...
        vue-plyr(v-if='isLocalVideo' ref="vuePlyr" :style="`transition: all ease 0.6s; opacity: ${videoId && player ? 1 : 0}`" :key="videoId")
            video(:src="videoId")
        vue-plyr(v-if='!isLocalVideo' ref="vuePlyr" :style="`transition: all ease 0.6s; opacity: ${videoId && player ? 1 : 0}`" :key="videoId")
            div.plyr__video-embed(v-if='!isLocalVideo')
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
        "value",
        "videoId",
        "eventLine",
    ],
    components: {
    },
    data() {
        return {
            player: null,
            videoLoading: new Promise((resolve, reject)=>setTimeout(()=>this.videoLoading.then(resolve).catch(reject), 0)),
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
            let iframe = get(this.player, ["elements", "wrapper", "children", 0], undefined)
            // we don't want to focus on the iframe ever
            if (document.activeElement === iframe) {
                // delayed recurse just as a check
                setTimeout(this.focusWatcher, 0)
                // focusing on nothing to move the focus to the body
                document.activeElement.blur()
                // alternatively focus directly on the player itself
                // this.player.elements.buttons.play[0].focus()
                // this.player.elements.buttons.play[1].focus()
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
                    if (get(this, ["$refs", "vuePlyr", "player", "duration"], 0) !== 0) {
                        this.player = this.$refs.vuePlyr.player
                        console.debug(`this.player is:`,this.player)
                        this.setupPlayer(this.player)
                        this.$emit("VideoPlayer-loaded", this.$refs.vuePlyr.player)
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
            this.externalData.duration = this.player.duration
            let updateCurrentTime = (...args) => {
                this.externalData.currentTime = get(this, ['player', 'media', 'currentTime'], null)
                setTimeout(() => {
                    this.externalData.currentTime = get(this, ['player', 'media', 'currentTime'], null)
                }, 50)
            }
            updateCurrentTime()
            this.player.on("seeked", updateCurrentTime)
            this.player.on("seeking", updateCurrentTime)
            this.player.on("timeupdate", updateCurrentTime)
            this.player.on("play", updateCurrentTime)
            this.player.on("pause", updateCurrentTime)
            
            // 
            // fix the scubber update issue
            // 
            let that = this
            Object.defineProperty(Object.getPrototypeOf(this.player), "currentTime", {
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
                        setTimeout(() => that.externalData.currentTime = this.media.currentTime, 0)
                        setTimeout(() => that.externalData.currentTime = this.media.currentTime, 50)
                        setTimeout(() => that.externalData.currentTime = this.media.currentTime, 150)
                        let location = (input / this.duration) * 100
                        setTimeout(() => {
                            try {
                                this.elements.inputs.seek.setAttribute("value", location)
                                this.elements.inputs.seek.setAttribute("aria-valuenow", location)
                                this.elements.inputs.seek.style.setProperty("--value", `${location}%`)
                            } catch (error) {
                                console.error(error)
                            }
                        }, 0)
                    }
                    // Logging
                    this.debug.log(`Seeking to ${this.currentTime} seconds`)
                }
            })
            
            // 
            // add custom controls
            //
            this.player.elements.container.addEventListener("keydown", this.keydownControls)
        },
        keydownControls(eventObject) {
            // only when focused on the nothing or this element
            // (this is to exclude textboxes)
            if (eventObject.target == document.body || get(eventObject, ["path"], []).includes(this.$el)) {
                // 
                // key controls
                // 
                switch (eventObject.key) {
                    case ".":
                        eventObject.preventDefault()
                        this.player.foward(1/32)
                        break
                    case ",":
                        eventObject.preventDefault()
                        this.player.rewind(1/32)
                        break
                    case "ArrowRight":
                        if (eventObject.shiftKey) {
                            console.log(`going forward`)
                            eventObject.preventDefault()
                            this.player.forward(1/32)
                        } else if (eventObject.altKey) {
                            eventObject.preventDefault()
                            this.player.forward(10)
                        }
                        break
                    case "ArrowLeft":
                        if (eventObject.shiftKey) {
                            eventObject.preventDefault()
                            this.player.rewind(1/32)
                        } else if (eventObject.altKey) {
                            eventObject.preventDefault()
                            this.player.rewind(10)
                        }
                        break
                    case "ArrowUp":
                        if (eventObject.shiftKey) {
                            eventObject.preventDefault()
                            this.player.speed += 0.5
                        }
                        break
                    case "ArrowDown":
                        if (eventObject.shiftKey) {
                            eventObject.preventDefault()
                            this.player.speed -= 0.5
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
                this.player.currentTime = startTime
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