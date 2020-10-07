<template lang="pug">
    span(v-if='$root.getVideoId()' style="color: darkgrey;")
        | Selected Label: {{$root.selectedLabel.name}}
        br
        | Current Video ID: {{$root.getVideoId()}}
        br
        | Pause Time: {{currentTime}} sec
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
            }
        }, 700)
    },
    methods: {
        setTime(){
            this.currentTime = window.player.getCurrentTime().toFixed(3)
        },
    },
    windowListeners: {
        "CenterStage: videoWasPaused": function() {
            this.setTime()
        }
    }
}
</script>
<style lang='sass' scoped>
</style>
