<template lang="pug">
    //- Segments
    column.segments(v-if="$root.getVideoId()" align-h="left")
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

const generalTimeoutFrequency = 50 // ms 

export default {
    props: [
        "hasVideo",
        "videoStateInitilized",
        "hasDurationData",
        "idOfLastInitilizedVideo",
    ],
    components: {
        JsonTree: require('vue-json-tree').default,
        SideButton: require("../atoms/SideButton").default,
        MomentEditor: require("../organisms/MomentEditor").default,
    },
    data: ()=>({
        segmentsInfo: {
            maxLevel: 1,
            organizedSegments: [],
        },
    }),
    mounted() {
    },
    rootHooks: {
        watch: {
            // when different labels are selected (checkboxes) the segments need to change
            labels(newValue, oldValue) {
                console.debug(`[SegmentDisplay]: rootHooks.watch.labels() triggered`)
                this.updateSegmentsInfo()
            },
            selectedLabel(newValue) {
                console.debug(`[SegmentDisplay]: rootHooks.watch.selectedLabel() triggered`)
                this.updateSegmentsInfo()
            },
            // when the selected video changes
            async selectedVideo(newValue, oldValue) {
                console.debug(`[SegmentDisplay]: rootHooks.watch.selectedVideo() triggered`)
                // reset the data 
                this.updateSegmentsInfo()
                this.$root.selectedSegment = null // no selected segment
                // refill the data as soon as the outside data is avalible
                this.resolveVideoSegmentData.promise.then(this.updateSegmentsInfo).then(this.seekToSegmentStart)
            },
        }
    },
    watch: {},
    resolveables: {
        async resolveVideoSegmentData(resolve, reject) {
            const functionCallId = Math.random().toFixed(6)
            let debug = (message)=>console.debug(`[resolveVideoSegmentData: ${functionCallId}] ${message}`)
            
            const videoId = this.$root.getVideoId()
            if (!videoId) {
                debug("video id doesnt exist, canceling check")
                return
            }
            // check and see if there are segments
            debug("checking if segments exist")
            if (this.$root.selectedVideo.keySegments instanceof Array) {
                debug("i think it exists (resolving resolveVideoSegmentData)")
                resolve(this.$root.selectedVideo.keySegments)
            // if the segments don't exist, try getting them from the backend
            } else {
                debug("it appears segments dont yet exist")
                
                // wait for duration data to exist
                // then get the segments from backend
                debug("getting segments from backend")
                let keySegments = await this.getSegmentDataFromBackend()
                if (videoId != this.$root.getVideoId()) { return debug(`videoId changed canceling check`) }
                
                debug(" getting duration data")
                let duration = await this.hasDurationData.promise
                if (videoId != this.$root.getVideoId()) { return debug(`videoId changed canceling check`) }
                
                // process the segments
                this.$root.selectedVideo.keySegments = this.processNewSegments({ duration, keySegments })
                // now the segment data is avalible
                resolve(this.$root.selectedVideo.keySegments)
            }
        },
    },
    workers: {
    },
    methods: {
        async getSegmentDataFromBackend() {
            let videoId = this.$root.getVideoId()
            let realEndpoints
            let keySegments
            if (videoId) {
                realEndpoints = await endpoints
                keySegments = await realEndpoints.raw.all({
                    from: 'moments',
                    where: [
                        // FIXME: also add the fixedSegments (the computer generated ones)
                        { valueOf: ['type']     , is: "keySegment" },
                        { valueOf: [ 'videoId' ], is: this.$root.getVideoId() },
                    ]
                })
            }
            return keySegments
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
        generateSegmentInfo({namesOfSelectedLabels, keySegments}) {
            // only return segments that match the selected labels
            let displaySegments = keySegments.filter(
                eachSegment=>(eachSegment.$shouldDisplay = namesOfSelectedLabels.includes(eachSegment.$data.label))
            )
        
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
            return {
                maxLevel: levels.length,
                organizedSegments: levels.flat(),
            }
        },
        updateSegmentsInfo() {
            return logBlock({name: "updateSegmentsInfo"}, ()=>{
                
            // if the data doesn't exist
            if (!(this.$root.selectedVideo.keySegments instanceof Array)) {
                // reset the values
                this.segmentsInfo = {
                    organizedSegments: [],
                    maxLevel: 1,
                }
            } else {
                // generate the values
                this.segmentsInfo = this.generateSegmentInfo({
                    namesOfSelectedLabels: this.$root.getNamesOfSelectedLabels(),
                    keySegments: this.$root.selectedVideo.keySegments,
                })
            }
            
            })
        },
        async seekToSegmentStart() {
            console.debug(`[seekToSegmentStart] (starting)`)
            // if no segment is selected
            if (!this.$root.selectedSegment) {
                // the go to the first displayable segment
                console.debug(`[seekToSegmentStart] there is no selected segment`)
                console.debug(`[seekToSegmentStart] calling jumpSegment(0) and returning`)
                return this.jumpSegment(0)
            }
            // make sure the selected segment has a start time
            if (!checkIf({value: this.$root.selectedSegment.start, is: Number })) {
                console.error(`[seekToSegmentStart] this.$root.selectedSegment.start isn't a number`)
                return
            }
            // if video not initilized, then wait for it to be initilized
            if (this.idOfLastInitilizedVideo != this.$root.getVideoId()) {
                console.debug(`[seekToSegmentStart] video isn't initilized, retrying later`)
                return this.videoStateInitilized.promise.then(this.seekToSegmentStart)
            }
            // if all checks pass
            try  {
                console.debug(`[seekToSegmentStart] seeking to ${this.$root.selectedSegment.start}`)
                this.player.seekTo(this.$root.selectedSegment.start)
            // sometimes an error is caused by switching videos, and all thats needed is a restart
            } catch (err) {
                console.debug(`[seekToSegmentStart] seeking to segment start (will retry):`,err)
                return this.seekToSegmentStart()
            }
        },
        jumpSegment(newIndex) {
            const functionCallId = Math.random().toFixed(6)
            let debug = (message, ...args)=>console.debug(`[jumpSegment: ${functionCallId}] ${message}`, ...args)
            
            // basic saftey check
            if (!(this.$root.selectedVideo.keySegments instanceof Array) || this.$root.selectedVideo.keySegments.length == 0) {
                return debug("segments don't exist, returning")
            }
            // get the previous segment or the first one in the list
            let segment = this.$root.selectedSegment || this.$root.selectedVideo.keySegments[0]
            const startingPoint = wrapIndex(newIndex, this.$root.selectedVideo.keySegments)
            let indexOfPreviousSegment = (!segment) ? 0 : segment.$displayIndex
            if (newIndex != indexOfPreviousSegment || !segment.$shouldDisplay) {
                let direction = indexOfPreviousSegment > newIndex ? -1 : 1
                debug(`jump direction is: ${direction}`)
                while (1) {
                    let newSegment = this.$root.selectedVideo.keySegments[ wrapIndex(newIndex, this.$root.selectedVideo.keySegments) ]
                    // if its a displayable segment then good, were done
                    if (newSegment.$shouldDisplay) {
                        segment = newSegment
                        debug("found a displayable segment")
                        break
                    }
                    // cycle the index
                    newIndex += direction
                    // if somehow ended back at the start then fail
                    if (wrapIndex(newIndex, this.$root.selectedVideo.keySegments) == startingPoint) {
                        debug("couldn't find a displayable segment")
                        break
                    }
                }
            }
            if (!segment || !segment.$shouldDisplay) {
                debug(`!segment || !segment.$shouldDisplay is: ${!segment || !segment.$shouldDisplay}`)
                this.$root.selectedSegment = null
            } else {
                this.$root.selectedSegment = segment
            }
            debug(`this.$root.selectedSegment is:`, this.$root.selectedSegment)
            if (this.$root.selectedSegment instanceof Object) {
                debug("seeking to segment start since a new index was found")
                await this.seekToSegmentStart()
            }
        },
        incrementIndex() {
            this.jumpSegment(this.$root.selectedSegment.$displayIndex+1)
        },
        decrementIndex() {
            this.jumpSegment(this.$root.selectedSegment.$displayIndex-1)
        },
        toggleLabel(labelName) {
            // this is a dumb hack that only exists because 
            // sometimes the ui-checkbox doens't display the change
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
    }
}
</script>

<style lang='sass' scoped> 
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

</style>