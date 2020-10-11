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
                :key="eachSegment.listIndex"
                @click="jumpSegment(eachSegment.$displayIndex)"
            )
                ui-tooltip(position="left" animation="fade")
                    | label: {{ eachSegment.observation.label }}
                    br
                    | length: {{  (eachSegment.endTime - eachSegment.startTime).toFixed(2) }} sec
                    br
                    | start: {{ eachSegment.startTime.toFixed(3) }} sec
        h5
            | Filter Observations by Label
        container.labels
            container(v-if="eachLabelName != '(No Segments)'" v-for="(eachLevel, eachLabelName) in $root.labels" :color="$root.labels[eachLabelName].color")
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
    data: ()=>({}),
    mounted() {
    },
    methods: {
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

    h5
        color: gray
        margin-bottom: 5px
        margin-left: 10px
        font-weight: 100
        border-bottom: 2px lightgray solid
        width: 96%
        margin-bottom: 0.5rem
        
    .labels
        margin: 1rem
        margin-top: 0.5rem
        display: grid
        // 6 columns
        grid-template-columns: auto auto auto auto auto auto
        
        // 
        // each label
        // 
        & > *
            border-radius: 1rem
            margin-left: 12px
            margin-bottom: 7px
            border: white 1px solid
            color: white
            text-decoration: underline
                
        // 
        // checkboxes
        // 
        --checkbox-background-color: darkgray
        --checkbox-check-color: white
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
            transition: all ease 0.5s
            cursor: pointer
            // top: 0rem
            // background-color: transparent
            // border: solid gray 2px
            // border-top: none
            // border-top-left-radius: 0
            // border-top-right-radius: 0
            // max-height: none
            // line-height: 0
            // min-height: 0.6rem
            // transform: scale(1.5)
            
            &:hover
                box-shadow: var(--shadow-1)
                opacity: 0.9

</style>