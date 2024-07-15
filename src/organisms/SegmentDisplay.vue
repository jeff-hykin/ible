<template lang="pug">
    //- Segments
    column.segments(align-h="left")
        transition(name="fade")
            h5
                | Observations
        transition(name="fade")
            row.segment-container(align-h="space-between" position="relative" :height="`${segmentsInfo.maxLevel*2.2}rem`" :min-height="segmentsInfo.organizedSegments.length <= 0 ? '13rem' : 0")
                column(
                    v-if="segmentsInfo.organizedSegments.length <= 0"
                    font-size="14pt"
                    font-weight="lighter"
                    color="gray"
                    position="absolute"
                    min-height="12rem"
                    width="100%"
                    align-h="center"
                    text-align="center"
                    padding="0.7rem"
                )
                    | No observations with given filters
                    span(style="display: block; height: 1rem;")
                    span(style="display: block; height: 1rem;")
                    span(style="margin-bottom: -1rem;")
                        | (<u>press N</u> to create an observation at the current time)
                    span(style="display: block; height: 1rem;")
                    span(style="margin-bottom: -1rem;")
                        | (<u>press M</u> to set the endTime)
                    span(style="display: block; height: 1rem;")
                    span(style="margin-bottom: -1rem;")
                        | (<u>press alt+S</u> to save the observation)
                    span(style="display: block; height: 1rem;")
                    span(style="display: block; height: 1rem;")
                    span(style="display: block; height: 1rem;")
                    span(style="margin-bottom: -1rem;")
                        | (<u>press C</u> to confirm an observation)
                    span(style="display: block; height: 1rem;")
                    span(style="margin-bottom: -1rem;")
                        | (<u>press X</u> to reject an observation)
                    span(style="display: block; height: 1rem;")
                row.segment(
                    v-if="segmentsInfo.organizedSegments.length > 0"
                    v-for="(eachSegment, index) in segmentsInfo.organizedSegments"
                    :left="eachSegment.$renderData.leftPercent"
                    :width="eachSegment.$renderData.widthPercent"
                    :top="eachSegment.$renderData.topAmount"
                    :isHuman="eachSegment.isHuman"
                    :confirmedBySomeone="eachSegment.confirmedBySomeone"
                    :rejectedBySomeone="eachSegment.rejectedBySomeone"
                    :selected="eachSegment.observationId == ($root.selectedSegment&&$root.selectedSegment.observationId)"
                    :background-color="theColor(eachSegment)"
                    :border-color="theColor(eachSegment)"
                    :key="eachSegment.observationId||eachSegment.observationId"
                    :style="`--color: ${theColor(eachSegment)}`"
                    @click="jumpSegment(eachSegment.$displayIndex)"
                )
                    | {{computeSymbol(eachSegment.confirmedBySomeone, eachSegment.rejectedBySomeone)}}
                    ui-tooltip(position="left" animation="fade")
                        column(align-h="left")
                            span
                                | label: {{ eachSegment.label }}
                            span
                                | length: {{  (eachSegment.endTime - eachSegment.startTime).toFixed(2) }} sec
                            span
                                | start: {{ eachSegment.startTime.toFixed(3) }} sec
                            span
                                | human?: {{ eachSegment.isHuman }}
        row(position="relative" align-h="left" align-v="top" width="100%")
            h5
                | Filter Observations by Label
            ui-button.outline-button(@click="toggleAllLabels" style="position: absolute; right: 1.5rem; top: -0.3rem; --button-color: darkgray")
                | Toggle All
        container.labels
            container.label-toggle(
                v-if="eachLabelName != '(no segments)'"
                v-for="(eachLevel, eachLabelName) in $root.labels"
                :style="`--label-color: ${$root.labels[eachLabelName].selected ? $root.labels[eachLabelName].color : 'gray'};`"
            )
                ui-checkbox(v-model="$root.labels[eachLabelName].selected" @change="toggleLabel(eachLabelName)" style="align-items: flex-start;white-space: nowrap;")
                    | {{eachLabelName}}

