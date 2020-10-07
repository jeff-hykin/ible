<template lang="pug">
    column.observation-widget
        ui-textbox(
            floating-label
            label="Video Id"
            v-model="observationData.videoId"
        )
        ui-textbox(
            label="Start Time (seconds)"
            :placeholder="`${observationData.startTime}`"
            v-model.number="observationData.startTime"
            type="number"
        )
        ui-textbox(
            label="End Time (seconds)"
            :placeholder="`${observationData.endTime}`"
            v-model.number="observationData.endTime"
            type="number"
        )
        ui-textbox(
            floating-label
            label="Observer (username)"
            v-model="observationData.observer"
        )
        ui-textbox(
            floating-label
            label="Label"
            v-model="observationData.label"
        )
        ui-textbox(
            floating-label
            label="Label Confidence"
            v-model="observationData.labelConfidence"
        )
        ui-switch(v-model="observationData.isHuman")
            | Observer Is Human
        ui-button.delete-button(color="error")
            | Delete
</template>

<script>
export default {
    data: ()=>({
        observationData: {
            videoId: null,
            startTime: 0,
            endTime: 0,
            observer: "",
            label: "",
            labelConfidence: 0.99,
            isHuman: true,
        },
    }),
    rootHooks: {
        watch: {
            // when the selected segment changes
            selectedSegment() {
                let selectedSegment = this.$root.selectedSegment
                if (this.$root.selectedSegment instanceof Object) {
                    this.observationData = {
                        videoId:   selectedSegment.videoId,
                        startTime: selectedSegment.startTime,
                        endTime:   selectedSegment.endTime,
                        observer:  selectedSegment.observer,
                        isHuman:   selectedSegment.isHuman,
                        label:           selectedSegment.observation.label,
                        labelConfidence: selectedSegment.observation.labelConfidence,
                    }
                }
            }
        },
    },
    methods: {
        getObservationData() {
            return {
                videoId: this.observationData.videoId,
                startTime: this.observationData.startTime-0,
                endTime: this.observationData.endTime-0,
                observer: this.observationData.observer,
                observation: {
                    label: this.observationData.label,
                    isHuman: this.observationData.isHuman,
                }
            }
        },
        pullInfoFromEnviornment() {
            this.observationData.videoId    = this.$root.selectedVideo.$id
            this.observationData.startTime  = this.currentTime
            this.observationData.endTime    = this.currentTime
        },
    },
}
</script>

<style lang='sass' scoped>
.observation-widget
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