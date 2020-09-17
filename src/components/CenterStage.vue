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
        //- Video area
        row.video-container(flex-basis="100%" padding-top="1rem" align-v="top")
            column(align-v="top").video-width-sizer
                //- VIDEO
                row.video-sizer
                    //- BACK
                    div.circle-button.left(@click='decrementIndex')
                        span
                            | ←
                    youtube(
                        :key="$root.selectedVideo.$id"
                        ref="youtube"
                        v-if='getSegmentStart() != null'
                        :video-id="$root.selectedVideo.$id"
                        host="https://www.youtube-nocookie.com"
                        @ready="ready"
                        @playing="playing"
                        :playerVars="{ start: getSegmentStart(), /* disablekb: 1, end: 2 */ }"
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
                    h5(v-if="organizedSegments.length > 0")
                        | Moments
                    row.level(v-if="organizedSegments.length > 0" align-h="space-between" position="relative" :height="`${maxLevel*2.2}rem`")
                        row.segment(
                            v-for="(eachSegment, index) in organizedSegments"
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

const checkPlayPauseFrequency = 50 // ms 
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
    // 
    // emits:
    // 

// make sure cachedVideoIds exists as an Array
storageObject.cachedVideoIds || (storageObject.cachedVideoIds = [])

export default {
    props: [],
    components: { 
    },
    data: ()=>({
        shouldInstantStop: false,
        videoIsReady: false,
        initCheckAlreadyRunning: false,
        initVideoCalls: [],
        maxLevel: 1,
        organizedSegments: [],
        
        searchTerm: null,
        suggestions: [],
        
        nextVideoActionType: null,
        latestCuedVideoAction: {
            label: "init",
            promise: new Promise((resolve)=>resolve()),
            done: true,
        },
        player: null,
        videoPlayerInitilized: false,
        scheduledToggle: {},
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
                resolve(this.$root.selectedVideo)
            }
        },
        async hasVideoPlayer(resolve, reject) {
            // wait until a video exists
            await this.hasVideo.promise
            if (this.videoIsReady) {
                if (this.player instanceof Object) {
                    resolve(this.player)
                }
            }
        },
        async hasDurationData(resolve, reject) {
            // wait until a video exists
            await this.hasVideo.promise
            // try getting the duration in a few ways
            const possibleDuration1 = get(this, ["video", "summary", "duration"     ], NaN)-0
            const possibleDuration2 = get(this, ["player", "playerInfo", "duration" ], NaN)-0
            if (checkIf({value: possibleDuration1, is: Number })) {
                resolve(possibleDuration1)
            // if the video player exists
            } else if (checkIf({value: possibleDuration2, is: Number }) && possibleDuration2 > 0) {
                this.$root.selectedVideo.duration = possibleDuration2
                resolve(possibleDuration2)
            } else {
                // start two different requests for the same data
                // we don't care which finishes first
                
                // 1. request the data from the backend
                endpoints.then(async (realEndpoints)=>{
                    let video = await this.hasVideo.promise
                    console.log(`getting duration from backend`)
                    let result = await realEndpoints.videos.get({keyList: [ this.$root.selectedVideo.$id, "summary",  "duration" ]})
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
                    // this is a form of recursion, but it won't recurse if the data is already resolved
                    this.hasDurationData.check()
                })
            }
        },
        async videoHasSegmentData(resolve, reject) {
            logBlock({name: "videoHasSegmentData"}, async ()=>{
                // make sure the video exists
                await this.hasVideo.promise
                // check and see if there are segments
                if (this.$root.selectedVideo.keySegments instanceof Array) {
                    resolve(this.$root.selectedVideo.keySegments)
                // if the segments don't exist, try getting them from the backend
                } else {
                    const videoId = this.$root.selectedVideo.$id
                    // wait for duration data to exist
                    let duration = await this.hasDurationData.promise
                    console.debug(`duration is:`,duration)
                    // then get the segments from backend
                    let realEndpoints = await endpoints
                    let keySegments = await realEndpoints.raw.all({
                        from: 'moments',
                        where: [
                            // FIXME: also add the fixedSegments (the computer generated ones)
                            { valueOf: ['type']     , is: "keySegment" },
                            { valueOf: [ 'videoId' ], is: this.$root.selectedVideo.$id },
                        ]
                    })
                    // process the segments
                    this.segments = this.processNewSegments({ duration, keySegments })
                    // go to the first segment
                    this.jumpSegment(0)
                    if (videoId == this.$root.selectedVideo.$id) {
                        this.$root.selectedVideo.keySegments = this.segments
                        resolve(this.$root.selectedVideo.keySegments)
                    }
                }
            })
        }
    },
    mounted() {
        window.centerStage = this
        // add some default suggestions
        this.suggestions = storageObject.cachedVideoIds
    },
    windowListeners: {
        keydown(eventObj) {
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
                this.reorganizeSegments()
            },
            selectedLabel(newValue) {
                this.reorganizeSegments()
            },
            // when the selected video changes
            selectedVideo(newValue, oldValue) {
                // this assignment shouldn't need to be done, but for some reason it doesn't update properly
                this.$root.selectedVideo = newValue
                logBlock({name: "selectedVideo changed [CenterStage:watch]"}, ()=>{
                    // if we know the video exists, go ahead and mark it as resolved
                    if (newValue instanceof Object && newValue.$id) {
                        this.hasVideo.resolve(newValue)
                    }
                    // resets
                    this.segment = null // no selected segment
                    this.initCheckAlreadyRunning = false
                    // make sure the duration is reset (otherwise duration of old video will be used)
                    if (get(this, ["player", "playerInfo", "duration" ], null)) {
                        set(this, ["player", "playerInfo", "duration" ], null)
                    }
                    
                    // basically look to reorganize them and jump to the begining of the segment
                    this.attemptToSetupSegments()
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
                console.log(`setting suggestions`)
                this.suggestions = [...new Set(possibleVideoIds.concat(this.suggestions))]
            }
        }
    },
    computed: {
        // just shortcuts to this.$root
        segments: { get() { return this.$root.selectedVideo.keySegments }, set(newValue) { this.$root.selectedVideo.keySegments = newValue }, },
        segment:  { get() { return this.$root.selectedSegment           }, set(newValue) { this.$root.selectedSegment           = newValue }, },
        video:    { get() { return this.$root.selectedVideo             }, set(newValue) { this.$root.selectedVideo             = newValue }, },
    },
    methods: {
        getSegmentStart() {
            let segment = this.$root.selectedSegment
            console.debug(`segment is:`,segment)
            if (segment && checkIf({value: segment.start, is: Number })) {
                this.player || (this.$refs.youtube && (this.player = this.$refs.youtube.player))
                return segment.start
            }
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
            }, 0)
        },
        videoSelect() {
            this.$root.selectedVideo = this.$root.getCachedVideoObject(this.searchTerm.trim())
            this.videoIsReady = false
        },
        async attemptToSetupSegments() {
            // confirm or wait on a video to exist
            await this.hasVideo.promise
            // ensure that all the video segments are here
            let segments = await this.videoHasSegmentData.promise
            // then get the segments that are going to be displayed
            this.reorganizeSegments()
            // load / init the first segment
            this.seekToSegmentStart()
            
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
            logBlock({name: "reorganizeSegments"}, async ()=>{
                // confirm or wait on a video to exist
                await this.hasVideo.promise
                // ensure that all the video segments are here
                this.segments = await this.videoHasSegmentData.promise
                
                // only return segments that match the selected labels
                let namesOfSelectedLabels = this.$root.getNamesOfSelectedLabels()
                let displaySegments = this.segments.filter(eachSegment=>(eachSegment.$shouldDisplay = namesOfSelectedLabels.includes(eachSegment.$data.label)))
            
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
                this.maxLevel = levels.length
                this.organizedSegments = levels.flat()
            })
        },
        async seekToSegmentStart() {
            // wait for the player to exist
            let player = await this.hasVideoPlayer.promise
            // make sure there is segment data 
            await this.videoHasSegmentData.promise
            
            // if there's at least one segment
            if (this.segments.length > 0) {
                // if no segment is selected then select the first one
                if (!this.segment) {
                    this.segment = this.segments[0]
                }
            }
            // make sure the video is initilized before seeking
            await this.checkInitVideo()
            try  {
                let start = this.getSegmentStart()
                if (start != null) {
                    // after the video is initilized, go to wherever this was supposed to go
                    if (this.player.getCurrentTime() != start) {
                        this.player.seekTo(start)
                    }
                }
            // sometimes the error is caused by 
            } catch (err) {
                console.debug(`seeking to segment start (will retry):`,err)
                return this.seekToSegmentStart()
            }
        },
        ready(event) {
            console.log(`video is ready`)
            this.player = event.target
            this.videoIsReady = true
            this.hasVideoPlayer.resolve(this.player)
            this.player.setVolume(0)
            this.seekToSegmentStart()
            window.player = this.player // for debugging
        },
        async playing() {
            // this is part of the fix for YouTube's bad API
            if (this.shouldInstantStop) {
                // try pausing immediately
                this.player.pauseVideo()
                let url = this.player.getVideoUrl()
                // create a busy-wait loop checking for the pause action to have actually been completed
                while (1) {
                    // busy wait
                    await new Promise(r=>setTimeout(r,0))
                    // make sure the player didn't disconnect, the video hasn't changed, and then check if the video is paused
                    if (!this.player || url != this.player.getVideoUrl() || this.player.getPlayerState() == video.IS_PAUSED ) {
                        this.shouldInstantStop = false
                        break
                    }
                    // if its still not paused, then tell it again that it needs to pause
                    this.player.pauseVideo()
                }
            }
        },
        // this is to cover a stupid bug in the YouTube API
        // the bug shows infinite loading until the video has been played for a bit
        // instantly pausing and playing fixes it in the console, but from a script it optimizes out the
        // pause-then-play and just stays paused
        // so this needs to play and then immediately pause if the video hasn't been initilized
        // but its needs to wait before pausing again
        async checkInitVideo() {
            let url = this.player.getVideoUrl()
            let videoHasntLoaded = ()=>this.player.getPlayerState() == video.IS_LOADING || this.player.getPlayerState() == video.IS_CUED
            
            if (!this.initCheckAlreadyRunning) {
                // make sure two of these don't start running at the same time
                this.initCheckAlreadyRunning = true
                
                // try to play the video if it isn't in a playing state
                if (videoHasntLoaded()) {
                    this.shouldInstantStop = true
                    this.player.playVideo()
                }
                
                // busy wait for the playing state to be resolved
                while (videoHasntLoaded()) {
                    // busy wait
                    await new Promise(r=>setTimeout(r,0))
                    
                    // edge case: if still waiting, but the video changed, cancel this one
                    if (url != this.player.getVideoUrl()) {
                        break
                    }
                }
                
                // since this instance is done, this function can be called/run again
                this.initCheckAlreadyRunning = false
            }
        },
        incrementIndex() {
            this.jumpSegment(this.segment.$displayIndex+1)
        },
        decrementIndex() {
            this.jumpSegment(this.segment.$displayIndex-1)
        },
        jumpSegment(newIndex) {
            // TODO: this is messy, clean it up
            (()=>{
                // basic saftey check
                if (!(this.segments instanceof Array) || this.segments.length == 0) {
                    return 
                }
                const startingPoint = newIndex
                let start = 0
                if (this.segment) {
                    start = this.segment.$displayIndex
                }
                if (newIndex == start) {
                    this.segment = this.segments[newIndex]
                    return
                }
                // if going in the relatively negative direction
                if (start > newIndex) {
                    while (1) {
                        let newSegment = this.segments[ wrapIndex(newIndex, this.segments) ]
                        // if its a displayable segment then good, were done
                        if (newSegment.$shouldDisplay) {
                            this.segment = newSegment
                            return
                        }
                        --newIndex // because this was a jump in the negative direction
                                    // relative to where the old segement was
                        if (wrapIndex(newIndex, this.segments) == wrapIndex(startingPoint, this.segments)) {
                            return
                        }
                    }
                // if going in the positive direction
                } else {
                    while (1) {
                        let newSegment = this.segments[ wrapIndex(newIndex, this.segments) ]
                        // if its a displayable segment then good, were done
                        if (newSegment.$shouldDisplay) {
                            this.segment = newSegment
                            return
                        }
                        ++newIndex // because this was a jump in the not-negative direction
                                // relative to where the old segement was
                        if (wrapIndex(newIndex, this.segments) == wrapIndex(startingPoint, this.segments)) {
                            return
                        }
                    }
                }
            })()
            this.seekToSegmentStart()
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