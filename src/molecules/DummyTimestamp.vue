<template lang="pug">
    column.dummy-timestamp(align-h="left")
        ui-textbox(
            label="Start Time (seconds)"
            v-model.number="timestampData.startTime"
            type="number"
        )
        ui-textbox(
            label="End Time (seconds)"
            v-model.number="timestampData.endTime"
            type="number"
        )
        ui-textbox(
            floating-label
            label="Label"
            :invalid="!isValidName(timestampData.label)"
            v-model="timestampData.label"
        )
        ui-textbox(
            floating-label
            label="Label Confidence"
            v-model="timestampData.labelConfidence"
        )
        ui-textbox(
            floating-label
            label="Observer (username)"
            :invalid="!isValidName(timestampData.observer)"
            v-model="timestampData.observer"
        )
        ui-textbox(
            floating-label
            label="Video Id"
            v-model="timestampData.videoId"
        )
        UiSwitch( v-model="timestampData.isHuman")
            | Observer Is Human
        UiSwitch(v-model="timestampData.confirmedBySomeone" v-if="!timestampData.isHuman")
            | Confirmed By ≥1 Human
        UiSwitch(v-model="timestampData.rejectedBySomeone" v-if="!timestampData.isHuman")
            | Rejected By ≥1 Human
        ui-textbox(
            floating-label
            label="Id"
            tooltip="this needs to be unique! Use the unix epoch timestamp (milliseconds) + decimals of a random number"
            v-model="timestampData.timestampId"
        )
</template>
<script>
import { isValidName } from "../tooling/pure_tools.js"

export default {
    props: [
        'timestampData',
    ],
    components: {
        UiSwitch: require("../atoms/UiSwitch").default,
    },
    data: ()=>({}),
    methods: {
        isValidName,
    },
}
</script>

<style lang="sass" scoped>
.dummy-timestamp
    box-shadow: var(--shadow-1)
    padding: 1.7rem 2.4rem
    background: white
    border-radius: 1rem
    min-width: 19rem
    
</style>