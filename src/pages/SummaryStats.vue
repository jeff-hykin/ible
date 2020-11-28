<template lang="pug">
    row.search-summary(align-v="top" align-h="space-around" padding="4rem" height="min-content")
        column.card.search-observation(align-h="left" min-height="fit-content")
            h5
                | Search Filters
            br
            ui-textbox(
                label="Label"
                placeholder="(Any)"
                v-model="$root.filterAndSort.label"
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
                :options="['Only Confirmed', 'Either', 'Only Rejected']"
                v-model="$root.filterAndSort.validation"
            )
                | Validation
        
        
        column.card(width="32rem")
            h3(style="ont-weight: 100; margin-top: -10px; border-bottom: black solid 2px;")
                | Stats
            br
            br
            column(width="90%" align-h="left" height="4rem" align-v="space-between")
                h5
                    | Total Videos: {{results.videos.size}}
                h5
                    | Total Clips: {{results.counts.total}}
            br
            .pie-wrapper
                PieChart(
                    :series="[results.counts.fromHuman, results.counts.rejected, results.uncheckedObservations.length, results.counts.confirmed, results.counts.disagreement]"
                    :labels="['Human','Rejected','Unchecked','Confirmed', 'Disagreement']"
                    :colors="[ colors.blue, colors.red, colors.purple, colors.green, colors.yellow, ]"
                )
            br
            h5
                | Labels
            .pie-wrapper
                PieChart(
                    :series="Object.values(results.labels)"
                    :labels="Object.keys(results.labels)"
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
        LabelLister: require("../organisms/LabelLister").default,
    },
    data: ()=>({
        debouncedSubmitSearch:()=>{},
        colors,
        results: {
            videos: new Set(),
            uncheckedObservations: [0],
            // this hardcoded value is only for initilization and is
            // immediately replaced with the result of a backend call
            labels: {
                "Uncertain": 2,
                "Happy": 36,
                "Neutral": 13,
                "Surprise": 2,
                "Disgust": 2,
                "Contempt": 2,
                "Anger": 3,
                "non-face": 1,
                "Sad": 2,
                "headache": 182,
                "Smoking": 49,
                "Shaking Head": 21,
                "Fall": 119,
                "Angry": 14,
                "Hand Rotation": 3,
                "Hand Swipe": 11,
                "Heart-Attack": 27,
                "chest pain": 29
            },
            counts: {
                total: 1,
                fromHuman: 0,
                rejected: 0,
                confirmed: 0,
                disagreement: 0,
            },
        },
    }),
    mounted() {
        // wait half a sec before updating the content
        this.debouncedSubmitSearch = debounce(this.submitSearch, 500)
    },
    methods: {
        async submitSearch(){
            let backend = await this.backend
            let where = []
            
            // this.$toasted.show(`Searching`).goAway(2500)
            
            // 
            // build the backend query
            // 
            if (this.$root.filterAndSort.label                             ) { where.push({ valueOf: ['observation', 'label'             ], is:                     this.$root.filterAndSort.label             , }) }
            if (this.$root.filterAndSort.minlabelConfidence                ) { where.push({ valueOf: ['observation', 'minlabelConfidence'], isGreaterThanOrEqualTo: this.$root.filterAndSort.minlabelConfidence, }) }
            if (this.$root.filterAndSort.observer                          ) { where.push({ valueOf: ['observer'                         ], is:                     this.$root.filterAndSort.observer          , }) }
            if (this.$root.filterAndSort.videoId                           ) { where.push({ valueOf: ['videoId'                          ], is:                     this.$root.filterAndSort.videoId           , }) }
            if (this.$root.filterAndSort.kindOfObserver == "Only Humans"   ) { where.push({ valueOf: ['isHuman'                          ], is:                     true                          , }) }
            if (this.$root.filterAndSort.kindOfObserver == "Only Robots"   ) { where.push({ valueOf: ['isHuman'                          ], is:                     false                         , }) }
            if (this.$root.filterAndSort.validation     == "Only Confirmed") { where.push({ valueOf: ['confirmedBySomeone'               ], is:                     true                          , }) }
            if (this.$root.filterAndSort.validation     == "Only Rejected" ) { where.push({ valueOf: ['rejectedBySomeone'                ], is:                     true                          , }) }
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
            this.results = results
        },
    },
    rootHooks: {
        watch: {
            filterAndSort() {
                this.debouncedSubmitSearch()
            }
        }
    }
}
</script>

<style lang="sass" scoped>
.search-summary
    & > .card
        justify-content: flex-start
        margin: 0.5rem
        height: 32rem
        overflow: auto
        background: hsl(210 13% 83% / 1)
        
    background: radial-gradient(circle, hsl(210 13% 73% / 1) 0%, hsl(210 13% 55% / 1) 100%)
    
.pie-wrapper
    width: 100%
    
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

</style>