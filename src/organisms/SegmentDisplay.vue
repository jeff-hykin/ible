<template lang="pug">
    //- Segments
    column.segments(align-h="left")
        h5(v-if="segmentsInfo.organizedSegments.length > 0")
            | Observations
        row.segment-container(v-if="segmentsInfo.organizedSegments.length > 0" align-h="space-between" position="relative" :height="`${segmentsInfo.maxLevel*2.2}rem`")
            row.segment(
                v-for="(eachSegment, index) in segmentsInfo.organizedSegments"
                :left="eachSegment.$renderData.leftPercent"
                :width="eachSegment.$renderData.widthPercent"
                :top="eachSegment.$renderData.topAmount"
                :background-color="$root.labels[eachSegment.observation.label].color"
                :key="eachSegment.$uuid"
                :style="(eachSegment.$uuid == ($root.selectedSegment&&$root.selectedSegment.$uuid))?`animation-name: pulse-size`:``"
                @click="jumpSegment(eachSegment.$displayIndex)"
            )
                ui-tooltip(position="left" animation="fade")
                    | label: {{ eachSegment.observation.label }}
                    br
                    | length: {{  (eachSegment.endTime - eachSegment.startTime).toFixed(2) }} sec
                    br
                    | start: {{ eachSegment.startTime.toFixed(3) }} sec
        row(position="relative" align-h="left" align-v="top" width="100%")
            h5
                | Filter Observations by Label
            ui-button.outline-button(@click="toggleAllLabels" style="position: absolute; right: 1.5rem; top: -0.3rem; --button-color: darkgray")
                | Toggle All
        container.labels
            container(
                v-if="eachLabelName != '(No Segments)'"
                v-for="(eachLevel, eachLabelName) in $root.labels"
                :style="`--label-color: ${$root.labels[eachLabelName].selected ? $root.labels[eachLabelName].color : 'gray'}`"
            )
                ui-checkbox(v-model="$root.labels[eachLabelName].selected" @change="toggleLabel(eachLabelName)")
                    | {{eachLabelName}}

</template>
<script>

const { endpoints } = require("../iilvd-api")
const { wrapIndex, storageObject } = require('../utils')
const { dynamicSort, logBlock, checkIf, get, set } = require("good-js")

const generalTimeoutFrequency = 50 // ms 

export default {
    props: [
        "segmentsInfo",
        "jumpSegment",
    ],
    components: {
        SideButton: require("../atoms/SideButton").default,
    },
    data: ()=>({
        allLabelsOn: false,
    }),
    mounted() {
    },
    methods: {
        toggleAllLabels() {
            // toggle
            this.allLabelsOn = !this.allLabelsOn
            // assign
            for (let [eachKey, eachValue] of Object.entries(this.$root.labels)) {
                if (eachKey != this.$root.selectedLabel.name) {
                    eachValue.selected = this.allLabelsOn
                }
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
            }, generalTimeoutFrequency)
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
    
    --max-label-size: 8rem
    .labels
        margin: 1rem
        margin-top: 0.5rem
        display: grid
        width: 100%
        // 6 columns
        grid-template-columns: repeat(auto-fit, var(--max-label-size))
        
        // 
        // each label
        // 
        & > *
            border-radius: 1rem
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
            transition: all ease 0.6s
            cursor: pointer 
            animation-duration: 0.90s 
            animation-timing-function: ease
            animation-iteration-count: infinite 
            animation-play-state: running 
            
            &:hover
                box-shadow: var(--shadow-1)
                opacity: 0.9

@keyframes pulse-size
    0%  
        opacity: 1

    50%  
        opacity: 0.5
        // transform: scale(0.92)
    
    100%  
        opacity: 1
        // transform: scale(1.1)
     
 
</style>