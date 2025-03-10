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
                :tooltip="`Delete all ${numberOfSearchResults||$root.searchResults.counts.total} timestamps`"
            )
                | Delete All
            VideoIdSearch(@submit='searchWasSubmitted')
            ui-button.download-button(
                @click="download"
                icon="download"
                color="primary"
                tooltipPosition="top"
                :tooltip="`Download all ${numberOfSearchResults||$root.searchResults.counts.total} timestamps as CSV's`"
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
                        :series="[ /* $root.searchResults.counts.fromHuman, */ $root.searchResults.counts.rejected, $root.searchResults.uncheckedTimestamps.length, $root.searchResults.counts.confirmed, $root.searchResults.counts.disagreement]"
                        :labels="[ /* 'Human', */ 'Rejected','Unchecked','Confirmed', 'Disagreement']"
                        :colors="[ /* colors.blue, */ colors.red, colors.purple, colors.green, colors.yellow, ]"
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

            column.card.search-timestamp(align-h="left" min-height="fit-content")
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
import * as timestampTooling from "../tooling/timestamp_tooling.js"

let timestampEntries
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
            let entries = timestampEntries
            if (entries?.length==0) {
                entries = await frontendDb.getTimestamps({where: [], returnObject: false})
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
                    "timestamps.typed.csv": await timestampTooling.timestampsToCsv(entries),
                    "videos.typed.csv": await videoTooling.videosToCsv(videos),
                    "video_review_status.typed.csv": await videoTooling.videoObserverTableToCsv(videos),
                })
            )
        },
        async showDeletePrompt() {
            let entries = timestampEntries
            if (entries?.length == 0) {
                for await (const [key, value] of frontendDb.iter.timestamps) {
                    entries.push({ timestampId: key })
                    entries.push({ timestampId: value.timestampId })
                }
            }
            if (confirm(`Are you sure?\n\n    Ok = Delete ${entries.length} timestamps\n    Cancel = Keep Data`)) {
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
                    await frontendDb.deleteTimestamp({ uuidOfSelectedTimestamp: each.timestampId })
                    count++
                    toastElement.innerHTML = toastElement.innerHTML.replace(/<p>.+/,`<p>${count} of ${entries.length}`)
                }
                toastElement.innerHTML = toastElement.innerHTML.replace(/Deleting\.\.\./,`Deleted (Click to close)`)
                if (this.$root.routeData$.labelName) {
                    this.$root.selectAllLabels()
                    this.$root.push({...this.$root.routeData$, labelName: null})
                }
                this.$root.videoInterface.updateKeyTimestamps()
            }
        },
        falsePositiveRatio() {
            try {
                let answer = this.$root.searchResults.counts.rejected/this.$root.searchResults.counts.confirmed
                if (answer == answer) {
                    return answer.toFixed(2)
                } else {
                    return 0
                }
            } catch (error) {
                
            }
            return 0
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
            
            let timestampEntriesResponse = await frontendDb.getTimestamps({where, returnObject: true})
            timestampEntries = []
            // ensure the timestampId is the ID
            for (const [key, value] of Object.entries(timestampEntriesResponse)) {
                try {
                    value.confirmedBySomeone= Object.values(value.confirmedBy||{}).length>0
                    value.rejectedBySomeone= Object.values(value.rejectedBy||{}).length>0
                } catch (error) {
                    
                }
                
                if (this.$root.filterAndSort.kindOfObserver == "Only Humans"   && !value.isHuman) { continue }
                if (this.$root.filterAndSort.kindOfObserver == "Only Robots"   && value.isHuman) { continue }
                if (!this.$root.filterAndSort.validation.includes("Confirmed") && !value.confirmedBySomeone   ) { continue }
                if (!this.$root.filterAndSort.validation.includes("Rejected")  && !value.rejectedBySomeone    ) { continue }
                value.timestampId = key
                timestampEntries.push(value)
            }
            this.numberOfSearchResults = timestampEntries.length
            
            // show the time of the first load
            if (this.$root.loadStart && this.$root.email) {
                let loadDuration = ((new Date()).getTime() - this.$root.loadStart)/1000
                this.$root.loadStart = null
                // this is commented out because it runs after the user inputs their email
                // if (loadDuration > 5) {
                //     this.$toasted.show(`Initial page loading took: ${loadDuration} sec`, {
                //         closeOnSwipe: false,
                //         action: {
                //             text:'Close',
                //             onClick: (e, toastObject)=>{toastObject.goAway(0)}
                //         },
                //     })
                // }
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
        
    .search-timestamp
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