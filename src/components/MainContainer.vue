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
                        v-if='$root.selectedVideo'
                        :video-id="$root.selectedVideo.$id"
                        :player-vars='{start: (segment && segment.start) || 0}'
                        host="https://www.youtube-nocookie.com"
                        @ready="ready"
                        @playing="playing"
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
                            ui-checkbox(v-model="$root.labels[eachLabelName].selected")
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
                            @click="jumpSegment(eachSegment.listIndex)"
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

const video = {
    IS_LOADING: -1,
    IS_PLAYING: 1,
    IS_PAUSED: 2,
    HASNT_EVEN_INITILIZED: null,
    HASNT_STARTED_STATE: 5,
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
        maxLevel: 1,
        organizedSegments: [],
        
        searchTerm: null,
        suggestions: [],
        
        player: null,
        videoPlayerInitilized: false,
        scheduledToggle: {},
    }),
    resolvables: {
        // these are used for loading data in a very dynamic way,
        // such as loading from two seperate sources and allowing for either of them
        // to complete the request for missing data
        // this allows any part of the component to say
        // "okay I found/calculated that data that another function(s) depended on"
        // the alternative to this method is often busywaiting or complex callbacks
        // 
        // 
        // can use:
        //     [resolvable].promise
        //     [resolvable].resolve()
        //     [resolvable].reject()
        //     [resolvable].done
        //     [resolvable].check()
        
        hasVideo(resolve, reject) {
            if (get(this, ["$root", "selectedVideo", "$id"], null)) {
                resolve(this.video)
            }
        },
        async hasVideoPlayer(resolve, reject) {
            // wait until a video exists
            await this.hasVideo.promise
            if (this.player instanceof Object) {
                resolve(this.player)
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
                resolve(possibleDuration2)
            } else {
                // start two different requests for the same data
                // we don't care which finishes first
                
                // 1. request the data from the backend
                endpoints.then(async (realEndpoints)=>{
                    let video = await this.hasVideo.promise
                    let result = await realEndpoints.videos.get({keyList: [ this.video.$id, "summary",  "duration" ]})
                    if (checkIf({value: result, is: Number}) && result > 0) {
                        this.video.duration = result
                        resolve(this.video.duration)
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
            // make sure the video exists
            await this.hasVideo.promise
            // check and see if there are segments
            if (this.video.keySegments instanceof Array) {
                resolve(this.video.keySegments)
            // if the segments don't exist, try getting them from the backend
            } else {
                // wait for duration data to exist
                let duration = await this.hasDurationData.promise
                // then get the segments from backend
                let realEndpoints = await endpoints
                let keySegments = await realEndpoints.raw.all({
                    from: 'moments',
                    where: [
                        // FIXME: also add the fixedSegments (the computer generated ones)
                        { valueOf: ['type']     , is: "keySegment" },
                        { valueOf: [ 'videoId' ], is: this.video.$id },
                    ]
                })
                // process the segments
                this.video.keySegments = this.processNewSegments({ duration, keySegments })
                resolve(this.video.keySegments)
            }
        }
    },
    mounted() {
        // add some default suggestions
        this.suggestions = storageObject.cachedVideoIds
    },
    windowListeners: {
        keydown(eventObj) {
            // 
            // key controls
            // 
            switch (eventObj.key) {
                case "ArrowRight":
                    eventObj.preventDefault()
                    this.incrementIndex()
                    break
                case "ArrowLeft":
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
            // when different labels are selected
            labels(newValue) {
                this.reorganizeSegments()
            },
            // when the selected video changes
            selectedVideo(newValue, oldValue) {
                logBlock({name: "selectedVideo changed [MainContainer:watch]"}, ()=>{
                    // if we know the video exists, go ahead and mark it as resolved
                    if (newValue instanceof Object && newValue.$id) {
                        console.log(`this.hasVideo.resolve() called`)
                        this.hasVideo.resolve(newValue)
                    }
                    // resets
                    this.segment = null // no selected segment
                    // make sure the duration is reset (otherwise duration of old video will be used)
                    if (get(this, ["player", "playerInfo", "duration" ], null)) {
                        set(this, ["player", "playerInfo", "duration" ], null)
                    }
                    
                    // basically look to reorganize them and jump to the begining of the segment
                    this.attemptToSetupSegments()
                })
            },
            selectedSegment(newValue) {
                this.seekToSegmentStart()
                this.reorganizeSegments()
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
        async attemptToSetupSegments() {
            // confirm or wait on a video to exist
            await this.hasVideo.promise
            // ensure that all the video segments are here
            await this.videoHasSegmentData.promise
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
                await this.videoHasSegmentData.promise
                
                // only return segments that match the selected labels
                let namesOfSelectedLabels = this.$root.getNamesOfSelectedLabels()
                console.log(`hi`)
                let displaySegments = this.segments.filter(eachSegment=>(eachSegment.$shouldDisplay = namesOfSelectedLabels.includes(eachSegment.$data.label)))
                console.log(`hi2`)
            
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
            if (this.segment instanceof Object && this.segment.start) {
                player.seekTo(this.segment.start)
            }
        },
        ready(event) {
            console.log(`video is ready`)
            this.player = event.target
            this.hasVideoPlayer.resolve(this.player)
            this.player.setVolume(0)
            window.player = this.player // for debugging
        },
        videoSelect() {
            this.$root.selectedVideo = this.$root.getCachedVideoObject(this.searchTerm.trim())
        },
        playing() {
            console.log(`video is playing`)
            this.player.playerInfo.playerState = video.IS_PLAYING
        },
        waitThenPause(seekBackToStart=null) {
            // if already playing
            if (this.player && this.player.getPlayerState() == 1) {
                // then pause
                this.player.pauseVideo()
                this.videoPlayerInitilized = true
                // resolve the promise
                this.playerPromiseResolver(this.player)
                // if there is a seek back time, go there
                if (seekBackToStart) {
                    this.player.seekTo(this.segment.start)
                }
            } else {
                setTimeout(() => {
                    // init the video by pressing play
                    if (!this.videoPlayerInitilized) {
                        this.player.playVideo()
                    }
                    this.waitThenPause(seekBackToStart)
                }, 0)
            }
        },
        isPlaying() {
            return this.player.getPlayerState() == 1
        },
        incrementIndex() {
            this.jumpSegment(this.$root.selectedSegment.$displayIndex+1)
        },
        decrementIndex() {
            this.jumpSegment(this.$root.selectedSegment.$displayIndex-1)
        },
        jumpSegment(newIndex) {
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
        },
        pauseVideo() {
            // TODO: check me
            
            // cancel scheduled play
            if (this.scheduledToggle.type == "play") {
                clearTimeout(this.scheduledToggle.id)
            }
            // reset the schedule
            this.scheduledToggle = {}
            
            if (!this.player) {
                return
            }
            
            this.player.pauseVideo()
            // if video is playing
            if (this.player.playerInfo.playerState == video.IS_PLAYING) {
                // schedule another pause for good measure
                this.scheduledToggle.type = "pause"
                this.scheduledToggle.id = setTimeout(()=>this.pauseVideo(), 50)
            }
        },
        async playVideo() {
            // TODO: check me
            
            // cancel scheduled pause
            if (this.scheduledToggle.type == "pause") {
                clearTimeout(this.scheduledToggle.id)
            }
            // reset the schedule
            this.scheduledToggle = {}
            
            if (!this.player) {
                reject("failed to play because player doesn't exist")
            }
            // try to play
            this.player.playVideo()
            
            // if video isn't playing
            if (this.player.playerInfo.playerState != video.IS_PLAYING) {
                // schedule another play for good measure
                this.scheduledToggle.type = "play"
                this.scheduledToggle.id = setTimeout(()=>this.playVideo(), 50)
            }
        },
        videoIsPaused() {
            // TODO: check me
            
            if (this.scheduledToggle.type == "play") {
                return false
            }
            if (this.player == null || this.scheduledToggle.type == "pause") {
                return true
            }
            switch (this.player.playerInfo.playerState) {
                case video.IS_PLAYING:
                    return false
                case video.HASNT_EVEN_INITILIZED:
                case video.HASNT_STARTED_STATE:
                case video.IS_LOADING: // this might not always be true, but I'm not sure
                case video.IS_PAUSED:
                    return true
            }
        },
        togglePlayPause() {
            if (this.videoIsPaused()) {
                this.playVideo()
            } else {
                this.pauseVideo()
            }
        }
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
    background: var(--red)
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