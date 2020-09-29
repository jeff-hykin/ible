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
            span(v-if='getVideoId()' style="color: darkgrey;")
                | Current Video ID: {{getVideoId()}}
                br
                | Pause Time: {{currentTime.toFixed()}} ms
            
        //- Video area
        row.video-container(flex-basis="100%" padding-top="1rem" align-v="top")
            column(align-v="top").video-width-sizer
                //- VIDEO
                row.video-sizer
                    //- BACK
                    div.circle-button.left(@click='decrementIndex')
                        span
                            | ←
                    span(v-if='!getVideoId()')
                        | Video Not Selected
                    
                        //- :host="'https://www.youtube.com'"
                    youtube(
                        v-if='getVideoId()'
                        :key="getVideoId()"
                        ref="youtube"
                        :host="this.player ? 'http://www.youtube-nocookie.com/' : 'https://www.youtube.com'"
                        :video-id="getVideoId()"
                        @ready="ready"
                        @playing="videoStartedPlaying"
                        @paused="videoWasPaused"
                        :playerVars="{ /* disablekb: 1, end: 2 */ }"
                        player-width="100%"
                        player-height="100%"
                        style="height: 100%;width: 100%;"
                    )
                    //- NEXT
                    div.circle-button.right(@click='incrementIndex')
                        span
                            | →
                
                //- Segments
                column.segments(align-h="left")
                    h5
                        | Labels
                    row.labels
                        container(v-for="(eachLevel, eachLabelName) in $root.labels" :background-color="$root.labels[eachLabelName].color")
                            ui-checkbox(v-model="$root.labels[eachLabelName].selected" @change="toggleLabel(eachLabelName)")
                                | {{eachLabelName}}
                    h5(v-if="segmentsInfo.organizedSegments.length > 0")
                        | Moments
                    row.level(v-if="segmentsInfo.organizedSegments.length > 0" align-h="space-between" position="relative" :height="`${segmentsInfo.maxLevel*2.2}rem`")
                        row.segment(
                            v-for="(eachSegment, index) in segmentsInfo.organizedSegments"
                            :left="eachSegment.$renderData.leftPercent"
                            :width="eachSegment.$renderData.widthPercent"
                            :top="eachSegment.$renderData.topAmount"
                            :background-color="$root.labels[eachSegment.$data.label].color"
                            :key="eachSegment.listIndex"
                            @click="jumpSegment(eachSegment.$displayIndex)"
                        )
                            ui-tooltip(position="left" animation="fade")
                                | label: {{ eachSegment.$data.label }}
                                br
                                | length: {{  (eachSegment.end - eachSegment.start).toFixed(2) }} sec
                                br
                                | start: {{ eachSegment.start }} sec

        
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
    },
    data: ()=>({
        currentTime: 0,
        searchTerm: null,
        suggestions: [],
        player: null,
        
        videoIsReady: false,
        idOfLastInitilizedVideo: null,
        initCheckAlreadyRunning: false,
        
        segmentsInfo: {
            maxLevel: 1,
            organizedSegments: [],
        }
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
        
        
        // this is to cover a stupid bug in the YouTube API
        // the bug shows infinite loading until the video has been played for a bit
        // instantly pausing and playing fixes it in the console, but from a script it optimizes out the
        // pause-then-play and just stays paused (and continues to show infinite loading)
        // so this needs to play and then immediately pause if the video hasn't been initilized
        videoStateInitilized(resolve, reject) {
            // NOTE: this function has a vital counterpart in the $methods.videoStartedPlaying()
            logBlock({name: "[resolvable:videoStateInitilized]"}, ()=>{
                let realResolve = ()=>{
                    this.initCheckAlreadyRunning = false
                    this.idOfLastInitilizedVideo = this.getVideoId()
                    resolve()
                }
                let realReject = ()=>{
                    this.initCheckAlreadyRunning = false
                    reject()
                }
                if (!this.player) {
                    console.debug(`[resolvable:videoStateInitilized] no player, ending this check`)
                    return
                // make sure two checks don't start running at the same time
                } else if (this.initCheckAlreadyRunning) {
                    console.debug(`[resolvable:videoStateInitilized] check is already running, ending this check`)
                    return
                } else if (this.idOfLastInitilizedVideo && this.idOfLastInitilizedVideo == this.getVideoId()) {
                    console.debug(`[resolvable:videoStateInitilized] video already initilized (resolving): ${this.idOfLastInitilizedVideo}`)
                    realResolve()
                    return
                }
                let videoHasntLoaded = ()=> this.player && (this.player.getPlayerState() == video.IS_LOADING || this.player.getPlayerState() == video.IS_CUED)
                let videoIsPaused = ()=>(this.player ? this.player.getPlayerState() == video.IS_PAUSED : false)
                // if paused, then the video must already be initilized
                if (videoIsPaused()) {
                    console.debug(`[resolvable:videoStateInitilized] video is paused, therefore it must be initilized. Resolving.`)
                    this.idOfLastInitilizedVideo = this.getVideoId()
                    realResolve()
                    return
                }
                if (!videoHasntLoaded()) {
                    console.log(`[resolvable:videoStateInitilized] something strange happened:\n - the video was not in a loading/paused state (probably playing)\n- but the initCheckAlreadyRunning was false\n- and video hadn't initilized\n\nmaybe something else it the code reset the idOfLastInitilizedVideo?\n`)
                    this.player.pauseVideo()
                }
                // prevent doubling up on this part of the code
                this.initCheckAlreadyRunning = true
                  
                const urlOfVideoToPause = this.player.getVideoUrl()
                // try to play the video if it isn't in a playing state
                this.player.playVideo()
                // as soon as the video starts playing, pause it
                this.$once("CenterStage: videoStartedPlaying", async ()=>{
                    const urlOfVideoToPlay = this.player.getVideoUrl()
                    // if video has since changed, then cancel
                    if (urlOfVideoToPause != urlOfVideoToPlay) {
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
            })
        },
        hasVideo(resolve, reject) {
            logBlock({name: "[resolvable:hasVideo]"}, ()=>{
                if (get(this, ["$root", "selectedVideo", "$id"], null)) {
                    console.debug("video exists!")
                    resolve(this.$root.selectedVideo)
                } else {
                    console.debug("nope, video still doesn't exist")
                }
            })
        },
        async hasVideoPlayer(resolve, reject) {
            await logBlock({name: "[resolvable:hasVideoPlayer]"}, async ()=>{
                if (this.videoIsReady) {
                    if (this.player instanceof Object) {
                        console.debug(`player exists, resolving`)
                        resolve(this.player)
                    }
                } else {
                    console.debug(`nope player still doesn't exist`)
                }
            })
        },
        async hasDurationData(resolve, reject) {
            await logBlock({name: "[resolvable:hasDurationData]"}, async ()=>{
                // wait until a video exists
                console.log(`awaiting hasVideo.promise`)
                await this.hasVideo.promise
                console.log(`hasVideo.promise was resolved`)
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
                        let result = await realEndpoints.videos.get({keyList: [ this.getVideoId(), "summary",  "duration" ]})
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
        async videoHasSegmentData(resolve, reject) {
            await logBlock({name: "[resolvable:videoHasSegmentData]"}, async ()=>{
                if (!this.getVideoId()) {
                    console.debug(`[resolvable:videoHasSegmentData] video id doesnt exist, canceling check`,)
                    return
                }
                // check and see if there are segments
                console.debug(`[resolvable:videoHasSegmentData] checking if segments exist`)
                if (this.$root.selectedVideo.keySegments instanceof Array) {
                    console.debug(`[resolvable:videoHasSegmentData] selectedVideo.keySegments is an array, therefore segmentData should exist (resolving videoHasSegmentData)`,)
                    resolve(this.$root.selectedVideo.keySegments)
                // if the segments don't exist, try getting them from the backend
                } else {
                    console.debug(`[resolvable:videoHasSegmentData] it appears segments dont yet exist`)
                    const videoId = this.getVideoId()
                    // wait for duration data to exist
                    console.debug(`[resolvable:videoHasSegmentData] checking hasDurationData.promise`)
                    let duration = await this.hasDurationData.promise
                    console.debug(`[resolvable:videoHasSegmentData] finished hasDurationData.promise check`)
                    console.debug(`[resolvable:videoHasSegmentData] duration is:`,duration)
                    // then get the segments from backend
                    let realEndpoints = await endpoints
                    let keySegments = await realEndpoints.raw.all({
                        from: 'moments',
                        where: [
                            // FIXME: also add the fixedSegments (the computer generated ones)
                            { valueOf: ['type']     , is: "keySegment" },
                            { valueOf: [ 'videoId' ], is: this.getVideoId() },
                        ]
                    })
                    console.debug(`[resolvable:videoHasSegmentData] keySegments retrived from backend`)
                    // process the segments
                    console.debug(`[resolvable:videoHasSegmentData] checking if videoId has changed while awaiting`)
                    if (videoId == this.getVideoId()) {
                        console.debug(`[resolvable:videoHasSegmentData] videoId has not changed`)
                        this.$root.selectedVideo.keySegments = this.processNewSegments({ duration, keySegments })
                        console.debug(`[resolvable:videoHasSegmentData] this.$root.selectedVideo.keySegments is:`,this.$root.selectedVideo.keySegments)
                        // go to the first segment
                        console.debug(`[resolvable:videoHasSegmentData] jumping to first segment`)
                        this.jumpSegment(0)
                        console.debug(`[resolvable:videoHasSegmentData] resolving videoHasSegmentData`)
                        resolve(this.$root.selectedVideo.keySegments)
                    }
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
                this.currentTime = this.player.getCurrentTime()*1000
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
            switch (eventObj.key) {
                case "ArrowDown":
                    eventObj.preventDefault()
                    this.incrementIndex()
                    break
                case "ArrowUp":
                    eventObj.preventDefault()
                    this.decrementIndex()
                    break
                case " ":
                    eventObj.preventDefault()
                    this.togglePlayPause()
                    break
                default:
                    // we dont care about other keys
                    break
            }
        }
    },
    rootHooks: {
        watch: {
            // when different labels are selected (checkboxes)
            labels(newValue, oldValue) {
                console.debug(`EVENT-watch: labels changed`)
                this.reorganizeSegments()
            },
            selectedLabel(newValue) {
                console.debug(`EVENT-watch: selectedLabel changed`)
                this.reorganizeSegments()
            },
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
                    this.initCheckAlreadyRunning = false
                    this.videoIsReady = false
                    this.segmentsInfo = {
                        maxLevel: 1,
                        organizedSegments: []
                    }
                    console.debug(`data was reset\n`)
                    // update data
                    console.debug(`checking for video id`)
                    if (typeof this.getVideoId() == 'string') {
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
                    console.debug("video was initlized")
                    
                    // basically look to reorganize them and jump to the begining of the segment
                    console.debug(`checking videoHasSegmentData.promise`)
                    console.debug(`note: this should call the duration check`)
                    await this.videoHasSegmentData.promise
                    console.debug(`finished videoHasSegmentData.promise check`)                    
                    // then get the segments that are going to be displayed
                    console.debug(`calling reorganizeSegments`)
                    await this.reorganizeSegments()
                    console.debug(`finished calling reorganizeSegments`)
                    console.debug(`this.segmentsInfo.organizedSegments is:`,this.segmentsInfo.organizedSegments)
                    // load / init the first segment
                    console.debug(`calling seekToSegmentStart`)
                    await this.seekToSegmentStart()
                    console.debug(`calling seekToSegmentStart`)
                    console.debug("finished attemptToSetupSegments()")
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
            this.currentTime = this.player.getCurrentTime()*1000
        },
        setThisPlayer() {
            if (this.$refs.youtube && this.$refs.youtube.player && this.$refs.youtube.player.getPlayerState) {
                this.player = this.$refs.youtube.player
            } else {
                this.player = null
            }
            window.player = this.player
        },
        getVideoId() {
            this.$once("")
            return this.$root.selectedVideo && this.$root.selectedVideo.$id
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
            if (this.searchTerm.trim() == this.getVideoId()) {
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
        processNewSegments({duration, keySegments}) {
            let minWidth = duration / 50
            keySegments = keySegments.map(eachSegment=>{
                // 
                // create the .$data on each segment
                // 
                let combinedData = {}
                // basically ignore who said what and just grab the data
                // TODO: this should be changed because it ignores who said what and doesn't do any conflict resolution
                for (const [eachUsername, eachObservation] of Object.entries(eachSegment.observations)) {
                    combinedData = { ...combinedData, ...eachObservation }
                }
                eachSegment.$data = combinedData
                // convert from miliseconds to seconds
                eachSegment.start = eachSegment.start / 1000
                eachSegment.end = eachSegment.end / 1000
                
                // 
                // add render info
                // 
                // create the display info for each segment
                let effectiveStart  = eachSegment.start
                let effectiveEnd    = eachSegment.end
                let segmentDuration = eachSegment.end - eachSegment.start
                // if segment is too small artificially make it bigger
                if (segmentDuration < minWidth) {
                    let additionalAmount = (minWidth - segmentDuration)/2
                    // sometimes this will result in a negative amount, but thats okay
                    // the UI can handle it, the user just needs to be able to see it
                    effectiveStart -= additionalAmount
                    effectiveEnd += additionalAmount
                }
                eachSegment.$renderData = {
                    effectiveEnd,
                    effectiveStart,
                    // how wide the element should be
                    widthPercent: `${(effectiveEnd - effectiveStart)*100/duration}%`,
                    // how close to the left the element should be
                    leftPercent: `${(effectiveStart/duration)*100}%`,
                }
                return eachSegment
            }).sort(dynamicSort(["$renderData","effectiveStart"])).map((each, index)=>((each.$displayIndex = index),each))
            
            return keySegments
        },
        async reorganizeSegments() {
            await logBlock({name: "reorganizeSegments"}, async ()=>{
                // if a video hasn't event been selected
                if (this.getVideoId() == null) {
                    // don't create a pending reorganizeSegments() call, just return
                    console.debug(`ending reorganizeSegments: no currently selected video`)
                    return 
                }
                // confirm or wait on a video to exist
                await this.hasVideo.promise
                // ensure that all the video segments are here
                this.$root.selectedVideo.keySegments = await this.videoHasSegmentData.promise
                
                // only return segments that match the selected labels
                let namesOfSelectedLabels = this.$root.getNamesOfSelectedLabels()
                let displaySegments = this.$root.selectedVideo.keySegments.filter(eachSegment=>(eachSegment.$shouldDisplay = namesOfSelectedLabels.includes(eachSegment.$data.label)))
            
                // 2 percent of the width of the video
                let levels = []
                for (let eachSegment of displaySegments) {
                    // find the smallest viable level
                    let level = 0
                    while (levels[level] != undefined && eachSegment.$renderData.effectiveStart <= levels[level][ levels[level].length-1 ].$renderData.effectiveEnd) {
                        ++level
                    }
                    // create level if it didn't exist
                    if (levels[level] == undefined) {
                        levels[level] = [ eachSegment ]
                    // otherwise add it to the end of the level
                    } else {
                        levels[level].push(eachSegment)
                    }
                    eachSegment.$renderData.level = level 
                    eachSegment.$renderData.topAmount = `${level*2.2}rem`
                }
                this.segmentsInfo = {
                    maxLevel: levels.length,
                    organizedSegments: levels.flat(),
                }
            })
        },
        async seekToSegmentStart() {
            // if no segment is selected
            if (!this.$root.selectedSegment) {
                // the go to the first displayable segment
                console.debug(`[seekToSegmentStart] there is no selected segment`)
                console.debug(`[seekToSegmentStart] calling jumpSegment(0) and returning`)
                return this.jumpSegment(0)
            }
            if (!this.player) {
                console.debug(`[seekToSegmentStart] video isn't ready for seeking, retrying later`)
                return this.hasVideoPlayer.promise.then(()=>this.seekToSegmentStart())
            }
            // if not initilized
            if (this.idOfLastInitilizedVideo != this.getVideoId()) {
                console.debug(`[seekToSegmentStart] video isn't initilized, retrying later`)
                return this.videoStateInitilized.promise.then(()=>this.seekToSegmentStart())
            }
            if (!checkIf({value: this.$root.selectedSegment.start, is: Number })) {
                console.error(`[seekToSegmentStart] this.$root.selectedSegment.start isn't a number`)
                return
            }
            // if all checks pass
            try  {
                console.debug(`seeking to ${this.$root.selectedSegment.start}`)
                this.player.seekTo(this.$root.selectedSegment.start)
            // sometimes an error is caused by switching videos, and all thats needed is a restart
            } catch (err) {
                console.debug(`seeking to segment start (will retry):`,err)
                return this.seekToSegmentStart()
            }
        },
        ready(event) {
            console.log(`video is ready`)
            this.videoIsReady = true
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
        incrementIndex() {
            this.jumpSegment(this.$root.selectedSegment.$displayIndex+1)
        },
        decrementIndex() {
            this.jumpSegment(this.$root.selectedSegment.$displayIndex-1)
        },
        jumpSegment(newIndex) {
            return logBlock({name: "jumpSegment"}, async ()=>{
                // basic saftey check
                if (!(this.$root.selectedVideo.keySegments instanceof Array) || this.$root.selectedVideo.keySegments.length == 0) {
                    console.debug(`[jumpSegment] segments don't exist, returning`)
                    return 
                }
                // get the previous segment or the first one in the list
                let segment = this.$root.selectedSegment || this.$root.selectedVideo.keySegments[0]
                const startingPoint = wrapIndex(newIndex, this.$root.selectedVideo.keySegments)
                let indexOfPreviousSegment = (!segment) ? 0 : segment.$displayIndex
                if (newIndex != indexOfPreviousSegment || !segment.$shouldDisplay) {
                    let direction = indexOfPreviousSegment > newIndex ? -1 : 1
                    console.debug(`jump direction is:`,direction)
                    while (1) {
                        let newSegment = this.$root.selectedVideo.keySegments[ wrapIndex(newIndex, this.$root.selectedVideo.keySegments) ]
                        // if its a displayable segment then good, were done
                        if (newSegment.$shouldDisplay) {
                            segment = newSegment
                            console.debug(`[jumpSegment] found a displayable segment`)
                            break
                        }
                        // cycle the index
                        newIndex += direction
                        // if somehow ended back at the start then fail
                        if (wrapIndex(newIndex, this.$root.selectedVideo.keySegments) == startingPoint) {
                            console.debug(`[jumpSegment] couldn't find a displayable segment`)
                            break
                        }
                    }
                }
                if (!segment || !segment.$shouldDisplay) {
                    console.debug(`!segment || !segment.$shouldDisplay is:`,!segment || !segment.$shouldDisplay)
                    this.$root.selectedSegment = null
                } else {
                    this.$root.selectedSegment = segment
                }
                console.debug(`this.$root.selectedSegment is:`,this.$root.selectedSegment)
                if (this.$root.selectedSegment instanceof Object) {
                    console.debug(`[jumpSegment] seeking to segment start since a new index was found`)
                    await this.seekToSegmentStart()
                }
            })
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

    .video-container
        width: 100%
        max-width: 100vw
        
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
        margin-bottom: 5rem

        h5
            color: gray
            margin-bottom: 5px
            margin-left: 10px
            font-weight: 100
            
        
        .level
            width: 100%
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
                
.circle-button
    background: var(--vue-green)
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