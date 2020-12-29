<template lang="pug">
    column.search(align-v="top" width="100%")
        row.video-wrapper(style="min-width: 100%; margin-top: 1rem;")
            ui-button.delete-button(
                icon="download"
                color="red"
            )
                | Delete
            VideoIdSearch(@goToVideo='goToVideo')
            ui-button.download-button(
                @click="download"
                icon="download"
                color="primary"
                tooltipPosition="top"
                :tooltip="`Download all ${$root.searchResults.counts.total} results as JSON`"
            )
                | Download
        row.search-summary(
            align-v="top"
            align-h="space-around"
            padding="1rem 4rem"
            height="min-content"
            width="100%"
        )
            column.card(width="26rem" padding="0.6rem 1rem")
                LabelLister
            column.card(width="32rem" flex-grow="0.3")
                h3(style="ont-weight: 100; margin-top: -10px; border-bottom: black solid 2px;")
                    | Stats
                br
                br
                row.text-grid(:wrap="true" align-h="left")
                    h5
                        | Total Videos: {{$root.searchResults.videos.size}}
                    h5
                        | False Positive Ratio: {{falsePositiveRatio()}}
                br
                br
                .pie-wrapper(v-if="$root.searchResults.finishedComputing")
                    PieChart(
                        showTotal
                        :series="[$root.searchResults.counts.fromHuman, $root.searchResults.counts.rejected, $root.searchResults.uncheckedObservations.length, $root.searchResults.counts.confirmed, $root.searchResults.counts.disagreement]"
                        :labels="['Human','Rejected','Unchecked','Confirmed', 'Disagreement']"
                        :colors="[ colors.blue, colors.red, colors.purple, colors.green, colors.yellow, ]"
                    )

                h5
                    | Observers
                br
                .pie-wrapper(v-if="$root.searchResults.finishedComputing")
                    PieChart(
                        :series="Object.values($root.searchResults.observers)"
                        :labels="Object.keys($root.searchResults.observers)"
                    )
                h5
                    | Labels
                br
                .pie-wrapper(v-if="$root.searchResults.finishedComputing")
                    PieChart(
                        :series="Object.values($root.searchResults.labels)"
                        :labels="Object.keys($root.searchResults.labels)"
                    )

            column.card.search-observation(align-h="left" min-height="fit-content")
                h5
                    | Search Filters
                br
                ui-textbox(
                    label="Observer (username)"
                    placeholder="(Any)"
                    v-model="$root.filterAndSort.observer"
                )
                row(align-h="space-between")
                    ui-textbox(
                        label="Minium Confidence"
                        placeholder="(Any)"
                        v-model="$root.filterAndSort.minlabelConfidence"
                    )
                    ui-textbox(
                        label="Max Confidence"
                        placeholder="(Any)"
                        v-model="$root.filterAndSort.maxlabelConfidence"
                    )
                ui-textbox(
                    label="Label"
                    placeholder="(Any)"
                    v-model="$root.routeData$.labelName"
                )
                br
                row(align-h="space-between" align-v="top")
                    ui-radio-group(
                        name="Kind of Observer"
                        :options="['Only Humans', 'Either', 'Only Robots']"
                        v-model="$root.filterAndSort.kindOfObserver"
                        vertical
                    )
                        | Kind of Observer
                    row(width="2rem")
                    ui-checkbox-group(
                        name="validation"
                        :options="[ 'Unchecked', 'Confirmed', 'Rejected', 'Disagreement' ]"
                        v-model="$root.filterAndSort.validation"
                        vertical
                    )
                        | Validation
            
            
