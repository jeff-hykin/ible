<template lang="pug">
    row(width="100%")
        transition(name="fade")
            row.message(v-if='!videoPathOrUrl')
                | no video selected
        transition(name="fade")
            row.message(v-if='videoPathOrUrl && !player')
                | Video Loading...
        video(v-if='isLocalVideo(videoPathOrUrl)' ref="nativePlayer" controls style="width: 100%; z-index: 7;")
            source(:src="localVideoSource")
        vue-plyr(v-if='!isLocalVideo(videoPathOrUrl)' ref="vuePlyr" :style="`transition: all ease 0.6s; opacity: ${videoPathOrUrl && player ? 1 : 0}`" :key="`${Math.random()}`.replace('.','')")
            div.plyr__video-embed(v-if='!isLocalVideo(videoPathOrUrl)')
                iframe(
                    ref="videoPlayer"
                    :src="`https://www.youtube.com/embed/${extractYoutubeVideoId(videoPathOrUrl)}?amp;iv_load_policy=3&amp;modestbranding=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`"
                    allowtransparency
                    controls
                )
        
</template>
<script>
import { extractYoutubeVideoId, isLocalVideo } from "../tooling/video_tooling.js"
import * as basics from "../tooling/basics.bundle.js"
import * as vueTooling from "../tooling/vue_tooling.js"
const { get, set } = basics

