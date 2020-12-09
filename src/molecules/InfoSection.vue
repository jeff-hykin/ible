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
        throttledDisplayUpdater: ()=>0,
    }),
    created() {
        const updateEveryMiliseconds = 100
        this.throttledDisplayUpdater = throttle(
            ()=>this.displayTime = this.currentTime,
            updateEveryMiliseconds,
            // fire at the very end
            { trailing: true },
        )
    },
    watch: {
        currentTime() {
            this.throttledDisplayUpdater()
        }
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
