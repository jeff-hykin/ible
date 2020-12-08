<template lang="pug">
    column.search(align-v="top" width="100%")
        row.video-wrapper(style="min-width: 100%; margin-top: 1rem;")
            VideoIdSearch
        row.search-summary(
            align-v="top"
            align-h="space-around"
            padding="1rem 4rem"
            height="min-content"
            width="100%"
        )
            column.card.search-observation(align-h="left" min-height="fit-content")
                h5
                    | Search Filters
                br
                ui-textbox(
                    label="Label"
                    placeholder="(Any)"
                    v-model="$root.routeData$.labelName"
                )
                ui-textbox(
                    label="Minium Label Confidence"
                    placeholder="(Any)"
                    v-model="$root.filterAndSort.minlabelConfidence"
                )
                ui-textbox(
                    label="Observer (username)"
                    placeholder="(Any)"
                    v-model="$root.filterAndSort.observer"
                )
                ui-textbox(
                    label="Video Id"
                    placeholder="(Any)"
                    v-model="$root.filterAndSort.videoId"
                )
                br
                ui-radio-group(
                    name="Kind of Observer"
                    :options="['Only Humans', 'Either', 'Only Robots']"
                    v-model="$root.filterAndSort.kindOfObserver"
                )
                    | Kind of Observer
                br
                ui-radio-group(
                    name="validation"
                    :options="[ 'Any', 'Unchecked', 'Confirmed', 'Rejected', 'Disagreement']"
                    v-model="$root.filterAndSort.validation"
                )
                    | Validation
            
            
            column.card(width="32rem" flex-grow="0.3")
                h3(style="ont-weight: 100; margin-top: -10px; border-bottom: black solid 2px;")
                    | Stats
                br
                br
                row.text-grid(:wrap="true" align-h="left")
                    h5
                        | Total Videos: {{$root.searchResults.videos.size}}
                    //- h5
                    //-     | Total Clips: {{$root.searchResults.counts.total}}
                    h5
                        | False Positive Ratio: {{falsePositiveRatio()}}
                br
                br
                .pie-wrapper(v-if="$root.searchResults.finishedComputing")
                    PieChart(
                        :series="[$root.searchResults.counts.fromHuman, $root.searchResults.counts.rejected, $root.searchResults.uncheckedObservations.length, $root.searchResults.counts.confirmed, $root.searchResults.counts.disagreement]"
                        :labels="['Human','Rejected','Unchecked','Confirmed', 'Disagreement']"
                        :colors="[ colors.blue, colors.red, colors.purple, colors.green, colors.yellow, ]"
                    )

                h5
                    | Labels
                br
                .pie-wrapper(v-if="$root.searchResults.finishedComputing")
                    PieChart(
                        :series="Object.values($root.searchResults.labels)"
                        :labels="Object.keys($root.searchResults.labels)"
                    )
            
            column.card(width="26rem" padding="0.6rem 1rem")
                LabelLister
            
</template>

<script>
let { colors, debounce } = require("../utils")

