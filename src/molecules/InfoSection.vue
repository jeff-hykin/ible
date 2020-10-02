<template lang="pug">
    span(v-if='$root.getVideoId()' style="color: darkgrey;")
        | Selected Label: {{$root.selectedLabel.name}}
        br
        | Current Video ID: {{$root.getVideoId()}}
        br
        | Pause Time: {{currentTime}} ms
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
                this.currentTime = (window.player.getCurrentTime()*1000).toFixed()
            }
        }, 700)
    },
    windowListeners: {
        "CenterStage: videoWasPaused": function() {
            this.currentTime = (window.player.getCurrentTime()*1000).toFixed()
        }
    }
}
</script>
<style lang='sass' scoped>
</style>
