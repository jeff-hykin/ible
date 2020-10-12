<template lang="pug">
    column.dummy-observation
        ui-textbox(
            label="Start Time (seconds)"
            v-model.number="observationData.startTime"
            type="number"
        )
        ui-textbox(
            label="End Time (seconds)"
            v-model.number="observationData.endTime"
            type="number"
        )
        ui-textbox(
            floating-label
            label="Label"
            :invalid="!observationData.observation.label.match(/^[a-zA-Z0-9]+$/)"
            v-model="observationData.observation.label"
        )
        ui-textbox(
            floating-label
            label="Label Confidence"
            v-model="observationData.observation.labelConfidence"
        )
        ui-textbox(
            floating-label
            label="Observer (username)"
            v-model="observationData.observer"
        )
        ui-textbox(
            floating-label
            label="Video Id"
            v-model="observationData.videoId"
        )
        ui-switch( v-model="observationData.isHuman")
            | Observer Is Human
</template>

<script>
export default {
    props: [
        'observationData',
    ],
    data: ()=>({}),
}
</script>

<style lang="sass" scoped>
.dummy-observation
    box-shadow: var(--shadow-1)
    padding: 1.7rem 2.4rem
    background: white
    border-radius: 1rem
    
</style>