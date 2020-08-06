<template lang="pug">
    div 
        //- top bar search area
        column(width="100vw")
            column(padding='1.2rem' align-h="left")
                ui-autocomplete.rounded-search(
                    name="name1"
                    placeholder="Search for a label, or a video"
                    v-model="searchTerm"
                    :suggestions="itemNames"
                )
        
        //- waterfall style area
        div(style="padding: 2rem;")
            row(align-h="left" wrap)
                column.search-card(v-for="(item, index) in it2es" shadow=1 align-h="left" :background-color="item.color")
                    h5(style="text-decoration: underline") {{index}}
                    column(width='max-content' padding='0.5rem')
                        | total number of clips: {{item.videoClipCount}}
                        br
                        | total number of videos: {{item.videoCount}}
                    column.showSamples(@click="notYetImplemented")
                        | See Clips ▲
                
</template>
<script>
import dummyData from "../dummyData"
import Waterfall from 'vue-waterfall/lib/waterfall'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'

let colors = [ "#4fc3f7", "#e57373", "#ba68c8", "#9ccc65", "#fec355", "#04d895", "#4fc3f7", "#ff8a65", "#9575cd",  ]
let colorCopy = [...colors]
Object.keys(dummyData.labels).forEach(each=> dummyData.labels[each].color = (colorCopy.shift()||(colorCopy=[...colors],colorCopy.shift())))
export default {
    name: "HomePage",
    components: {
        Waterfall: Waterfall,
        WaterfallSlot: WaterfallSlot,
    },
    data: ()=>({
        it2es: dummyData.labels,
        itemNames: Object.keys(dummyData.labels),
        searchTerm: "",
    }),
    watch: {
        searchTerm(value) {
            if (typeof value == 'string') {
                // TODO: improve this to be a fuzzy search
                this.it2es = {}
                for (const key in dummyData.labels) {
                    let each = dummyData.labels[key]
                    
                    if (key.startsWith(value)) {
                        this.it2es[key] = each
                    }
                }
            } else {
                this.it2es = dummyData.labels
            }
        }
    },
    methods: {
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
    width: fit-content
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