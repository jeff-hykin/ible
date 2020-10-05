<template lang="pug">
    column.moment-widget
        ui-textbox(
            floating-label
            label="whichVideo (videoId)"
            v-model="momentData.whichVideo"
        )
        ui-textbox(
            label="startTime (miliseconds)"
            :placeholder="`${momentData.startTime}`"
            v-model.number="momentData.startTime"
            type="number"
        )
        ui-textbox(
            ref="endTime"
            label="endTime (miliseconds)"
            :placeholder="`${momentData.endTime}`"
            v-model.number="momentData.endTime"
            type="number"
        )
        ui-textbox(
            floating-label
            label="username/modelname"
            v-model="momentData.username"
        )
        ui-textbox(
            floating-label
            label="label"
            v-model="momentData.label"
        )
        ui-switch(v-model="momentData.fromHuman")
            | fromHuman
        ui-button.delete-button(color="error")
            | Delete
</template>

<script>
export default {
    data: ()=>({
        momentData: {
            whichVideo: null,
            startTime: 0,
            endTime: 0,
            username: "",
            label: "",
            fromHuman: true,
        },
    }),
    rootHooks: {
        watch: {
            // when the selected segment changes
            selectedSegment() {
                if (this.$root.selectedSegment instanceof Object) {
                    
                }
            }
        },
    },
    methods: {
        getMomentData() {
            return {
                whichVideo: this.momentData.whichVideo,
                startTime: this.momentData.startTime-0,
                endTime: this.momentData.endTime-0,
                username: this.momentData.username,
                observation: {
                    label: this.momentData.label,
                    fromHuman: this.momentData.fromHuman,
                }
            }
        },
        pullInfoFromEnviornment() {
            this.momentData.whichVideo = this.$root.selectedVideo.$id
            this.momentData.startTime  = this.currentTime
            this.momentData.endTime    = this.currentTime
        },
    },
}
</script>

<style lang='sass' scoped>
.moment-widget
    padding: 1.7rem 2.4rem
    position: relative
    background: white
    width: 20rem
    border-radius: 1rem
    box-shadow: var(--shadow-1)
    
    *
        width: 100%
    
    .delete-button
        position: absolute
        top: 0.7rem
        right: 0.8rem
        width: 5rem
        transform: scale(0.9)
        background: var(--red)
        color: white
        
        
</style>