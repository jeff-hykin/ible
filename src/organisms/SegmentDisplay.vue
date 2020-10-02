<template lang="pug">
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

const generalTimeoutFrequency = 50 // ms 

export default {
    props: [
        "hasVideo"
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
        }
    }),
    mounted() {
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
        async reorganizeSegments() {
            await logBlock({name: "reorganizeSegments"}, async ()=>{
                // if a video hasn't event been selected
                if (this.$root.getVideoId() == null) {
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