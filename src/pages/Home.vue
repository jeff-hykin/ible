<template lang="pug">
    div 
        //- top bar search area
        column(width="100vw")
            column(padding='1.2rem' align-h="left")
                ui-autocomplete.rounded-search(
                    name="name1"
                    placeholder="Search for a label, or a video"
                    v-model="searchTerm"
                    :suggestions="suggestions"
                )
        
        //- all the panel things
        row(max-width='100vw' align-v='top' align-h="center" padding='1rem')
            //- waterfall style area
            row(align="center" :wrap="true" flex-grow=1)
                column.search-card(v-for="(label, labelName) in items" shadow=1 align-h="left" :background-color="label.color")
                    h5(style="text-decoration: underline") {{labelName}}
                    column(width='max-content' padding='0.5rem')
                        | total number of clips: {{label.videoClipCount}}
                        br
                        | total number of videos: {{label.videoCount}}
                    column.showSamples(@click="selectLabel(labelName, label)")
                        | See Clips ▲
                //- dud card to remove some strange behavior
                column.search-card(opacity=0)
            
            VideoPanel(:segments='this.selectedSegments')
        
        
                
</template>
<script>
import dummyData from "../dummyData"
import Fuse from "fuse.js"

const fuse = new Fuse( Object.keys(dummyData.labels), {includeScore: true,})

let colors = [ "#4fc3f7", "#e57373", "#ba68c8", "#04d895", "#fec355",  "#9575cd", "#4fc3f7", "#ff8a65", "#9ccc65", ]
let colorCopy = [...colors]

// assign colors to all labels in a pretty (irrelevently) inefficient way
Object.keys(dummyData.labels).forEach(each=> dummyData.labels[each].color = (colorCopy.shift()||(colorCopy=[...colors],colorCopy.shift())))

export default {
    name: "HomePage",
    components: {
        VideoPanel: require("../components/VideoPanel").default,
    },
    data: ()=>({
        items: dummyData.labels,
        searchTerm: "",
        selectedSegments: null,
    }),
    mounted() {
    },
    watch: {
        searchTerm(value) {
            if (typeof value == 'string') {
                // TODO: improve this to be a fuzzy search
                this.items = {}
                let term = value.toLowerCase()
                for (const key in dummyData.labels) {
                    let each = dummyData.labels[key]
                    
                    if (this.suggestions.includes(key) || key.startsWith(term)) {
                        this.items[key] = each
                    }
                }
            } else {
                this.items = dummyData.labels
            }
        }
    },
    computed: {
        suggestions() {
            let suggestions = fuse.search(this.searchTerm)
            return suggestions.map(each=>each.item)
        }
    },
    methods: {
        selectLabel(labelName, label) {
            this.$toasted.show(`Loading clips for ${labelName}`).goAway(2500)
            this.selectedSegments = [...label.segments]
        },
        notYetImplemented() {
            this.$toasted.show(`Sadly this doesn't do anything yet`).goAway(2500)
        }
    }
}
</script>
<style lang="sass">

.rounded-search
    width: 25rem
    padding: 0.7rem 2rem 1rem
    background-color: white
    border-radius: 2rem
    height: fit-content
    box-shadow: rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px, rgba(0, 0, 0, 0.3) 0px 2px 4px -1px
    margin-top: 0.7rem

.search-card.good-column
    color: white 
    position: relative
    margin: 0.5rem 
    padding: 1.2rem 
    border-radius: 0.7rem 
    width: 16rem
    min-width: fit-content
    border: 3px solid white
    flex-grow: 1
    transition: all 0.25s ease-out
    
    .showSamples
        opacity: 0
        transition: opacity 0.25s ease-out
        top: 0 
        right: 0
        height: 2rem
        padding-left: 0.9rem
        padding-right: 0.4rem
        width: fit-content
        background: white
        border-bottom-left-radius: 0.6rem
        position: absolute
        color: gray
        font-size: 10pt
    
    &:hover
        box-shadow: rgba(0, 0, 0, 0.14) 0px 8px 17px 2px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px, rgba(0, 0, 0, 0.2) 0px 5px 5px -3px !important
        
        .showSamples
            transition: opacity 0.25s ease-out
            opacity: 1
            cursor: pointer

</style>