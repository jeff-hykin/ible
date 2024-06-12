<template lang="pug">
    //- NOTE: this one is in the search area
    column.label-search(align-v='top' width='100%' min-width="100%" align-self="top")
        //- top bar search area
        column.top-bar-container(width="100%")
            ui-autocomplete.rounded-search(
                placeholder="Search for a label"
                v-model="searchTerm"
                :suggestions="suggestions"
            )
        
        Loader(v-if="!loadedAll$")
        transition(name="fade")
            //- all the panel things
            row.below-search-container(v-if="loadedAll$" align-v='top' align-h="space-between" overflow="auto")
                //- waterfall style area
                row(:wrap="true" flex-grow=1)
                    SearchCard(v-for="(label, labelName) in items" :label="label" :labelName="labelName" :key="labelName")
                    //- dud card to remove some strange behavior
                    column.search-card(opacity=0)
</template>

<script>
let Fuse = require("fuse.js").default

export default {
    components: {
        Loader: require('../atoms/Loader').default,
        SearchCard: require('../molecules/SearchCard').default,
    },
    mixins: [
        require("../mixins/loader"),
    ],
    data: ()=>({
        items: {},
        searchTerm: "",
        fuseSuggestor: null,
    }),
    mounted() {
        let {videoId, labelName} = this.$route.params
        // generate the UI for the labels right after mounting
        this.$rootHooks.watch.labels()
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