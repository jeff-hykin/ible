<template lang="pug">
    column.search(align-v="top" width="100%")
        row.video-wrapper(style="min-width: 100%; margin-top: 1rem;")
            ui-textbox(
                adlkfjadlskjflksd
                floating-label
                label=""
                placeholder="email"
                :invalid="emailIsInvalid"
                v-model="$root.email"
                color="gray"
            )
            ui-button.delete-button(
                @click="showDeletePrompt"
                icon="delete"
                color="black"
                tooltipPosition="top"
                :tooltip="`Delete all ${numberOfSearchResults||$root.searchResults.counts.total} observations`"
            )
                | Delete All
            VideoIdSearch(@submit='searchWasSubmitted')
            ui-button.download-button(
                @click="download"
                icon="download"
                color="primary"
                tooltipPosition="top"
                :tooltip="`Download all ${numberOfSearchResults||$root.searchResults.counts.total} observations as CSV's`"
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
            column.card(width="32rem" flex-grow="0.3" overflow-x="hidden")
                h3(style="font-weight: 100; margin-top: -10px; border-bottom: black solid 2px;")
                    | Stats
                br
                br
                column.text-grid(align-h="left" width="90%")
                    h5
                        | Total Videos: {{Object.keys($root.searchResults.videos).length}}
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
                ui-autocomplete(
                    label="Observer (username)"
                    placeholder="(Any)"
                    v-model="observer"
                    :suggestions="$root.getUsernameList()"
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
import { frontendDb } from '../tooling/database.js'
import { colors, debounce, download, } from "../tooling/pure_tools.js"
import * as utils from "../tooling/pure_tools.js"
import * as csvTools from "../tooling/csv_tooling.js"
import * as zipTools from "../tooling/zip_tooling.js"
import * as basics from "../tooling/basics.bundle.js"
import * as videoTooling from "../tooling/video_tooling.js"
import * as observationTooling from "../tooling/observation_tooling.js"

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
        observer: $root.filterAndSort.observer,
        numberOfSearchResults: 0,
    }),
    mounted() {
        // wait half a sec before updating the content
        this.debouncedSubmitSearch = debounce(this.submitSearch, 500)
    },
    computed: {
        emailIsInvalid() {
            return utils.isInvalidEmail(this.$root.email)
        },
    },
    methods: {
        searchWasSubmitted(data) {
            this.$emit("submit", data)
        },
        async download() {
            console.log(`download clicked`)
            let entries = observationEntries
            if (entries?.length==0) {
                entries = await frontendDb.getObservations({where: [], returnObject: false})
            }
            let videos = []
            if (this.$root.noSearch) {
                videos = await frontendDb.getAllVideos()
            } else {
                const videoIds = [...new Set(entries.map(each=>each.videoId))]
                videos = await frontendDb.getVideos(videoIds)
            }
            
            download(
                "data.ible.zip",
                await zipTools.createZipOfTextFiles({
                    "observations.typed.tsv": await observationTooling.observationsToCsv(entries),
                    "videos.typed.tsv": await videoTooling.videosToCsv(videos),
                    "video_review_status.typed.tsv": await videoTooling.videoObserverTableToCsv(videos),
                })
            )
        },
        async showDeletePrompt() {
            let entries = observationEntries
            if (entries?.length == 0) {
                for await (const [key, value] of frontendDb.iter.observations) {
                    entries.push({ observationId: key })
                    entries.push({ observationId: value.observationId })
                }
            }
            if (confirm(`Are you sure?\n\n    Ok = Delete ${entries.length} observations\n    Cancel = Keep Data`)) {
                const toastObject = this.$toasted.show(`Deleting...`, {
                    closeOnSwipe: true,
                })
                const toastElement = toastObject.el
                toastElement.onclick = ()=>{
                    toastObject.goAway(0)
                }
                toastElement.innerHTML = `<div><br>${toastElement.innerHTML}<br><p>0 of ${entries.length}\n</p></div>`
                let count = 0
                for (const each of entries) {
                    await frontendDb.deleteObservation({ uuidOfSelectedSegment: each.observationId })
                    count++
                    toastElement.innerHTML = toastElement.innerHTML.replace(/<p>.+/,`<p>${count} of ${entries.length}`)
                }
                toastElement.innerHTML = toastElement.innerHTML.replace(/Deleting\.\.\./,`Deleted (Click to close)`)
                if (this.$root.routeData$.labelName) {
                    this.$root.selectAllLabels()
                    this.$root.push({...this.$root.routeData$, labelName: null})
                }
                this.$root.videoInterface.updateKeySegments()
            }
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
            const filterAndSort = {
                ...this.$root.filterAndSort,
                // also include label name if it exists
                ...(this.$root.routeData$.labelName? {labelName: this.$root.routeData$.labelName} : {}),
            }
            this.$root.searchResults = await frontendDb.summary.general(filterAndSort)
            
            let where = []
            
            // 
            // build the search query
            // 
            if (this.$root.routeData$.labelName                               ) { where.push({ valueOf: ['label'                            ], is:                     this.$root.routeData$.labelName            , }) }
            if (Number.isFinite(this.$root.filterAndSort.maxlabelConfidence)  ) { where.push({ valueOf: ['labelConfidence'                  ], isLessThanOrEqualTo:    this.$root.filterAndSort.maxlabelConfidence, }) }
            if (Number.isFinite(this.$root.filterAndSort.minlabelConfidence)  ) { where.push({ valueOf: ['labelConfidence'                  ], isGreaterThanOrEqualTo: this.$root.filterAndSort.minlabelConfidence, }) }
            if (this.$root.filterAndSort.observer                             ) { where.push({ valueOf: ['observer'                         ], is:                     this.$root.filterAndSort.observer          , }) }
            if (this.$root.filterAndSort.kindOfObserver == "Only Humans"      ) { where.push({ valueOf: ['isHuman'                          ], is:                     true                          , }) }
            if (this.$root.filterAndSort.kindOfObserver == "Only Robots"      ) { where.push({ valueOf: ['isHuman'                          ], is:                     false                         , }) }
            if (!this.$root.filterAndSort.validation.includes("Confirmed")    ) { where.push({ valueOf: ['confirmedBySomeone'               ], isNot:                  true                          , }) }
            if (!this.$root.filterAndSort.validation.includes("Rejected")     ) { where.push({ valueOf: ['rejectedBySomeone'                ], isNot:                  true                          , }) }
            
            observationEntries = await frontendDb.getObservations({where, returnObject: true})
            
            // ensure the observationId is the ID
            for (const [key, value] of Object.entries(observationEntries)) {
                value.observationId = key
            }
            observationEntries = Object.values(observationEntries)
            this.numberOfSearchResults = observationEntries.length
            
            // show the time of the first load
            if (this.$root.loadStart && this.$root.email) {
                let loadDuration = ((new Date()).getTime() - this.$root.loadStart)/1000
                this.$root.loadStart = null
                if (loadDuration > 5) {
                    this.$toasted.show(`Initial page loading took: ${loadDuration} sec`, {
                        closeOnSwipe: false,
                        action: {
                            text:'Close',
                            onClick: (e, toastObject)=>{toastObject.goAway(0)}
                        },
                    })
                }
            }
        },
    },
    watch: {
        observer() {
            this.$root.filterAndSort.observer = this.observer
        }
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
            }
        }
    }
}
</script>
<style lang="sass" scoped>
.search
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
    
    .delete-button
        text-align: center
        transition: all 0.3s ease
        box-shadow: var(--shadow-1)
        border-radius: 1rem
        border: var(--text-color) 2px solid
        color: var(--text-color)
        &:not(:hover)
            --text-color: whitesmoke
            background: gray
        &:hover
            --text-color: white
            background: red
        
    .text-grid
        h5
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


.video-wrapper
    ::v-deep.ui-textbox
        position: absolute
        left: 1rem
        top: 1rem
        background: transparent
        width: 12rem
        
        .ui-textbox__input
            color: var(--darkgray)
</style>