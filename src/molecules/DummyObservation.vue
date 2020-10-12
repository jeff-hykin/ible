<template lang="pug">
    column
        ui-textbox(
            disabled
            label="Start Time (seconds)"
            v-model.number="startTime"
            type="number"
        )
        ui-textbox(
            disabled
            label="End Time (seconds)"
            v-model.number="endTime"
            type="number"
        )
        ui-textbox(
            disabled
            floating-label
            label="Label"
            :invalid="!label.match(/^[a-zA-Z0-9]+$/)"
            v-model="label"
        )
        ui-textbox(
            disabled
            floating-label
            label="Label Confidence"
            v-model="labelConfidence"
        )
        ui-textbox(
            disabled
            floating-label
            label="Observer (username)"
            v-model="observer"
        )
        ui-textbox(
            disabled
            floating-label
            label="Video Id"
            v-model="videoId"
        )
        ui-switch(disabled v-model="isHuman")
            | Observer Is Human
</template>

<script>
export default {
    props: [
        'startTime',
        'endTime',
        'label',
        'label',
        'labelConfidence',
        'observer',
        'videoId',
        'isHuman',
    ],
    data: ()=>({}),
}
</script>

<style>

</style>