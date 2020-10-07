<template lang="pug">
    column(data-fjio3y598t3hi2 width="min-content")
        row.button-row(align-h="space-evenly" :width="editing?`143%`:`100%`" margin-bottom="0.7rem")
            ui-button.edit-button(
                v-if="!editing"
                @click="onEditObservation"
                icon="edit"
                color="primary"
                raised
            )
                | Edit
            ui-button.cancel-button(
                v-if="editing"
                @click="onCancelEdit"
                icon="cancel"
                color="accent"
                raised
            )
                | Cancel
            ui-button.save-button(
                v-if="editing"
                @click="onSaveEdit"
                icon="save"
                color="primary"
                raised
            )
                | Save
            ui-button.delete-button(
                v-if="editing"
                @click="onDelete"
                icon="delete"
                color="primary"
                raised
            )
                | Delete
            column.add-container(v-if="!editing")
                ui-button.add-button(
                    @click="onNewObservation"
                    icon="add"
                    color="primary"
                    raised
                    tooltip="create a new observation"
                    tooltipPosition="right"
                )
                    | Add
                ui-button.upload-button(
                    v-if="!editing"
                    @click="onUploadObservation"
                    icon="cloud_upload"
                    color="green"
                    raised
                    tooltip="upload multiple observations"
                    tooltipPosition="right"
                )
                    | Upload
        column.observation-widget
            .input-area
                ui-textbox(
                    :disabled="!editing"
                    floating-label
                    label="Video Id"
                    v-model="observationData.videoId"
                )
                ui-textbox(
                    :disabled="!editing"
                    label="Start Time (seconds)"
                    :placeholder="`${observationData.startTime}`"
                    v-model.number="observationData.startTime"
                    type="number"
                )
                ui-textbox(
                    :disabled="!editing"
                    label="End Time (seconds)"
                    :placeholder="`${observationData.endTime}`"
                    v-model.number="observationData.endTime"
                    type="number"
                )
                ui-textbox(
                    :disabled="!editing"
                    floating-label
                    label="Observer (username)"
                    v-model="observationData.observer"
                )
                ui-textbox(
                    :disabled="!editing"
                    floating-label
                    label="Label"
                    v-model="observationData.label"
                )
                ui-textbox(
                    :disabled="!editing"
                    floating-label
                    label="Label Confidence"
                    v-model="observationData.labelConfidence"
                )
                ui-switch(:disabled="!editing" v-model="observationData.isHuman")
                    | Observer Is Human
        
        //- column.add-observation-area(margin-top="1.6rem")
        //-     row
        //-         ui-fab.new-observation-button(
        //-             color="primary"
        //-             icon="add"
        //-             tooltipPosition="right"
        //-             tooltip="New Observation"
        //-             openTooltipOn="focus hover"
        //-         )
        //-     row(margin-top="1rem")
        //-         ui-fab.upload-observations-button(
        //-             color="primary"
        //-             icon="cloud_upload"
        //-             tooltipPosition="right"
        //-             tooltip="Upload Observations"
        //-             openTooltipOn="focus hover"
        //-         )
</template>

<script>
import { endpoints } from '../iilvd-api'
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
        uuidOfSelectedSegment: null,
        dataCopy: null,
        editing: false,
    }),
    mounted() {
        // bascially init the data
        if (!(this.$root.selectedSegment instanceof Object)) {
            this.resetData()
        }
    },
    rootHooks: {
        watch: {
            // when the selected segment changes
            selectedSegment() {
                let selectedSegment = this.$root.selectedSegment
                if (this.$root.selectedSegment instanceof Object) {
                    // FIXME this needs to be retrived
                    this.uuidOfSelectedSegment = selectedSegment.$uuid
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
        async onNewObservation() {
            this.dataCopy = {}
            // FIXME: add the 
            this.uuidOfSelectedSegment = (await endpoints).addSegmentObservation({})
            // start editing the newly created observation
            this.onEditObservation()
        },
        onUploadObservation() {
            this.$toasted.show(`Not yet implemented, Sorry :/`).goAway(2500)
        },
        onEditObservation() {
            // save a copy encase they cancel
            this.dataCopy = JSON.parse(JSON.stringify(this.observationData))
            this.editing = true
        },
        onCancelEdit() {
            // save a copy encase they cancel
            this.observationData = JSON.parse(JSON.stringify(this.dataCopy))
            this.editing = false
        },
        onSaveEdit() {
            this.editing = false
            // FIXME: call the backend with an update function
            if (this.observationData.observer) {
                this.storageObject.observer = this.observationData.observer
            }
            // (await endpoints).raw.set()
            this.$toasted.show(`Not yet implemented, Sorry :/`).goAway(2500)
        },
        onDelete() {
            this.editing = false
            this.resetData()
            this.$toasted.show(`Not yet implemented, Sorry :/`).goAway(2500)
        },
        resetData() {
            this.observationData = {
                videoId: this.$root.selectedVideo.$id,
                startTime: this.currentTime || 0,
                endTime: this.currentTime || 0,
                observer: window.storageObject.observer || "",
                label: this.$root.selectedLabel.name || "",
                labelConfidence: 0.99,
                isHuman: true,
            }
        },
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

<style lang='sass'>
div[data-fjio3y598t3hi2]
    .button-row
        --button-scale: 1.0
        
        .edit-button
            margin-right: 1rem
            background-color: gray 
            color: white
            transition: all ease 0.3s

        .cancel-button
            background-color: gray 
            color: white
            transition: all ease 0.3s

        .save-button
            transition: all ease 0.3s

        .delete-button
            width: 5rem
            background: var(--red)
            color: white
            transition: all ease 0.3s
        
        .add-container
            .add-button
                background-color: var(--blue)
                color: white
                transition: all ease 0.3s
                
            .upload-button
                opacity: 0
                width: fit-content
                position: absolute
                transition: all ease 0.3s
                background-color: var(--vue-green)
                
        &:hover
            .add-container
                .upload-button
                    opacity: 1
                    transform: translateY(-120%)
            

    .observation-widget
        padding: 1.7rem 2.4rem
        position: relative
        background: white
        width: 20rem
        border-radius: 1rem
        box-shadow: var(--shadow-1)
        
        .input-area
            width: 100%

            
    .add-observation-area
            
        .upload-observations-button
            opacity: 0
            transition: opacity ease 0.3s
            background-color: var(--vue-green)
            
        &:hover
            .upload-observations-button
                visibility: visible
                opacity: 1
            
        .new-observation-button, .upload-observations-button
            margin-right: 1rem
    
</style>