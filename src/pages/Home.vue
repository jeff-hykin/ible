<template lang="pug">
    row.main-container(align-v='top' align-h="left" position="relative" width='fit-content' min-width="100vw" height="100vh" overflow="hidden" :class="{labelSelected: labelSelected()}")
        
        //- Pick a Label
        SidePanel(leftSide :open="!labelSelected()")
            template(v-slot:nub-content="")
                row.side-label
                    | Labels
            template(v-slot:panel-content="")
                //- | hi
                column.label-search(align-v='top' width='100%' min-width="100%")
                    //- top bar search area
                    column.top-bar-container(width="100%" padding="1rem")
                        ui-autocomplete.rounded-search(
                            name="name1"
                            placeholder="Search for a label, or a video"
                            v-model="searchTerm"
                            :suggestions="suggestions"
                        )
                    
                    Loader(v-if="!loadedAll$")
                    //- all the panel things
                    row.below-search-container(v-if="loadedAll$" align-v='top' align-h="space-between" padding='1rem' overflow=auto)
                        //- waterfall style area
                        row(:wrap="true" flex-grow=1)
                            column.search-card(v-for="(label, labelName) in items" shadow=1 align-h="left" :background-color="label.color")
                                h5(style="text-decoration: underline") {{labelName}}
                                column(width='max-content' padding='0.5rem')
                                    | total number of clips: {{label.segments.length}}
                                    br
                                    | total number of videos: {{label.videoCount}}
                                column.show-samples(@click="selectLabel(labelName, label)")
                                    | See Clips ▲
                            //- dud card to remove some strange behavior
                            column.search-card(opacity=0)
                    
        //- Show the video
        column.main-container(:visibility="labelSelected()? 'visible' : 'hidden' " align-v="top" flex-grow="1" height="100vh" overflow="auto")
            VideoPanel(:segments='selectedSegments')
            
        //- Show the segments
        SidePanel(rightSide v-if="labelSelected()")
            template(v-slot:nub-content="")
                row.side-label
                    | Moments
            template(v-slot:panel-content="")
                column(align-v="top" height="100vh" overflow='auto' padding-top="2rem")
                    Segments(:segments='selectedSegments')
                
</template>
<script>
const { dynamicSort } = require("good-js")
let Fuse = require("fuse.js").default

let colors = [ "#4fc3f7", "#e57373", "#ba68c8", "#04d895", "#fec355",  "#9575cd", "#4fc3f7", "#ff8a65", "#9ccc65", ]
let colorCopy = [...colors]

export default {
    name: "HomePage",
    components: {
        VideoPanel: require("../components/VideoPanel").default,
        Segments: require("../components/Segments").default,
        Loader: require('../components/Loader').default,
        SidePanel: require('../components/SidePanel').default,
    },
    mixins: [
        require("../mixins/loader"),
        require("../mixins/window-listeners"),
        require("../iilvd-api").mixin,
    ],
    data: ()=>({
        items: {},
        searchTerm: "",
        selectedSegments: null,
        fuseSuggestor: null,
        labelData: {},
    }),
    created() {
        // start asking for the labels
        setTimeout(async () => {
            if (this.endpoints instanceof Promise) {
                this.endpoints = await this.endpoints
            }
            this.labelData = await this.endpoints.summary.labels()
            this.fuseSuggestor = new Fuse(Object.keys(this.labelData), {includeScore: true,})
            // assign colors to all labels in a pretty (irrelevently) inefficient way
            Object.keys(this.labelData).forEach(each=> this.labelData[each].color = (colorCopy.shift()||(colorCopy=[...colors],colorCopy.shift())))
            // put them on the UI as soon as they load
            this.items = this.labelData
        }, 0)
    },
    mounted() {
    },
    watch: {
        searchTerm(value) {
            if (typeof value == 'string') {
                // TODO: improve this to be a fuzzy search
                this.items = {}
                let term = value.toLowerCase()
                for (const key in this.labelData) {
                    let each = this.labelData[key]
                    
                    if (this.suggestions.includes(key) || key.startsWith(term)) {
                        this.items[key] = each
                    }
                }
            } else {
                this.items = this.labelData
            }
        }
    },
    computed: {
        suggestions() {
            if (!this.fuseSuggestor) {
                return []
            }
            let suggestions = this.fuseSuggestor.search(this.searchTerm)
            return suggestions.map(each=>each.item)
        }
    },
    methods: {
        labelSelected() {
            return this.selectedSegments && this.selectedSegments.length > 0
        },
        selectLabel(labelName, label) {
            this.$toasted.show(`Loading clips for ${labelName}`).goAway(2500)
            this.selectedSegments = [...label.segments].sort(dynamicSort(["video_id"]))
        },
        notYetImplemented() {
            this.$toasted.show(`Sadly this doesn't do anything yet`).goAway(2500)
        }
    }
}
</script>
<style lang="sass">

