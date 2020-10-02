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

    h5
        color: gray
        margin-bottom: 5px
        margin-left: 10px
        font-weight: 100
        
    .labels 
        margin-bottom: 1rem
        
        // TODO: use v-deep to access this instead of having unscoped styles
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