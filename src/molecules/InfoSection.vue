<template lang="pug">
    span.info-section
        | Selected Label: {{labelName}}
        br
        | Current Video ID: {{videoId}}
        br
        | Pause Time: {{displayTime && displayTime.toFixed(2)}} sec
        br
        | {{segmentUuid && `Selected Segment UUID:`}}
        span.uuid 
            | {{segmentUuid}}
</template>
<script>
export default {
    props: [
        "videoId",
        "labelName",
        "currentTime",
        "segmentUuid",
    ],
    data: ()=>({
        displayTime: null,
    }),
    created() {
        setInterval(() => {
            this.displayTime = window.player?.currentTime
        }, 100)
    },
    watch: {
    }
}
</script>
<style lang='sass' scoped>
.info-section
    margin-left: 1rem
    max-width: 18rem
    overflow: visible
    white-space: pre
    align-self: flex-start
    color: darkgrey
    a 
        color: var(--blue)

.uuid
    font-family: monospace

</style>