</template>
<script>
import { wrapIndex, checkIf, deferredPromise, dynamicSort } from "../tooling/utils.js"
import { frontendDb } from '../tooling/database.js'
import { Event, trigger, everyTime, once, globalEvents } from "../tooling/events.js"
import * as basics from "../tooling/basics.bundle.js"
const { get, set } = basics

const generalTimeoutFrequency = 50 // ms

// triggers:
// listens to:
//     globalEvents.observationStorageUpdatedEntries
//     globalEvents.observationStorageDeletedEntries
//     globalEvents.addedLabel

let untracked = {
    lastSeekFinished: deferredPromise(),
    singleActionAfterVideoLoaded: {},
    caller: null,
}
export default {
    props: [
        "currentTime",
    ],
    components: {
        SideButton: require("../atoms/SideButton").default,
    },
    data: ()=>({
        allLabelsOn: false,
        segmentsInfo: {
            maxLevel: 1,
            organizedSegments: [],
        },
        processedKeySegments: [],
    }),
    mounted() {
        window.SegmentDisplay = this
        this.$root.videoInterface.wheneverVideoIsLoaded(this.resetSelectedSegment)
        this.$root.videoInterface.onceVideoIsLoaded(()=>{untracked.caller = "initalLoad"; this.updateSegments()})
        
        const name = "SegmentDisplay"
        everyTime(globalEvents.observationStorageUpdatedEntries).then((who, updatedObservationEntries)=>{
            console.log(`${name} saw [observationStorageUpdatedEntries] from ${who}`)
            const updatedObservationEntriesIds = updatedObservationEntries.map(each=>each.observationId)
            console.debug(`updatedObservationEntries is:`,updatedObservationEntries)
            // this should cause the segment display to update
            this.$root.videoInterface.keySegments = [
                ...this.$root.videoInterface.keySegments.filter(each=>!updatedObservationEntriesIds.includes(each.observationId)),
                ...updatedObservationEntries,
            ]
            this.updateSegments()
        })
        everyTime(globalEvents.observationStorageDeletedEntries).then((who, deletedObservationIds)=>{
            console.log(`${name} saw [observationStorageDeletedEntries] from ${who}`)
            // this should cause the segment display to update
            this.$root.videoInterface.keySegments = [
                ...this.$root.videoInterface.keySegments.filter(each=>!deletedObservationIds.includes(each.observationId)),
            ]
            this.updateSegments()
        })
        everyTime(globalEvents.addedLabel).then((who)=>{
            console.log(`${name} saw [addedLabel] from ${who}`)
            this.updateSegments()
        })
    },
    watch: {
    },
    rootHooks: {
        watch: {
            labels() {
                console.log(`[SegmentDisplay] labels changed`)
                // make sure the label is still valid
                let label = this.$root?.selectedSegment?.label
                if (label) {
                    // if no longer selected
                    if (!((this.$root?.labels||{})[label]?.selected)) {
                        // reset the selected segment
                        this.$root.selectedSegment = null
                    }
                }
                if (this.$root.videoInterface?.player?.duration) {
                    console.log(`[SegmentDisplay] labels changed, updating segments`)
                    untracked.caller = "labels"
                    this.updateSegments()
                }
            },
            "videoInterface.keySegments": function() {
                this.$root.videoInterface.onceVideoIsLoaded(()=>{untracked.caller = "videoInterface.keySegments"; this.updateSegments()})
            },
        }
    },
    windowListeners: {
        keydown(eventObject) {
            if (["DIV", "BUTTON", "BODY"].includes(eventObject.target.tagName) || (eventObject?.path||[]).includes(this.$el) || `${eventObject.target.id}`.startsWith("plyr-")) {
                // 
                // key controls
                // 
                switch (eventObject.key) {
                    case "ArrowRight":
                        if (eventObject.ctrlKey) {
                            console.log(`going to next clip`)
                            eventObject.preventDefault()
                            this.selectNextSegment()
                        }
                        break
                    case "ArrowLeft":
                        if (eventObject.ctrlKey) {
                            console.log(`going to previous clip`)
                            eventObject.preventDefault()
                            this.selectPreviousSegment()
                        }
                        break
                    // case "ArrowUp":
                    //     if (eventObject.ctrlKey) {
                    //         eventObject.preventDefault()
                    //         // TODO: go to previous video in video list
                    //     }
                    //     break
                    // case "ArrowDown":
                    //     if (eventObject.ctrlKey) {
                    //         eventObject.preventDefault()
                    //         // TODO: go to next video in video list
                    //     }
                    //     break
                }
            }
        }
    },
    methods: {
        resetSelectedSegment() {
            this.$root.selectedSegment = null
        },
        theColor(eachSegment) {
            return this.$root.labels[eachSegment.label]?.color
        },
        updateSegments() {
            if (!this.$root.videoInterface?.player?.duration) {
                console.warn(`[SegmentDisplay] updateSegments was called too early. This shouldn't happen so check where it is being called from`)
                console.debug(`[SegmentDisplay] updateSegments caller is:`,untracked.caller)
                return
            }
            this.processedKeySegments = this.processNewSegments({
                duration: this.$root.videoInterface?.player?.duration,
                keySegments: this.$root.videoInterface.keySegments,
            })
            this.segmentsInfo = this.organizeVisualSegments({
                namesOfSelectedLabels: this.$root.getNamesOfSelectedLabels(),
                processedKeySegments: this.processedKeySegments,
            })
            // ^output looks like: this.segmentsInfo = {
            //     maxLevel: 1,
            //     organizedSegments: []
            // }
        },
        processNewSegments({duration, keySegments}) {
            if (!duration) {
                console.warn(`[processNewSegments] processNewSegments was called with no duration (find where its being called from to fix)`)
                return keySegments
            }
            // element needs to be shown as at least __ % of the video width
            const minWidthPercent = 3
            let minWidthInSeconds = duration / (100 / minWidthPercent)
            keySegments = keySegments.map(eachSegment=>{
                // 
                // add render info
                // 
                // create the display info for each segment
                let effectiveStart  = eachSegment.startTime
                let effectiveEnd    = eachSegment.endTime
                let segmentDuration = eachSegment.endTime - eachSegment.startTime
                // if segment is too small artificially make it bigger
                if (segmentDuration < minWidthInSeconds) {
                    let additionalAmountForEachSide = (minWidthInSeconds - segmentDuration)/2
                    // sometimes this will result in a negative amount, but thats okay
                    // the UI can handle it, the user just needs to be able to see it
                    effectiveStart -= additionalAmountForEachSide
                    effectiveEnd += additionalAmountForEachSide
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
        organizeVisualSegments({ processedKeySegments, namesOfSelectedLabels }) {
            // only return segments that match the selected labels
            let displaySegments = (processedKeySegments||[]).filter(
                eachSegment=>(eachSegment.$shouldDisplay = namesOfSelectedLabels.includes(eachSegment.label) || namesOfSelectedLabels.length == 0)
            )
        
            // 2 percent of the width of the video
            let levels = []
            for (let eachSegment of displaySegments) {
                // find the smallest viable level
                let level = 0
                while (1) {
                    let thisLevel = levels[level]
                    if (thisLevel == undefined) {
                        break
                    }
                    let indexOfLastElementOnThisLevel = levels[level].length-1
                    let lastElementOnThisLevel = levels[level][indexOfLastElementOnThisLevel]
                    if (eachSegment.$renderData.effectiveStart > lastElementOnThisLevel.$renderData.effectiveEnd) {
                        break
                    }
                    ++level
                }
                // create level if it didn't exist
                if (levels[level] == undefined) {
                    levels[level] = [ eachSegment ]
                // otherwise add it to the end of the level
                } else {
                    levels[level].push(eachSegment)
                }
                const heightOfSegment = 2.2 // rem
                eachSegment.$renderData.level = level 
                eachSegment.$renderData.topAmount = `${level*heightOfSegment}rem`
            }
            return {
                maxLevel: levels.length,
                organizedSegments: levels.flat(),
            }
        },
        computeSymbol(confirmed, rejected) {
            if (confirmed === true && rejected !== true) {
                return "✓"
            } else if (confirmed !== true && rejected === true) {
                return "✘"
            } else {
                return ""
            }
        },
        toggleAllLabels() {
            // toggle
            this.allLabelsOn = !this.allLabelsOn
            // assign
            for (let [eachKey, eachValue] of Object.entries(this.$root.labels)) {
                if (eachKey != this.$root?.routeData$?.labelName) {
                    eachValue.selected = this.allLabelsOn
                } else {
                    eachValue.selected = true
                }
            }
        },
        async seekToSegmentStart() {
            // if no segment is selected
            if (!this.$root.selectedSegment) {
                // the go to the first displayable segment
                // console.debug(`[seekToSegmentStart] there is no selected segment`)
                // console.debug(`[seekToSegmentStart] calling jumpSegment(0) and returning`)
                return this.jumpSegment(0)
            }
            // make sure the selected segment has a start time
            if (!checkIf({value: this.$root.selectedSegment.startTime, is: Number })) {
                console.error(`[seekToSegmentStart] this.$root.selectedSegment.startTime isn't a number: ${JSON.stringify(this.$root.selectedSegment.startTime)}`)
                return
            }
            
            const videoId = this.$root.videoInterface.videoId
            if (videoId == null) {
                return
            }
            
            // 
            // set what should happen (latest action overwrites previous)
            // 
            
            const seekAction = (player)=>{
                try  {
                    const startTime = this.$root.selectedSegment.startTime
                    // console.debug(`[seekToSegmentStart] seeking to ${startTime}`)
                    player.currentTime = startTime
                    // there is a render issue and this is a hack to fix it
                    try {
                        const targetProportion = (startTime/player.duration)*100
                        document.querySelector(".plyr__progress").children[0].setAttribute("value",targetProportion)
                        document.querySelector(".plyr__progress").children[0].value = targetProportion
                        const minutes = Math.trunc(startTime/60)
                        const seconds = `${Math.trunc(startTime-minutes*60)}`.padStart(2,'0')
                        document.querySelector(".plyr__controls__item.plyr__time--current.plyr__time").innerText = `${minutes}:${seconds}`
                    } catch (error) {
                        
                    }
                // sometimes an error is caused by switching videos, and all thats needed is a restart
                } catch (err) {
                    // console.debug(`[seekToSegmentStart] seeking to segment start (will retry):`,err)
                    return this.seekToSegmentStart()
                }
            }
            
            // if the video is already loaded then just do the thing
            if (this.$root.videoInterface.player) {
                seekAction(this.$root.videoInterface.player)
            // otherwise schedule the action
            } else {
                // check if anything scheduled
                let actionAlreadyScheduled = untracked.singleActionAfterVideoLoaded[videoId]
                untracked.singleActionAfterVideoLoaded[videoId] = seekAction
                // if nothing is scheduled, then schedule something
                if (!actionAlreadyScheduled) {
                    this.$root.videoInterface.onceVideoIsLoaded(
                        async (player)=>{
                            try {
                                const videoIdChanged = videoId != this.$root.videoInterface.videoId
                                if (!videoIdChanged) {
                                    try {
                                        await untracked.singleActionAfterVideoLoaded[videoId](player)
                                    } catch (error) {
                                        console.error(error.stack)
                                        console.error(`[seekToSegmentStart] error with untracked.singleActionAfterVideoLoaded[videoId]():`)
                                        console.error(error)
                                    }
                                }
                                untracked.singleActionAfterVideoLoaded[videoId] = null
                            } catch (error) {
                                console.error(error.stack)
                                console.error(`[seekToSegmentStart] error with untracked.singleActionAfterVideoLoaded[videoId]():`)
                                console.error(error)
                            }
                            // then resolve after the singular action is done
                            untracked.lastSeekFinished.resolve()
                        }
                    )
                }
                
                // this promise is already scheduled to be fullfilled
                return untracked.lastSeekFinished
            }
        },
        closestSegment({time, forward=true}) {
            if (this.segmentsInfo.organizedSegments.length == 0) {
                return null
            } else {
                let segment = null
                if (forward) {
                    let runningIndex = -1
                    for (const each of this.segmentsInfo.organizedSegments) {
                        if (each.startTime > time) {
                            segment = each
                            break
                        }
                    }
                } else {
                    const segmentsBackwards = [...this.segmentsInfo.organizedSegments]
                    // first one is largest number of seconds
                    segmentsBackwards.sort((a,b)=>a.endTime-b.endTime).sort((a,b)=>b.startTime-a.startTime)
                    for (const each of segmentsBackwards) {
                        if (each.startTime < time) {
                            segment = each
                            break
                        }
                    }
                }
                return segment
            }
        },
        selectNextSegment() {
            let segment = this.$root.selectedSegment
            if (segment) {
                this.jumpSegment(segment.$displayIndex+1)
            } else {
                window.SegmentDisplay = this
                segment = this.closestSegment({time: this.currentTime, forward: true})
                if (segment) {
                    this.jumpSegment(segment.$displayIndex)
                }
            }
        },
        selectPreviousSegment() {
            let segment = this.$root.selectedSegment
            if (segment) {
                this.jumpSegment(segment.$displayIndex-1)
            } else {
                window.SegmentDisplay = this
                segment = this.closestSegment({time: this.currentTime, forward: false})
                if (segment) {
                    this.jumpSegment(segment.$displayIndex)
                }
            }
        },
        async jumpSegment(newIndex) {
            const functionCallId = Math.random().toFixed(6)
            let debug = (message, ...args)=>1||console.debug(`[jumpSegment: ${functionCallId}] ${message}`, ...args)
            
            // basic saftey check
            if (!(this.processedKeySegments instanceof Array) || this.processedKeySegments.length == 0) {
                return debug("segments don't exist, returning")
            }
            // get the previous segment or the first one in the list
            let segment = this.$root.selectedSegment || this.processedKeySegments[0]
            const startingPoint = wrapIndex(newIndex, this.processedKeySegments)
            let indexOfPreviousSegment = (!segment) ? 0 : segment.$displayIndex
            if (newIndex != indexOfPreviousSegment || !segment.$shouldDisplay) {
                let direction = indexOfPreviousSegment > newIndex ? -1 : 1
                debug(`jump direction is: ${direction}`)
                while (1) {
                    let newSegment = this.processedKeySegments[ wrapIndex(newIndex, this.processedKeySegments) ]
                    // if its a displayable segment then good, were done
                    if (newSegment.$shouldDisplay) {
                        segment = newSegment
                        debug("found a displayable segment")
                        break
                    }
                    // cycle the index
                    newIndex += direction
                    // if somehow ended back at the start then fail
                    if (wrapIndex(newIndex, this.processedKeySegments) == startingPoint) {
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
        toggleLabel(labelName) {
            // this is a dumb hack that only exists because sometimes the ui-checkboxes don't display the change
            // even though the change has been made
            
            // get the value
            const actualValue = this.$root.labels[labelName]
            // change it to nothing
            this.$root.labels[labelName] = {}
            // almost immediately change it back to something
            setTimeout(() => {
                this.$root.labels[labelName] = actualValue
            }, generalTimeoutFrequency)
            
            // this is a hack to force the segment display to update
            this.$root.videoInterface.updateKeySegments()
        },
    }
}

</script>
<style lang='sass'>

.segments
    width: 100%
    align-items: flex-start
    text-align: left
    padding-top: 0.3rem
    
    .outline-button
        opacity: 0
    &:hover
        .outline-button
            opacity: 1

    h5
        color: gray
        margin-bottom: 5px
        margin-left: 10px
        font-weight: 100
        border-bottom: 2px lightgray solid
        width: 96%
        margin-bottom: 0.5rem
    
    --max-label-size: 10rem
    .labels
        margin: 1rem
        margin-top: 0.5rem
        display: grid
        width: 100%
        // 6 columns
        grid-template-columns: repeat(auto-fit, var(--max-label-size))
        
        .label-toggle
            align-items: flex-start
            overflow: auto
            height: 1.5rem
            scrollbar-width: none  // Firefox specific
            &::-webkit-scrollbar
                display: none //  Chrome, Safari and Opera specific
            
        // 
        // each label
        // 
        & > *
            margin-left: 12px
            margin-bottom: 7px
            border: transparent 1px solid
            color: var(--label-color)
            --checkbox-background-color: var(--label-color)
            --checkbox-check-color: white
        
        // this is overridden later
        --label-color: darkgray
        
        // 
        // checkboxes
        // 
        // TODO: use v-deep to access this instead of having unscoped styles
        .ui-checkbox__checkmark::after
            color: black
            border-bottom: 0.125rem solid var(--checkbox-check-color)
            border-right: 0.125rem solid var(--checkbox-check-color)
        
        .ui-checkbox__checkmark-background
            border: 0.025rem solid rgba(0, 0, 0, 0.38)
            
        .ui-checkbox--color-primary
            .ui-checkbox__checkmark-background
                border-color: var(--checkbox-background-color)
            &.is-checked
                .ui-checkbox__checkmark-background
                    border-color: var(--checkbox-background-color)
                    background-color: var(--checkbox-background-color)
        
        .ui-checkbox
            margin: 0
        
    .segment-container
        margin-bottom: 0.7rem
        width: 95%
        align-self: center
        min-height: 2.2rem
        // border-bottom: #e0e0e0 1px solid
        overflow: visible
        transition: all ease 0.5s
        .segment
            color: var(--color)
            position: absolute
            min-height: 1.4rem
            background-color: var(--blue)
            padding: 2px
            border-radius: 2px
            transition: all ease 0.6s
            cursor: pointer 
            animation-duration: 0.90s 
            animation-timing-function: ease
            animation-iteration-count: infinite 
            animation-play-state: running 
            &[selected]
                animation-name: pulse-fade
                
            &:not([isHuman])
                background-color: transparent
                --border-width: 8px // this is used later 
                border-width: var(--border-width)
                border-style: solid
                border-radius: 0
                overflow: hidden
                background-color: transparent !important
            
                &:not([rejectedBySomeone]):not([confirmedBySomeone]):not([selected])
                    border-width: 0
                    --border-gap: 10px
                    --border-width: 2px
                    background-image: linear-gradient(90deg, var(--color) 50%, transparent 50%), linear-gradient(90deg, var(--color) 50%, transparent 50%), linear-gradient(0deg, var(--color) 50%, transparent 50%), linear-gradient(0deg, var(--color) 50%, transparent 50%)
                    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y
                    background-size: var(--border-gap) var(--border-width), var(--border-gap) var(--border-width), var(--border-width) var(--border-gap), var(--border-width) var(--border-gap)
                    background-position: left top, right bottom, left bottom, right top
                    animation: border-dance 1s infinite linear
            
                // checkerboard (yeah the css is a tiny bit complicated)
                // combines this: https://stackoverflow.com/questions/27277641/create-a-checkered-background-using-css
                // and this: https://www.sitepoint.com/css3-transform-background-image/
                // border-radius: 0.3rem
                // &::before
                //     --on-color: black
                //     --off-color: white
                //     content: ""
                //     position: absolute
                //     width: 4rem
                //     height: 4rem
                //     top: -50%
                //     left: -50%
                //     z-index: -1
                //     transform: scale(1) rotate(45deg)
                //     background-image: linear-gradient(45deg, var(--on-color) 27%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--on-color) 75%), linear-gradient(45deg, transparent 75%, var(--on-color) 75%), linear-gradient(45deg, var(--on-color) 27%, var(--off-color) 25%)
                //     --scale: 8px
                //     background-size: calc(var(--scale) * 2) calc(var(--scale) * 2)
                //     background-position: 0 0, 0 0, calc(var(--scale) * -1) calc(var(--scale) * -1), var(--scale) var(--scale)
            
            &:hover
                box-shadow: var(--shadow-1)
                opacity: 0.9

@keyframes pulse-fade
    0%  
        opacity: 1

    50%  
        opacity: 0.5
    
    100%  
        opacity: 1

@keyframes border-dance 
    0% 
        background-position: left top, right bottom, left bottom, right top
    
    100% 
        background-position: left var(--border-gap) top, right var(--border-gap) bottom, left bottom var(--border-gap), right top var(--border-gap)

</style>