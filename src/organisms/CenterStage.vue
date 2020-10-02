<template lang="pug">
    column.main-container(v-if='$root.selectedVideo' :opacity='$root.selectedVideo? 1 : 0' flex-grow=1)
        //- search for video
        column.top-bar-container(width="100%" padding="1rem")
            ui-autocomplete.rounded-search(
                placeholder="Search for a video id"
                @select="videoSelect"
                v-model="searchTerm"
                :suggestions="suggestions"
            )
            span(v-if='$root.getVideoId()' style="color: darkgrey;")
                | Selected Label: {{$root.selectedLabel.name}}
                br
                | Current Video ID: {{$root.getVideoId()}}
                br
                | Pause Time: {{currentTime}} ms
            
        row.below-video-search(flex-basis="100%" padding-top="1rem" align-v="top")
            //- Video area
            column(align-v="top").video-width-sizer
                row.video-sizer
                    //- BACK
                    SideButton(left @click='decrementIndex')
                    
                    youtube(
                        v-if='$root.getVideoId()'
                        :key="$root.getVideoId()"
                        ref="youtube"
                        :host="this.player ? 'http://www.youtube-nocookie.com/' : 'https://www.youtube.com'"
                        :video-id="$root.getVideoId()"
                        @ready="ready"
                        @playing="videoStartedPlaying"
                        @paused="videoWasPaused"
                        :playerVars="{ /* disablekb: 1, end: 2 */ }"
                        player-width="100%"
                        player-height="100%"
                        style="height: 100%;width: 100%;"
                    )
                    //- NEXT
                    SideButton(right @click='incrementIndex')
            column
                MomentEditor

</template>

<script>
const { endpoints } = require("../iilvd-api")
const { wrapIndex, storageObject } = require('../utils')
const { dynamicSort, logBlock, checkIf, get, set } = require("good-js")
const Fuse = require("fuse.js").default

const generalTimeoutFrequency = 50 // ms 
const video = {
    IS_LOADING: -1,
    HAS_ENDED: 0,
    IS_PLAYING: 1,
    IS_PAUSED: 2,
    BUFFERING: 3,
    HASNT_EVEN_INITILIZED: null,
    IS_CUED: 5,
}
// 
// summary
//
    // set:
    //     this.$root.labels[].selected
    //     this.$root.selectedVideo.keySegments
    //     this.$root.selectedVideo.duration
    //     this.$root.selectedSegment
    // 
    // get:
    //     this.$root.labels
    //     this.$root.segments
    // 
    // retreives:
    // 
    // listeners:
    //     this.$root.$watch.labels
    //     this.$root.$watch.selectedVideo
    //     this.$root.$watch.selectedSegment
    //     "CenterStage: videoStartedPlaying"
    // 
    // emits:
    //     "CenterStage: videoStartedPlaying"

// make sure cachedVideoIds exists as an Array
storageObject.cachedVideoIds || (storageObject.cachedVideoIds = [])

