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
                    h5
                        | Moments
                    row.level(v-for="(eachLevel, index) in organizedSegments" align-h="space-between" position="relative")
                        row.segment(
                            v-for="(eachSegment, index) in eachLevel"
                            :left="eachSegment.leftPercent"
                            :width="eachSegment.widthPercent"
                            :background-color="$root.labels[eachSegment.data.label].color"
                            @click="jumpSegment(eachSegment.index)"
                        )
                            ui-tooltip(position="left" animation="fade")
                                | label: {{ eachSegment.data.label }}
                                br
                                | length: {{  (eachSegment.end - eachSegment.start).toFixed(2) }} sec
                                br
                                | start: {{ eachSegment.start }} sec

        
</template>

<script>
const { endpoints } = require("../iilvd-api")
const { wrapIndex, storageObject } = require('../utils')
const { dynamicSort, logBlock, checkIf } = require("good-js")
const Fuse = require("fuse.js").default

const video = {
    IS_LOADING: -1,
    IS_PLAYING: 1,
    IS_PAUSED: 2,
    HASNT_EVEN_INITILIZED: null,
    HASNT_STARTED_STATE: 5,
}
let renderData = Symbol.for("renderData")
// 
// summary
//
    // set:
    //     this.$root.labels[].selected
    //     this.$root.selectedVideo
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
        organizedSegments: [],
        
        searchTerm: null,
        suggestions: [],
        
        player: null,
        videoPlayerInitilized: false,
        playerPromise: null,
        playerPromiseResolver: ()=>{},
        scheduledToggle: {},
    }),
    resolvables: {
        // hasVideoPlayer(resolve, reject) {
        //     if (this.player instanceof Object) {
        //         resolve(this.player)
        //     }
        // }
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
            labels(newValue) {
                this.organizeSegments()
            },
            // when the selected video changes
            selectedVideo(newValue) {
                logBlock({name: "MainContainer watch:selectedVideo"}, ()=>{
                    // it hasn't been initilized
                    this.videoPlayerInitilized = false
                    this.playerPromise = new Promise(async (resolve)=>{
                        // create a wrapper around the resolve so it can be checked
                        let resolver
                        resolver = ()=> {
                            resolver.resolved = true
                            return resolve()
                        }
                        resolver.resolved = false
                        this.playerPromiseResolver = resolver
                        
                        // start playing the video
                        this.playVideo()
                    })
                    // if video doesn't exist, then stop short
                    if (!this.doesVideoExist()) {
                        this.player = null
                        return
                    }
                    // if changing videos
                    // manually wipe the info (otherwise old video info will still be there)
                    if (this.player) {
                        this.player.playerInfo.duration = null
                        console.debug(`this.player.getDuration() is:`,this.player.getDuration())
                    }
                    this.ensureVideoHasSegments()
                    // the duration changed so the segments need to be recalculated
                    this.organizeSegments()
                    // load / init the video
                    this.seekToSegmentStart()
                })
            },
            selectedSegment(newValue) {
                this.seekToSegmentStart()
                this.organizeSegments()
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
        doesVideoExist() {
            return this.video instanceof Object && checkIf({ value: this.video.$id, is: String })
        },
        async ensureVideoHasSegments() {
            if (this.doesVideoExist()) {
                // if they already exist do nothing
                if (this.segments instanceof Array) {
                    return true
                // retrive them from the backend
                } else {
                    let realEndpoints = await endpoints
                    let keySegments = await realEndpoints.raw.all({
                        from: 'moments',
                        where: [
                            // FIXME: also add the fixedSegments (the computer generated ones)
                            { keyList: ['type']     , is: "keySegment" },
                            { keyList: [ 'videoId' ], is: this.video.$id },
                        ]
                    })
                    if (!this.video.duration) {
                        this.video.duration = await realEndpoints.videos.get({keyList: [ this.video.$id, "duration" ]})
                    }
                    let minWidth = duration / 50
                    this.video.keySegments = keySegments.map(eachSegment=>{
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
                        eachSegment[renderData] = {
                            effectiveEnd,
                            effectiveStart,
                            // how wide the element should be
                            widthPercent: `${(effectiveEnd - effectiveStart)*100/duration}%`,
                            // how close to the left the element should be
                            leftPercent: `${(effectiveStart/duration)*100}%`,
                        }
                        return eachSegment
                    })
                    
                    return false
                }
            }
        },
        videoSelect() {
            this.$root.selectedVideo = this.$root.getCachedVideoObject(this.searchTerm.trim())
        },
        segmentsToDisplay() {
            let namesOfSelectedLabels = this.getNamesOfSelectedLabels()
            // only return segments that match the selected labels
            return this.segments.filter(eachSegment=>namesOfSelectedLabels.includes(eachSegment.$data.label))
        },
        async organizeSegments() {
            logBlock({name: "organizeSegments"}, async ()=>{
                // wait until player is initilized
                if (!this.videoPlayerInitilized) {
                    if (this.$root.selectedVideo) {
                        // wait one sec before retrying
                        return setTimeout(() => this.organizeSegments(), 1000)
                    } else {
                        return
                    }
                }
                await this.ensureVideoHasSegments()
                // let segmentsToDisplay = this.segmentsToDisplay()
                // for (let each of segmentsToDisplay) {
                    
                // }
                let videoSegments = []
                // 2 percent of the width of the video
                if (this.$root.selectedVideo.$id) {
                    let duration = this.player.getDuration()
                    console.debug(`duration is:`,duration)
                    let minWidth = duration / 50
                    videoSegments = segments.map((each, index)=>{
                        let effectiveStart  = each.start
                        let effectiveEnd    = each.end
                        let segmentDuration = each.end - each.start
                        // if segment is too small artificially make it bigger
                        if (segmentDuration < minWidth) {
                            let additionalAmount = (minWidth - segmentDuration)/2
                            // sometimes this will result in a negative amount, but thats okay
                            // the UI can handle it, the user just needs to be able to see it
                            effectiveStart -= additionalAmount
                            effectiveEnd += additionalAmount
                        }
                        return {
                            ...each,
                            index,
                            effectiveEnd,
                            effectiveStart,
                            // how wide the element should be
                            widthPercent: `${(effectiveEnd - effectiveStart)*100/duration}%`,
                            // how close to the left the element should be
                            leftPercent: `${(effectiveStart/duration)*100}%`,
                        }
                    }).filter(each=>each.videoId == this.$root.selectedVideo.$id)
                }
                let levels = []
                for (let eachSegment of videoSegments.sort(dynamicSort("effectiveStart"))) {
                    // find the smallest viable level
                    let level = 0
                    while (levels[level] != undefined && eachSegment.effectiveStart <= levels[level][ levels[level].length-1 ].effectiveEnd) {
                        ++level
                    }
                    // create level if it didn't exist
                    if (levels[level] == undefined) {
                        levels[level] = [ eachSegment ]
                    // otherwise add it to the end of the level
                    } else {
                        levels[level].push(eachSegment)
                    }
                }
                this.organizedSegments = levels
            })
        },
        ready(event) {
            console.log(`video is ready`)
            this.player = event.target
            this.player.setVolume(0)
            window.player = this.player // for debugging
            this.organizeSegments()
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
            this.$root.selectedSegment = wrapIndex(++this.$root.selectedSegment, this.segments)
        },
        decrementIndex() {
            this.$root.selectedSegment = wrapIndex(--this.$root.selectedSegment, this.segments)
        },
        jumpSegment(index) {
            this.$root.selectedSegment = wrapIndex(index, this.segments)
        },
        notYetImplemented() {
            this.$toasted.show(`Sadly this doesn't do anything yet`).goAway(2500)
        },
        seekToSegmentStart() {
            // if the player doesn't exist, reschedule the seek action
            if (!this.player) {
                return setTimeout(()=>this.seekToSegmentStart(), 0)
            }
            this.player.seekTo(this.segment.start)
            
            // in this state the player (after seeking) will start playing
            // which isn't the best UX, so pause it immediately
            let state = this.player.playerInfo.playerState
            if (state == video.HASNT_STARTED_STATE || (state == video.IS_PAUSED && !this.videoPlayerInitilized)) {
                let seekBackToStart = true
                // give it enough time to load the frame (otherwise it loads infinitely)
                this.player.playVideo()
                // tell the pause exactly where to jump back to after pausing
                this.waitThenPause(seekBackToStart)
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
            return new Promise((resolve, reject)=>{
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
            })
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
            border-bottom: #e0e0e0 1px solid
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
                // border: 2px white solid
                
                // border-top-left-radius: 1rem
                // border-top-right-radius: 1rem
                // border-bottom-left-radius: 1rem
                // border-bottom-right-radius: 1rem
                // border-bottom: 4px var(--red) solid
                // border-left: 4px var(--red) solid
                // border-right: 4px var(--red) solid
                    
                // background-color: var(--blue)
                // min-height: 1rem
                // position: absolute
                // border: 1px solid white
                // border-radius: 4px

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