.main-container
    --nub-size: 10rem
    
    .side-panel-nub
        color: white
        font-size: 14pt
        width: var(--nub-size)
        max-width: 50vw
        height: var(--nub-size)
        max-height: 50vw
        justify-content: flex-start
    
    .side-label
        padding: 1rem
        font-size: 1.6rem
        border-radius: 1rem
        position: relative
        background-color: inherit
        top: 19%
        
    .side-panel-nub.leftSide
        align-items: flex-start
        border-bottom-right-radius: var(--nub-size)
    .side-panel-nub.rightSide
        align-items: flex-end
        border-bottom-left-radius: var(--nub-size)
    
    &:not(.labelSelected)
        .side-panel-nub.leftSide
            color: transparent
            background-color: transparent
            box-shadow: none
            
            .panel
                background-color: transparent
                box-shadow: var(--shadow-1)
                width: 100vw
                max-width: 100vw
                transition: none
                
    &.labelSelected
        .side-panel-nub.leftSide
            box-shadow: var(--shadow-1)
            background-color: var(--vue-green)
            .panel
                transition: transform 0.15s ease-in-out, width 1.15s ease-in, color 1.15s ease-in
                background-color: whitesmoke
                box-shadow: var(--shadow-3)
                --animation-duration: 2s
                animation-name: wait-then-slide-shut
                animation-duration: var(--animation-duration)
                
                & > *
                    animation-name: fade-wait-enter
                    animation-duration: var(--animation-duration)
    
    .side-panel-nub.rightSide
        z-index: 0
        background-color: var(--blue)
        box-shadow: var(--shadow-1)
        &:hover
            z-index: 999
        
        .panel
            box-shadow: var(--shadow-3)
    
    .rounded-search
        width: 25rem
        max-width: 85%
        margin: 1.2rem
        padding: 0.7rem 2rem 1rem
        background-color: white
        border-radius: 2rem
        height: fit-content
        box-shadow: var(--shadow-1)
    
    .search-card.good-column
        --card-radius: 0.7rem
        color: white 
        position: relative
        margin: 0.5rem 
        padding: 1.2rem 
        border-radius: var(--card-radius)
        width: 16rem
        border: 3px solid white
        flex-grow: 1
        transition: all 0.25s ease-out
        
        .show-samples
            opacity: 0
            transition: opacity 0.25s ease-out
            top: 0 
            right: -0.5px  // fixes issue with clipping and showing 
            height: 2rem
            padding-left: 0.9rem
            padding-right: 0.4rem
            width: fit-content
            background: white
            border-bottom-left-radius: 0.6rem
            border-top-right-radius: calc(0.2 * var(--card-radius))
            position: absolute
            color: gray
            font-size: 10pt
        
        &:hover
            box-shadow: var(--shadow-3) !important
            
            .show-samples
                transition: opacity 0.25s ease-out
                opacity: 1
                cursor: pointer

:root
    --side-panel-width: 25vw
    --side-panel-min-width: 25rem

@keyframes wait-then-slide-shut
    0%
        width: 100vw
    25%
        width: 100vw
    58%
        width: var(--side-panel-width)
        min-width: var(--side-panel-min-width)
    83%
        width: var(--side-panel-width)
        min-width: var(--side-panel-min-width)
        transform: translateX(0)
    92%
        width: var(--side-panel-width)
        min-width: var(--side-panel-min-width)
        transform: translateX(0)
    100%
        width: var(--side-panel-width)
        min-width: var(--side-panel-min-width)
        transform: translateX(-100)

@keyframes fade-wait-enter
    0%
        opacity: 1
    25%
        opacity: 0
    58%
        opacity: 0
    83%
        opacity: 1
    100%
        opacity: 1

</style>