</template>
<script>
let { colors, debounce, download } = require("../utils")
let observationEntries
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
        goToVideo(data) {
            console.log(`goToVideo event`)
            this.$emit("goToVideo", data)
        },
        download() {
            console.log(`download clicked`)
            download("data.json", JSON.stringify(observationEntries))
        },
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
            if (this.$root.routeData$.labelName                               ) { where.push({ valueOf: ['observation', 'label'             ], is:                     this.$root.routeData$.labelName            , }) }
            if (isNumber(this.$root.filterAndSort.maxlabelConfidence)         ) { where.push({ valueOf: ['observation', 'labelConfidence'   ], isLessThanOrEqualTo:    this.$root.filterAndSort.maxlabelConfidence, }) }
            if (isNumber(this.$root.filterAndSort.minlabelConfidence)         ) { where.push({ valueOf: ['observation', 'labelConfidence'   ], isGreaterThanOrEqualTo: this.$root.filterAndSort.minlabelConfidence, }) }
            if (this.$root.filterAndSort.observer                             ) { where.push({ valueOf: ['observer'                         ], is:                     this.$root.filterAndSort.observer          , }) }
            if (this.$root.filterAndSort.kindOfObserver == "Only Humans"      ) { where.push({ valueOf: ['isHuman'                          ], is:                     true                          , }) }
            if (this.$root.filterAndSort.kindOfObserver == "Only Robots"      ) { where.push({ valueOf: ['isHuman'                          ], is:                     false                         , }) }
            if (!this.$root.filterAndSort.validation.includes("Confirmed")    ) { where.push({ valueOf: ['confirmedBySomeone'               ], isNot:                  true                          , }) }
            if (!this.$root.filterAndSort.validation.includes("Rejected")     ) { where.push({ valueOf: ['rejectedBySomeone'                ], isNot:                  true                          , }) }
            // if (!this.$root.filterAndSort.validation.includes("Unchecked")    ) { where.push({ valueOf: ['rejectedBySomeone'                ], is:                     false                         , }) 
            //                                                                       where.push({ valueOf: ['confirmedBySomeone'               ], is:                     false                         , }) }
            // if (!this.$root.filterAndSort.validation.includes("Disagreement") ) { where.push({ valueOf: ['rejectedBySomeone'                ], isNot:                  true                          , }) 
            //                                                                       where.push({ valueOf: ['confirmedBySomeone'               ], isNot:                  true                          , }) }
            console.log(`querying the backend`)
            observationEntries = await backend.mongoInterface.getAll({
                from: 'observations',
                where: [
                    { valueOf: ['type'], is:'segment' },
                    ...where,
                ]
            })
            
            // 
            // this looks like is does nothing but sadly it does
            // however it should be removed once the corrupt data from the database is fixed
            observationEntries = observationEntries.map(each => ({
                ...each,
                isHuman: each.isHuman == true,
                confirmedBySomeone: each.confirmedBySomeone == true,
                rejectedBySomeone: each.rejectedBySomeone == true,
            }))
            
            // this is so weird because of the dumb ways Javascript handles string->number
            // it behaves like if ($root.filterAndSort.minlabelConfidence) then min = $root.filterAndSort.minlabelConfidence
            let min = `${this.$root.filterAndSort.minlabelConfidence}`; min = min.length>0 && isFinite(min-0) ? min-0 : -Infinity
            let max = `${this.$root.filterAndSort.maxlabelConfidence}`; max = max.length>0 && isFinite(max-0) ? max-0 : Infinity
            // TODO: fix this, this is a patch/hack the backend should handle this
            observationEntries = observationEntries.filter(each => (each.observation.labelConfidence >= min) && (each.observation.labelConfidence <= max))
            // TODO: backend should be handling this too
            if (!this.$root.filterAndSort.validation.includes("Unchecked")) {
                observationEntries = observationEntries.filter(each => each.confirmedBySomeone || each.rejectedBySomeone)
            }
            // TODO: backend should be handling this too
            if (!this.$root.filterAndSort.validation.includes("Disagreement")) {
                observationEntries = observationEntries.filter(each => !(each.confirmedBySomeone && each.rejectedBySomeone))
            }
            
            console.debug(`observationEntries is:`,observationEntries)
            let results = {
                finishedComputing: true,
                uncheckedObservations: [],
                rejected: [],
                labels: {},
                observers: {},
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
                if (!results.observers[each.observer]) { results.observers[each.observer] = 0 }
                results.observers[each.observer] += 1
                
                if (!results.labels[each.observation.label]) { results.labels[each.observation.label] = 0 }
                results.labels[each.observation.label] += 1
                
                results.videos.add(each.videoId)
                
                if (each.isHuman) {
                    results.counts.fromHuman += 1 
                } else {
                    if (each.confirmedBySomeone == true) {
                        results.counts.confirmed += 1
                    }
                    if (each.rejectedBySomeone == true) {
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
            routeData$() {
                this.$root.searchResults.finishedComputing = false
                this.debouncedSubmitSearch()
            },
            filterAndSort() {
                this.$root.searchResults.finishedComputing = false
                this.debouncedSubmitSearch()
                storageObject.observer = this.$root.filterAndSort.observer
            }
        }
    }
}
</script>
<style lang="sass" scoped>
.search
    .delete-button
        opacity: 0
    
    .download-button
        transition: all 0.3s ease
        box-shadow: var(--shadow-1)
        border-radius: 1rem
        border: var(--text-color) 2px solid
        color: var(--text-color)
        &:not(:hover)
            --text-color: whitesmoke
        &:hover
            --text-color: white
        
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