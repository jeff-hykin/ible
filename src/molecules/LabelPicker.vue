<template lang="pug">
    container(align-self="top" @mouseover="onHover").nub
        | Labels
        portal(to="left-panel" :order="order")
            column.label-search(align-v='top' width='100%' min-width="100%" align-self="top")
                //- top bar search area
                column.top-bar-container(width="100%" padding="1rem")
                    ui-autocomplete.rounded-search(
                        placeholder="Search for a label"
                        v-model="searchTerm"
                        :suggestions="suggestions"
                    )
                
                Loader(v-if="!loadedAll$")
                //- all the panel things
                row.below-search-container(v-if="loadedAll$" align-v='top' align-h="space-between" padding='1rem' overflow="auto")
                    //- waterfall style area
                    row(:wrap="true" flex-grow=1)
                        column.search-card(v-for="(label, labelName) in items" shadow=1 align-h="left" :background-color="label.color")
                            h5(style="text-decoration: underline") {{labelName}}
                            column(width='max-content' padding='0.5rem')
                                | total number of clips: {{label.segmentCount}}
                                br
                                | total number of videos: {{label.videoCount}}
                            column.show-samples(@click="selectLabel(labelName, label)")
                                | See Clips ▲
                        //- dud card to remove some strange behavior
                        column.search-card(opacity=0)
</template>

<script>
const { dynamicSort, logBlock, checkIf, get, set } = require("good-js")
const { openPanel } = require("../templates/LeftSidePanel")
let Fuse = require("fuse.js").default

export default {
    components: {
        Loader: require('../atoms/Loader').default,
    },
    mixins: [
        require("../mixins/loader"),
    ],
    data: ()=>({
        needToLoad$: {
            endpoints,
        },
        order: 2,
        items: {},
        searchTerm: "",
        fuseSuggestor: null,
    }),
    mounted() {
        openPanel()
        // generate the UI for the labels right after mounting
        this.$rootHooks.watch.labels()
        setTimeout(() => {
            if (!this.loadedAll$) {
                this.$toasted.show(`I think the Server might be down. \nComplain to Jeff Hykin`).goAway(6500)
                this.$toasted.show(`I'll keep trying to connect in the meantime`).goAway(6500)
            }
        }, 3500)
    },
    watch: {
        // when the search term changes
        searchTerm(value) {
            // if no search term
            if (typeof value != 'string' || value.trim().length == 0) {
                // show all the labels
                this.items = this.$root.labels
            } else {
                // figure out which labels to show
                this.items = {}
                const theSearchTerm = value.toLowerCase()
                for (const [eachLabelName, eachLabel] of Object.entries(this.$root.labels)) {
                    // if it matches suggestions or the start of a label
                    if (this.suggestions.includes(eachLabelName) || eachLabelName.startsWith(theSearchTerm)) {
                        // then display it (add it to the list)
                        this.items[eachLabelName] = eachLabel
                    }
                }
            }
        }
    },
    rootHooks: {
        watch: {
            // generate UI whenever labels changes (not often)
            labels(newValue) {
                if (this.$root.labels instanceof Object) {
                    // put them on the UI
                    this.items = this.$root.labels
                    // build a suggestion system for the labels
                    this.fuseSuggestor = new Fuse(Object.keys(this.$root.labels), {includeScore: true,})
                }
            }
        }
    },
    computed: {
        suggestions() {
            // if the labels havent been generated yet, dont show anything
            if (!this.fuseSuggestor) { return [] }
            let suggestions = this.fuseSuggestor.search(this.searchTerm)
            return suggestions.map(each=>each.item)
        }
    },
    methods: {
        onHover() {
            // this looks werid, but basically it just allows kicking-out
            // whatever used to be in the sidepanel
            this.order = 2
            this.$forceUpdate()
            openPanel()
            setTimeout(() => {
                this.order = 1
            }, 0)
        },
        selectLabel(labelName, label) {
            console.debug(`EVENT: selectLabel callback (Home.vue)`)
            label.name = labelName
            this.$root.selectedLabel = label
            // (there must be at least one video with the label, unless the database is corrupt)
            let selectedVideoId = Object.keys(this.$root.selectedLabel.videos)[0]
            // get it from the cache (auto-adds to cache if needed)
            this.$root.selectedVideo = this.$root.getCachedVideoObject(selectedVideoId)
            this.$toasted.show(`Loading clips for ${labelName}`).goAway(2500)
        }
    }
}
</script>

<style lang="sass" scoped>
.nub
    position: fixed
    top: 0
    left: 0
    height: var(--nub-size)
    width: var(--nub-size)
    background: var(--blue)
    color: white
    padding: 1rem
    padding-top: 2rem
    border-bottom-right-radius: var(--nub-size)
    z-index: 1

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
    min-width: fit-content
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
        min-width: 6rem
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