export default {
    // emits:
        // :videoStartedLoading
        // :videoLoaded
        // :currentTimeChanged
    props: [
        "videoPathOrUrl",
    ],
    components: {
    },
    data() {
        return {
            dragging: false,
            isWindows: navigator.userAgent.indexOf('Win') !== -1,
            _previousCurrentTime: null,
            _previousVideoPathOrUrl: null,
            player: null,
        }
    },
    computed: {
        localVideoSource() {
            return `/videos/${this.videoPathOrUrl}`.replace(/^\/videos\/\/videos\//g, "/videos/")
        }
    },
    watch: {
        videoPathOrUrl() {
            this.internalLoadVideo()
        },
    },
    mounted() {
        this.intervalId = setInterval(this.onInterval, 100)
        
        window.VideoPlayer = this // debugging
        this.internalLoadVideo()
        
        if (window.chrome) {
            vueTooling.showLongMessage(`<br><br>Warning: Looks like you're using Chrome-based Browser<br><br>(as of 2024) Chrome's native video player has a lot of bugs, to the point that its considered broken<br>You can try and use it anyways, but its recommended to use Firefox or Safari so the video player will work well<br><br>`)
        }
    },
    // allow things to dynamically hook into the updated event
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
        extractYoutubeVideoId,
        isLocalVideo,
        onInterval() {
            this.focusWatcher()
            // currentTime updater
            let currentTime = this.player?.currentTime
            if (currentTime != null) {
                currentTime = currentTime-0
            }
            if (this.player?.currentTime != this._previousCurrentTime) {
                this._previousCurrentTime = currentTime
                this.$emit("currentTimeChanged", currentTime)
            }
        },
        focusWatcher(...args) {
            // 
            // don't let focus stay on plyr player (breaks keyboard controls)
            // 
            
            if (!this.dragging) {
                // de-focus the video element so keyboard controls work
                if (document.activeElement.tagName === "IFRAME" || document.activeElement.tagName === "VIDEO") {
                    console.log(`[VideoPlayer] removing focus from video element`)
                    // focusing on nothing to move the focus to the body
                    document.activeElement.blur()
                }
            }
        },
        resetData() {
            this._previousCurrentTime = null
            this._previousVideoPathOrUrl = null
            this.player = null
        },
        internalLoadVideo() {
            // 
            // videoStartedLoading event
            // 
                // if no change
                if (this._previousVideoPathOrUrl == this.videoPathOrUrl) {
                    return
                }
                this._previousVideoPathOrUrl = this.videoPathOrUrl
                this.resetData()
                this.$emit("videoStartedLoading", this.videoPathOrUrl)
            
            
            // 
            // newVideoLoaded event
            // 
                const videoPathOrUrl = this.videoPathOrUrl
                const tryingToLoadNullVideo = !videoPathOrUrl
                if (tryingToLoadNullVideo) {
                    this.$emit("videoLoaded", null)
                    return
                }
            
                // 
                // wait for the player to load
                // 
                let videoIsPath = this.isLocalVideo(videoPathOrUrl)
                let intervalId = setInterval(() => {
                    const videoChangedInTheMeantime = this.videoPathOrUrl != videoPathOrUrl
                    if (videoChangedInTheMeantime) {
                        clearInterval(intervalId)
                        return
                    }
                    
                    // 
                    // setup player object
                    // 
                    if (!this.player) {
                        // 
                        // local player
                        //
                        if (this.$refs.nativePlayer) {
                            let player = this.$refs.nativePlayer
                            player.addEventListener("keydown", this.keydownControls)
                            this.player = player
                            // enable scrubbing 
                            // this was attempt at fixing the scubber on Chrome, but it seems to be unfixable
                            // as of 2024-07-01, the native VideoPlayer in Chrome seems very broken
                                // this.dragging = false
                                // this.$refs.nativePlayer.addEventListener("mousemove", (eventObject)=>{
                                //     window.player = this.player
                                //     this.dragging = eventObject.buttons === 1
                                //     if (this.dragging && this.player.duration) {
                                //         const width = this.$refs.nativePlayer.clientWidth
                                //         const directProportion = eventObject.layerX / width
                                //         const maxProportion = 0.68
                                //         const minProportion = 0.07
                                //         let adjustedProportion = directProportion
                                //         if (directProportion > maxProportion) {
                                //             adjustedProportion = maxProportion
                                //         } else if (directProportion < minProportion) {
                                //             adjustedProportion = minProportion
                                //         }
                                //         const durationProportion = (adjustedProportion-minProportion)/(maxProportion-minProportion)
                                //         this.player.currentTime = durationProportion * this.player.duration
                                //         // for some reason the player likes to un-pause when scrubbing 
                                //         let pauseCount = 4 // try it. I dare you. Try reducing this number and see if scrubbing also causes the player to un-pause
                                //                            // this value should be 1 but its not because browser players are stupid
                                //         setTimeout(async () => {
                                //             console.log(`pausing 1`)
                                //             while (pauseCount--) {
                                //                 this.player.pause()
                                //                 await new Promise(r=>setTimeout(r,100))
                                //             }
                                //         }, 0)
                                //     }
                                // })
                        // 
                        // plyr player
                        // 
                        } else {
                            let player = this.$refs.vuePlyr?.player?.media
                            
                            // 
                            // fix the scubber update issue
                            // 
                            try {
                                
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
                                        }
                                    },
                                    get() {
                                        return this.media.currentTime
                                    }
                                })
                            } catch (error) {
                                
                            }
                            
                            // plyr
                            const container = player?.elements?.container
                            if (container) {
                                container.addEventListener("keydown", this.keydownControls)
                            }
                            this.player = player
                        }
                    }
                    
                    const videoDurationIsAvailable = this.player?.duration != null
                    if (videoDurationIsAvailable) {
                        this.$emit("videoLoaded", this.player)
                        clearInterval(intervalId)
                    }
                }, 100)
        },
        keydownControls(eventObject) {
            // only when focused on the nothing or this element
            // (this is to exclude textboxes)
            if (this.player instanceof Object && ["DIV", "BUTTON", "BODY"].includes(eventObject.target.tagName) || get({ keyList: ["path"], from: eventObject, failValue: [] }).includes(this.$el) || `${eventObject.target.id}`.startsWith("plyr-")) {
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
                        if (!this.player.paused) {
                            setTimeout(() => {
                                this.player.pause()
                            },50)
                        } else {
                            setTimeout(() => {
                                this.player.play()
                            },50)
                        }
                        break
                    case ".":
                        eventObject.preventDefault()
                        this.player.currentTime += (1/32)
                        break
                    case ",":
                        eventObject.preventDefault()
                        this.player.currentTime -= (1/32)
                        break
                    case "ArrowRight":
                        if (eventObject.shiftKey) {
                            eventObject.preventDefault()
                            this.player.currentTime += (1/32)
                        } else if (eventObject.altKey) {
                            eventObject.preventDefault()
                            this.player.currentTime += (10)
                        } else if (!eventObject.ctrlKey) {
                            eventObject.preventDefault()
                            this.player.currentTime += (5)
                        }
                        break
                    case "ArrowLeft":
                        if (eventObject.shiftKey) {
                            eventObject.preventDefault()
                            this.player.currentTime -= (1/32)
                        } else if (eventObject.altKey) {
                            eventObject.preventDefault()
                            this.player.currentTime -= (10)
                        } else if (!eventObject.ctrlKey) {
                            eventObject.preventDefault()
                            this.player.currentTime -= (5)
                        }
                        break
                    case "ArrowUp":
                        if (eventObject.shiftKey) {
                            eventObject.preventDefault()
                            this.player.playbackRate *= 2
                        }
                        break
                    case "ArrowDown":
                        if (eventObject.shiftKey) {
                            eventObject.preventDefault()
                            this.player.playbackRate *= 0.5
                        }
                        break
                }
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