<template lang="pug">
    row(align-h="space-around" padding="4rem")
        column.card.search-observation(align-h="left")
            h5
                | Search Filters
            br
            ui-textbox(
                label="Label"
                placeholder="(Any)"
                v-model="search.label"
            )
            ui-textbox(
                label="Minium Label Confidence"
                placeholder="(Any)"
                v-model="search.minlabelConfidence"
            )
            ui-textbox(
                label="Observer (username)"
                placeholder="(Any)"
                v-model="search.observer"
            )
            ui-textbox(
                label="Video Id"
                placeholder="(Any)"
                v-model="search.videoId"
            )
            br
            ui-radio-group(
                name="who"
                :options="['Only Humans', 'Either', 'Only Robots']"
                v-model="search.who"
            )
                | Who
            br
            ui-radio-group(
                name="validation"
                :options="['Only Confirmed', 'Either', 'Only Rejected']"
                v-model="search.confirmation"
            )
                | Validation
        
        
        column.card
            h3(style="color: gray; font-weight: 100; margin-top: -10px; border-bottom: gray solid 2px;")
                | Results
            br
            br
            column(width="90%" align-h="left" height="4rem" align-v="space-between")
                h5
                    | Total Videos: {{results.total}}
                h5
                    | Total Clips: {{results.total}}
            br
            PieChart(
                :series="[results.fromHuman, this.unchecked, results.rejected, results.confirmed]"
                :labels="['Human','Rejected','Unchecked','Confirmed']"
            )
        
</template>

<script>
export default {
    components: {
        UiSwitch: require("../atoms/UiSwitch").default,
        PieChart: require("../molecules/PieChart").default,
    },
    data: ()=>({
        search: {
            label: null,
            minlabelConfidence: null,
            observer: null,
            videoId: null,
            who: 'Either',
            confirmation: 'Either',
        },
        results: {
            total: 100,
            fromHuman: 12,
            rejected: 33,
            confirmed: 44,
        }
    }),
    computed: {
        unchecked() {
            return this.results.total - (this.results.confirmed + this.results.rejected + this.results.fromHuman)
        }
    }
}
</script>

<style lang="sass" scoped>
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