export default {
    components: {
        UiSwitch: require("../atoms/UiSwitch").default,
        PieChart: require("../molecules/PieChart").default,
        VideoIdSearch: require("../molecules/VideoIdSearch").default,
        LabelLister: require("../organisms/LabelLister").default,
    },
    data: ()=>({
        debouncedSubmitSearch:()=>{},
        colors,
    }),
    mounted() {
        // wait half a sec before updating the content
        this.debouncedSubmitSearch = debounce(this.submitSearch, 500)
    },
    computed: {
    },
    methods: {
        falsePositiveRatio() {
            try {
                let answer = this.$root.searchResults.counts.rejected/this.$root.searchResults.counts.confirmed
                return answer.toFixed(2)
            } catch (error) {
                
            }
            return NaN
        },
        async submitSearch() {
            let backend = await this.backend
            let where = []
            
            // 
            // build the backend query
            // 
            if (this.$root.routeData$.labelName                            ) { where.push({ valueOf: ['observation', 'label'             ], is:                     this.$root.routeData$.labelName            , }) }
            if (this.$root.filterAndSort.minlabelConfidence                ) { where.push({ valueOf: ['observation', 'minlabelConfidence'], isGreaterThanOrEqualTo: this.$root.filterAndSort.minlabelConfidence, }) }
            if (this.$root.filterAndSort.observer                          ) { where.push({ valueOf: ['observer'                         ], is:                     this.$root.filterAndSort.observer          , }) }
            if (this.$root.filterAndSort.videoId                           ) { where.push({ valueOf: ['videoId'                          ], is:                     this.$root.filterAndSort.videoId           , }) }
            if (this.$root.filterAndSort.kindOfObserver == "Only Humans"   ) { where.push({ valueOf: ['isHuman'                          ], is:                     true                          , }) }
            if (this.$root.filterAndSort.kindOfObserver == "Only Robots"   ) { where.push({ valueOf: ['isHuman'                          ], is:                     false                         , }) }
            if (this.$root.filterAndSort.validation     == "Confirmed"     ) { where.push({ valueOf: ['confirmedBySomeone'               ], is:                     true                          , }) }
            if (this.$root.filterAndSort.validation     == "Rejected"      ) { where.push({ valueOf: ['rejectedBySomeone'                ], is:                     true                          , }) }
            if (this.$root.filterAndSort.validation     == "Disagreement"  ) { where.push({ valueOf: ['rejectedBySomeone'                ], is:                     true                          , }) 
                                                                               where.push({ valueOf: ['confirmedBySomeone'               ], is:                     true                          , }) }
            if (this.$root.filterAndSort.validation     == "Unchecked"     ) { where.push({ valueOf: ['rejectedBySomeone'                ], is:                     false                         , }) 
                                                                               where.push({ valueOf: ['confirmedBySomeone'               ], is:                     false                         , }) }
            console.log(`querying the backend`)
            let observationEntries = await backend.mongoInterface.getAll({
                from: 'observations',
                where: [
                    { valueOf: ['type'], is:'segment' },
                    ...where,
                ]
            })
            console.debug(`observationEntries is:`,observationEntries)
            let results = {
                finishedComputing: true,
                uncheckedObservations: [],
                rejected: [],
                labels: {},
                videos: new Set(),
                counts: {
                    total: observationEntries.length,
                    fromHuman: 0,
                    rejected: 0,
                    confirmed: 0,
                    disagreement: 0,
                },
            }
            for (let each of observationEntries) {
                if (!results.labels[each.observation.label]) { results.labels[each.observation.label] = 0 }
                results.labels[each.observation.label] += 1
                results.videos.add(each.videoId)
                
                if (each.isHuman) {
                    results.counts.fromHuman += 1 
                } else {
                    if (each.confirmedBySomeone) {
                        results.counts.confirmed += 1
                    }
                    if (each.rejectedBySomeone) {
                        results.counts.rejected  += 1 
                        results.rejected.push(each)
                    }
                    if (each.rejectedBySomeone && each.confirmedBySomeone) {
                        results.counts.disagreement += 1
                    }
                    if (each.rejectedBySomeone !== true && each.confirmedBySomeone !== true) {
                        results.uncheckedObservations.push(each)
                    }
                }
            }
            this.$root.searchResults = results
        },
    },
    rootHooks: {
        watch: {
            filterAndSort() {
                this.$root.searchResults.finishedComputing = false
                this.debouncedSubmitSearch()
            }
        }
    }
}
</script>

<style lang="sass" scoped>

.search
    .text-grid
        h5
            width: 50%
            min-width: fit-content
            margin-top: 9px
        
    background: radial-gradient(circle, hsl(210 13% 73% / 1) 0%, hsl(210 13% 55% / 1) 100%)
    .search-summary
        & > .card
            justify-content: flex-start
            margin: 0.5rem
            height: 32rem
            overflow: auto
            background: hsl(210 13% 83% / 1)
        
        
    .card
        box-shadow: var(--shadow-1)
        padding: 1.7rem 2.4rem
        background: white
        border-radius: 1rem
        min-width: 19rem
        
    .search-observation
        min-width: 19rem

    .ui-textbox
        width: 100% 
    
    .video-wrapper .ui-autocomplete
        box-shadow: var(--shadow-3)
    
    .pie-wrapper
        width: 90%
        position: relative
        overflow: visible
    
    ::v-deep.label-search 
        .ui-autocomplete
            background-color: rgba(255, 255, 255, 0.37)
        
        .search-card.good-column
            color: rgb(0 0 0 / 0.37)
            border-color: rgb(0 0 0 / 0.17)
            
            .good-column.show-samples
                border-radius: 12px
                margin-right: 5px
                margin-top: 5px

</style>