export default {
    props: [],
    components: {
        JsonTree: require('vue-json-tree').default,
        SideButton: require("../atoms/SideButton").default,
        MomentEditor: require("../organisms/MomentEditor").default,
    },
    data: ()=>({
        currentTime: 0,
        searchTerm: null,
        suggestions: [],
        
        player: null,
        videoManagementData: {
            videoIsReady: false,
            idOfLastInitilizedVideo: null,
            initCheckAlreadyRunning: false,
        },
    }),
    resolvables: {
        // these are used for loading data in a very dynamic way,
        // such as data that can be loaded from two seperate sources
        // and allowing for either source (simultaneously) to resolve the data
        // this allows any part of the component to say
        // "okay I found/calculated that data that another function(s) depended on"
        // the alternative to this method is often busywaiting or complex callbacks
        // 
        // 
        // can use:
        //     [resolvable].promise
        //     [resolvable].resolve() 
        //     [resolvable].reject()
        //     [resolvable].done      // true/false check
        //     [resolvable].check()   // check/ping the source again for the missing data

        hasVideo(resolve, reject) {
            if (get(this, ["$root", "selectedVideo", "$id"], null)) {
                console.debug("video exists!")
                resolve(this.$root.selectedVideo)
            } else {
                console.debug("nope, video still doesn't exist")
            }
        },
        async hasVideoPlayer(resolve, reject) {
            await logBlock({name: "[resolvable:hasVideoPlayer]"}, async ()=>{
                if (this.videoManagementData.videoIsReady) {
                    if (this.player instanceof Object) {
                        console.debug(`player exists, resolving`)
                        resolve(this.player)
                    }
                } else {
                    console.debug(`nope player still doesn't exist`)
                }
            })
        },
        // videoStateInitilized()
        // this is to cover a stupid bug in the YouTube API
        // the bug shows infinite loading until the video has been played for a bit.
        // Instantly pausing and playing fixes it in the console, but from code it optimizes out the
        // pause-then-play and just stays paused (and continues to show infinite loading)
        // so this needs to play and then pause only after the video has actually started playing
        videoStateInitilized(resolve, reject) {
            // NOTE: this function has a vital counterpart in the $methods.videoStartedPlaying()
            
            const functionCallId = Math.random().toFixed(6)
            let debug = (message, ...args)=>console.debug(`[resolvable:videoStateInitilized: ${functionCallId}] ${message}`, ...args)
            
            // helpers
            let realResolve = ()=>{ this.videoManagementData.initCheckAlreadyRunning = false; this.videoManagementData.idOfLastInitilizedVideo = this.$root.getVideoId(); resolve() }
            let realReject  = ()=>{ this.videoManagementData.initCheckAlreadyRunning = false; reject() }
            
            // make sure a video exists
            if (!this.$root.getVideoId()) {
                return debug(`no video, ending this check`)
            }
            
            // if the player doesn't exist, wait for it to exist, then check again
            if (!this.player) {
                this.hasVideoPlayer.promise.then(this.videoStateInitilized.check)
                return debug(`no player, retrying once player exists`)
            }
            
            // make sure two checks don't start running at the same time
            if (this.videoManagementData.initCheckAlreadyRunning) {
                return debug(`check is already running, ending this check`)
            } else if (this.videoManagementData.idOfLastInitilizedVideo && this.videoManagementData.idOfLastInitilizedVideo == this.$root.getVideoId()) {
                debug(`video already initilized (resolving): ${this.videoManagementData.idOfLastInitilizedVideo}`)
                return realResolve()
            }
            
            let videoHasntLoaded = ()=> this.player && (this.player.getPlayerState() == video.IS_LOADING || this.player.getPlayerState() == video.IS_CUED)
            let videoIsPaused = ()=>(this.player ? this.player.getPlayerState() == video.IS_PAUSED : false)
            // if paused, then the video must already be initilized
            if (videoIsPaused()) {
                debug(`video is paused, therefore it must be initilized. Resolving.`)
                return realResolve()
            // if not paused or loading, then it must be playing. In which case it needs to be paused
            } else if (!videoHasntLoaded()) {
                debug(`something strange happened:\n - the video was not in a loading/paused state (probably playing)\n- but the initCheckAlreadyRunning was false\n- and video hadn't initilized\n\nmaybe something else it the code reset the idOfLastInitilizedVideo?\n`)
                this.player.pauseVideo()
            }
            // prevent doubling up on this part of the code
            this.videoManagementData.initCheckAlreadyRunning = true
            
            const idOfVideoBeingToldToPlay = this.player.getVideoData().video_id
            let selectedVideoId = this.$root.getVideoId()
            if (idOfVideoBeingToldToPlay != selectedVideoId) {
                debug(`the selected video id ${selectedVideoId} is not the same as the id of the video in the player ${idOfVideoBeingToldToPlay}.\n\nTHATS A PROBLEM\nSetting a timer to see if the problem was fixed later`)
                return setTimeout(this.videoStateInitilized.check, generalTimeoutFrequency)
            }
            
            const urlOfVideoToPause = this.player.getVideoUrl()
            // try to play the video if it isn't in a playing state
            this.player.playVideo()
            // as soon as the video starts playing, pause it
            this.$once("CenterStage: videoStartedPlaying", async ()=>{
                const idOfVideoBeingToldToPause = this.player.getVideoUrl()
                // if video has since changed, then cancel
                if (idOfVideoBeingToldToPlay != this.$root.getVideoId()) {
                    realReject()
                    return
                }
                // otherwise immediately pause the video
                this.player.pauseVideo()
                
                // the video isn't initilized until the video finishes pausing
                // so busy-wait for that to happen
                while (1) {
                    // wait the minimum amount of time
                    await new Promise(r=>setTimeout(r,generalTimeoutFrequency))
                    // if the video changed
                    if (!this.player || urlOfVideoToPlay != this.player.getVideoUrl()) {
                        // failed
                        realReject()
                        return
                    }
                    if (videoIsPaused()) {
                        realResolve()
                        return
                    }
                    // if its still not paused, then tell it again that it needs to pause
                    this.player.pauseVideo()
                }
            })
        },
        async hasDurationData(resolve, reject) {
            await logBlock({name: "[resolvable:hasDurationData]"}, async ()=>{
                if (!this.$root.getVideoId()) {
                    console.log(`[resolvable:hasDurationData] video doesn't exist, canceling check`)
                    return
                }
                // try getting the duration in a few ways
                const possibleDuration1 = get(this, ["video", "summary", "duration"     ], NaN)-0
                const possibleDuration2 = get(this, ["player", "playerInfo", "duration" ], NaN)-0
                if (checkIf({value: possibleDuration1, is: Number })) {
                    console.debug(`[resolvable:hasDurationData] video.summary.duration exists, resolving`)
                    resolve(possibleDuration1)
                // if the video player exists
                } else if (checkIf({value: possibleDuration2, is: Number }) && possibleDuration2 > 0) {
                    this.$root.selectedVideo.duration = possibleDuration2
                    console.debug(`[resolvable:hasDurationData] youtube player duration exists, resolving`)
                    resolve(possibleDuration2)
                } else {
                    // start two different requests for the same data
                    // we don't care which finishes first
                    console.debug(`[resolvable:hasDurationData] setting up callbacks for duration `)
                    // 1. request the data from the backend
                    endpoints.then(async (realEndpoints)=>{
                        let video = await this.hasVideo.promise
                        console.log(`getting duration from backend`)
                        let result = await realEndpoints.videos.get({keyList: [ this.$root.getVideoId(), "summary",  "duration" ]})
                        if (checkIf({value: result, is: Number}) && result > 0) {
                            console.debug(`result is:`,result)
                            this.$root.selectedVideo.duration = result
                            this.$forceUpdate() // for some reason vue doens't dectect the change in duration
                            console.log(`resolving`)
                            resolve(this.$root.selectedVideo.duration)
                        }
                    })
                    
                    // 2. wait until there is a video player loaded with duration
                    this.hasVideoPlayer.promise.then(()=>{
                        console.debug(`[resolvable:hasDurationData] this.hasVideoPlayer.promise callback`)
                        // this is a form of recursion, but it won't recurse if the data is already resolved
                        this.hasDurationData.check()
                    })
                }
            })
        },
    },
    mounted() {
        window.centerStage = this
        // add some default suggestions
        this.suggestions = storageObject.cachedVideoIds
        // update the time periodically
        setInterval(() => {
            if (this.player && this.player.getCurrentTime instanceof Function) {
                this.currentTime = (this.player.getCurrentTime()*1000).toFixed()
            }
        }, 700)
    },
    updated() {
        // the player reference doesn't exist till after update
        this.setThisPlayer()
        // this is a hack because of an issue with the youtube embedded player throwing errors
        // https://github.com/anteriovieira/vue-youtube/issues/38
        // https://stackoverflow.com/questions/27573017/failed-to-execute-postmessage-on-domwindow-https-www-youtube-com-http
        let interval 
        interval = setInterval(() => {
            if (this.player instanceof Object) {
                clearInterval(interval)
            } else {
                this.setThisPlayer()
            }
        }, generalTimeoutFrequency)
    },
    windowListeners: {
        keydown(eventObj) {
            console.debug(`EVENT: keydown: ${eventObj.key}`)
            // 
            // key controls
            // 
            // This is disabled because the don't pay attention to the textboxes
            switch (eventObj.key) {
                case "ArrowDown":
                    eventObj.preventDefault()
                    // this.incrementIndex()
                    break
                case "ArrowUp":
                    eventObj.preventDefault()
                    // this.decrementIndex()
                    break
                case " ":
                    eventObj.preventDefault()
                    // this.togglePlayPause()
                    break
                default:
                    // we dont care about other keys
                    break
            }
        }
    },
    rootHooks: {
        watch: {
            // when the selected video changes
            selectedVideo(newValue, oldValue) {
                if (this.$refs.youtube && this.$refs.youtube.$destroy instanceof Function) {
                    this.$refs.youtube.$destroy()
                }
                console.debug(`EVENT-watch: selectedVideo changed`)
                logBlock({name: "selectedVideo changed [CenterStage:watch]"}, async ()=>{
                    // 
                    // reset data
                    // 
                    console.debug(`resetting data`)
                    this.$root.selectedSegment = null // no selected segment
                    this.videoManagementData.initCheckAlreadyRunning = false
                    this.videoManagementData.videoIsReady = false
                    this.segmentsInfo = {
                        maxLevel: 1,
                        organizedSegments: []
                    }
                    console.debug(`data was reset\n`)
                    // update data
                    console.debug(`checking for video id`)
                    if (typeof this.$root.getVideoId() == 'string') {
                        console.debug("video id seems to exist")
                        console.debug("getting this.player reference")
                        this.setThisPlayer()
                        console.debug("telling hasVideo to resolve")
                        this.hasVideo.resolve(newValue)
                    } else {
                        console.debug("there appears not to be an id")
                    }
                    
                    console.debug("awaiting the video to initlize")
                    console.debug(`this.player is:`,this.player)
                    await this.videoStateInitilized.promise
                })
            },
        }
    },
    watch: {
        suggestions(newValue) {
            // save video id suggestions to local storage
            storageObject.cachedVideoIds = newValue
        },
        // when the search term changes
        async searchTerm(value) {
            const minNumberOfCharactersBeforeSearch = 1
            // if no search term
            if (typeof value != 'string' || value.trim().length <= minNumberOfCharactersBeforeSearch) {
                // load all suggestions from storage if search isn't long enough
                this.suggestions = storageObject.cachedVideoIds
            } else {
                // add results from the database
                let realEndpoints = await endpoints
                let possibleVideoIds = await realEndpoints.raw.all({
                    from: "videos",
                    where: [
                        {
                            hiddenValueOf: ["_id"],
                            matches: `^${value.trim()}`,
                        }
                    ],
                    forEach:{
                        extractHidden: [ '_id']
                    },
                })
                console.debug(`setting suggestions`)
                this.suggestions = [...new Set(possibleVideoIds.concat(this.suggestions))]
            }
        }
    },
    methods: {
        videoWasPaused(...args) {
            this.currentTime = (this.player.getCurrentTime()*1000).toFixed()
        },
        setThisPlayer() {
            if (this.$refs.youtube && this.$refs.youtube.player && this.$refs.youtube.player.getPlayerState) {
                this.player = this.$refs.youtube.player
            } else {
                this.player = null
            }
            window.player = this.player
        },
        toggleLabel(labelName) {
            // this is a dumb hack that only exists because sometimes the ui-checkbox doens't display the change
            // even though the change has been made
            
            // get the value
            const actualValue = this.$root.labels[labelName]
            // change it to nothing
            this.$root.labels[labelName] = {}
            // almost immediately change it back to something
            setTimeout(() => {
                this.$root.labels[labelName] = actualValue
            }, generalTimeoutFrequency)
        },
        videoSelect() {
            if (this.searchTerm.trim() == this.$root.getVideoId()) {
                this.$toasted.show(`Video is already open`).goAway(2500)
            } else {
                this.$root.selectedVideo = this.$root.getCachedVideoObject(this.searchTerm.trim())
            }
        },
        async attemptToSetupSegments() {
            await logBlock({name: "attemptToSetupSegments"}, async ()=>{
                
                // confirm or wait on a video to exist
                console.debug(`checking hasVideo.promise`)
                await this.hasVideo.promise
                console.debug(`finished hasVideo.promise check`)
                // ensure that all the video segments are here
              
            })
        },
        ready(event) {
            console.log(`video is ready`)
            this.videoManagementData.videoIsReady = true
            this.setThisPlayer()
            this.hasVideoPlayer.resolve(this.player)
            this.videoStateInitilized.check()
            window.player = this.player // for debugging
            this.player.setVolume(0)
            window.dispatchEvent(new CustomEvent("CenterStage: videoIsReady"))
        },
        async videoStartedPlaying() {
            this.$emit("CenterStage: videoStartedPlaying")
        },
        togglePlayPause() {
            if (this.player.getPlayerState() != video.IS_PLAYING && this.player.getPlayerState() != video.BUFFERING) {
                this.player.playVideo()
            } else {
                this.player.pauseVideo()
            }
        },
    }
}
</script>

