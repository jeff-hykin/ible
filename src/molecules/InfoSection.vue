<template lang="pug">
    span.info-section(v-if='$root.getVideoId()')
        | Selected Label: {{$root.selectedLabel.name}}
        br
        | Current Video ID: {{$root.getVideoId()}}
        br
        | Pause Time: {{$root.currentTime}} sec
        br
        | {{getSegmentUuid() && `Selected Segment UUID:`}}
        span.uuid 
            | {{getSegmentUuid() && $root.selectedSegment.$uuid}}
</template>

<script>
export default {
    data: ()=>({
        currentTime: 0,
    }),
    mounted() {
        // update the time periodically
        setInterval(() => {
            if (window.player && window.player.getCurrentTime instanceof Function) {
                this.setTime()
            } else {
                this.$root.currentTime = null
            }
        }, 700)
    },
    methods: {
        setTime(){
            // TODO: stop using globals
            try {
                this.$root.currentTime = window.player.getCurrentTime().toFixed(3)
            } catch (error) {
                window.centerStage.player.getCurrentTime().toFixed(3)
            }
        },
        getSegmentUuid() {
            return $root.selectedSegment && $root.selectedSegment.$uuid
        },
        getVideoUrl() {
            return window.player && window.player.getVideoUrl instanceof Function && window.player.getVideoUrl()
        }
    },
    windowListeners: {
        "CenterStage: videoWasPaused": function() {
            this.setTime()
        }
    }
}
</script>
<style lang='sass' scoped>
.info-section
    margin-left: 1rem
    align-self: flex-start
    color: darkgrey
    a 
        color: var(--blue)

.uuid
    font-family: monospace

</style>