<style lang='sass'>
        
.main-container
    flex-shrink: 0
    min-height: 44vw
    transition: opacity ease 0.5s
    width: 100%
    min-width: fit-content

    .below-video-search
        width: 100%
        max-width: 100vw
        margin-bottom: 5.5rem
        
        .video-width-sizer
            --max-width: calc(40rem + 30vw)
            width: 100%
            min-width: 18rem
            max-width: var(--max-width)
            height: fit-content
            
            .video-sizer
                position: relative
                // width
                width: inherit
                max-width: inherit
                min-width: inherit
                // height
                --height: 80vh
                height: var(--height)
                max-height: var(--height)
                min-height: 40vh
                max-height: calc(var(--max-width) * 0.55)
    
    .labels 
        margin-bottom: 1rem
        
        .ui-checkbox__checkmark::after
            color: black
            border-bottom: 0.125rem solid black
            border-right: 0.125rem solid black
            
        & > *
            // background: whitesmoke
            padding: 6px 11px
            border-radius: 1rem
            margin-left: 12px
            border: white 1px solid
            color: white
            
        .ui-checkbox--color-primary
            .ui-checkbox__checkmark-background
                border-color: white
            &.is-checked
                .ui-checkbox__checkmark-background
                    border-color: white
                    background-color: white
        
        .ui-checkbox
            margin: 0
    
    
    .segments
        width: 100%
        align-items: flex-start
        text-align: left
        padding: 1rem
        background: white
        border-radius: 1rem
        box-shadow: var(--shadow-1)

        h5
            color: gray
            margin-bottom: 5px
            margin-left: 10px
            font-weight: 100
            
        
        .level
            width: 95%
            align-self: center
            height: 2.2rem
            // border-bottom: #e0e0e0 1px solid
            overflow: hidden
            transition: all ease 0.5s
            .segment
                position: absolute
                min-height: 1.4rem
                background-color: var(--blue)
                padding: 2px
                border-radius: 2px
                transition: all ease 0.5s
                cursor: pointer
                &:hover
                    box-shadow: var(--shadow-1)
                    opacity: 0.9
    .new-moment-wrapper
        .ui-textbox
            width: 85%
        .ui-collapsible__header
            background: transparent !important
            color: gray
            border-radius: 1rem
        .ui-collapsible__body
            border: 1px solid darkgray
            border-radius: 1rem

.json-tree-root
    min-width: 100%
    min-height: 100%
    background: transparent
    
</style>