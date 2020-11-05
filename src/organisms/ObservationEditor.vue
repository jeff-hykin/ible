<template lang="pug">
    column(
        data-fjio3y598t3hi2
        width="min-content"
        margin-bottom="2rem"
        align-self="flex-start"
        position="relative"
        min-width="20rem"
        min-height="44vh"
    )
        column.add-container(v-show="!editing")
            ui-button.add-button(
                @click="onNewObservation"
                icon="add"
                color="primary"
                raised
                tooltip="create a new observation"
                tooltipPosition="right"
            )
                | New Observation
        container(height="20px")
        transition(name="fade")
            column.observation-widget(v-show="$root.selectedSegment || editing")
                row(align-h="space-between" width="100%")
                    h5
                        | Observation
                    ui-button.edit-button(
                        v-if="(!editing) && $root.selectedSegment"
                        @click="onEditObservation"
                        icon="edit"
                        color="primary"
                    )
                        | Edit
                    
                row.button-row(align-h="space-evenly" width="100%" margin-bottom="0.7rem" margin-top="0.5rem" v-if="editing")
                    ui-button.save-button(
                        v-if="editing"
                        @click="onSaveEdit"
                        icon="save"
                        color="primary"
                    )
                        | Save
                    //- spacer
                    container(flex-basis="10%" width="10%" v-if="editing")
                    ui-button.delete-button(
                        v-if="editing"
                        @click="onDelete"
                        icon="delete"
                        color="red"
                    )
                        | Delete
                ui-button.cancel-button(
                    v-if="editing"
                    @click="onCancelEdit"
                    icon="cancel"
                    color="accent"
                )
                    | Cancel
                
                container.input-area(margin-top="2rem")
                    row.start-time-wrapper
                        ui-textbox(
                            :disabled="!editing"
                            label="Start Time (seconds)"
                            :placeholder="`${observationData.startTime}`"
                            v-model.number="observationData.startTime"
                            type="number"
                        )
                        ui-button.set-to-current-time-button(
                            v-if="editing"
                            @click="setStartToCurrentTime"
                            color="primary"
                            size="small"
                            tooltip="Set start time to current video time"
                            tooltipPosition="top"
                        )
                            ui-icon
                                | skip_next
                    row.end-time-wrapper
                        ui-textbox(
                            :disabled="!editing"
                            label="End Time (seconds)"
                            :placeholder="`${observationData.endTime}`"
                            v-model.number="observationData.endTime"
                            type="number"
                        )
                        ui-button.set-to-current-time-button(
                            v-if="editing"
                            @click="setEndToCurrentTime"
                            color="primary"
                            size="small"
                            tooltip="Set end time to current video time"
                            tooltipPosition="top"
                        )
                            ui-icon
                                | skip_next
                    
                    ui-textbox(
                        :disabled="!editing"
                        floating-label
                        label="Label"
                        :invalid="!observationData.label.match(/^[a-zA-Z0-9]+$/)"
                        v-model="observationData.label"
                    )
                    ui-textbox(
                        :disabled="!editing"
                        floating-label
                        label="Label Confidence"
                        v-model="observationData.labelConfidence"
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
                        label="Video Id"
                        v-model="observationData.videoId"
                    )
                    UiSwitch(:disabled="!editing" v-model="observationData.isHuman")
                        | Observer Is Human
</template>

<script>
import { endpoints } from '../iilvd-api'
let { getColor } = require("../utils")

export default {
    components: {
        UiSwitch: require("../atoms/UiSwitch").default,
    },
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
        dontShow: true,
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
            },
            selectedVideo() {
                this.resetData()
            }
        },
    },
    methods: {
        async onNewObservation() {
            this.dataCopy = {}
            this.uuidOfSelectedSegment = null
            this.$toasted.show(`New observation created (all data from previous observation was copied)`).goAway(6500)
            // start editing the newly created observation
            this.onEditObservation()
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
        async onSaveEdit() {
            this.editing = false
            if (this.observationData.observer) {
                storageObject.observer = this.observationData.observer
            }
            
            // convert to numbers 
            this.observationData.startTime -= 0
            this.observationData.endTime -= 0
            
            // if saving an edit
            if (this.uuidOfSelectedSegment) {
                (await endpoints).raw.set({
                    keyList:[this.uuidOfSelectedSegment],
                    from: "observations",
                    to: {
                        videoId:   this.observationData.videoId,
                        startTime: this.observationData.startTime,
                        endTime:   this.observationData.endTime,
                        observer:  this.observationData.observer,
                        isHuman:   this.observationData.isHuman,
                        observation: {
                            label: this.observationData.label,
                            labelConfidence: this.observationData.labelConfidence,
                        },
                    },
                })
            // if saving something new
            } else {
                this.uuidOfSelectedSegment = await (await endpoints).addSegmentObservation({
                    videoId: this.observationData.videoId,
                    startTime: this.observationData.startTime,
                    endTime: this.observationData.endTime,
                    observer: this.observationData.observer,
                    isHuman: this.observationData.isHuman,
                    observation: {
                        label: this.observationData.label,
                        labelConfidence: this.observationData.labelConfidence,
                    }
                })
            }
            
            
            // create label if it doesn't exist
            if (!this.$root.labels[this.observationData.label]) {
                this.$root.labels[this.observationData.label] = {
                    color: getColor(this.observationData.label),
                    segmentCount: 1,
                    videoCount: 1,
                    videos: [ this.observationData.videoId ],
                    selected: true,
                }
            }
             
            // show the label 
            this.$root.labels[this.observationData.label] = {...this.$root.labels[this.observationData.label], selected: true}
            
            // switch to the label that was just added
            if (this.$root.selectedLabel != this.observationData.label || this.$root.getVideoId() != this.observationData.videoId ) {
                this.$toasted.show(`New label added, refreshing to retrive data`).goAway(2500)
                this.$router.push({ name: 'video', params: { videoId: this.observationData.videoId, labelName: this.observationData.label } })
                setTimeout(() => {
                    ()=>window.location.reload()
                }, 2500)
            } else {
                this.$toasted.show(`Data has been set, refresh to confirm`).goAway(2500)
            }
        },
        async onDelete() {
            this.editing = false
            this.resetData()
            if (this.uuidOfSelectedSegment) {
                (await endpoints).raw.delete({
                    keyList:[this.uuidOfSelectedSegment],
                    from: "observations",
                })
                this.$toasted.show(`Data has been deleted, refresh to confirm`).goAway(2500)
            }
        },
        resetData() {
            this.observationData = {
                videoId: (this.$root.selectedVideo)&&this.$root.selectedVideo.$id,
                startTime: this.$root.currentTime || 0,
                endTime: this.$root.currentTime || 0,
                observer: window.storageObject.observer || "",
                label: (this.$root.selectedLabel)&&this.$root.selectedLabel.name || "",
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
        setStartToCurrentTime() {
            this.observationData.startTime = this.$root.currentTime
        },
        setEndToCurrentTime() {
            this.observationData.endTime = this.$root.currentTime
        },
    },
}
</script>

<style lang='sass'>

div[data-fjio3y598t3hi2]
    transition: all ease-in 1.9s
    
    h5
        color: gray
        border-bottom: 1px darkgray solid
        
    .add-container
        position: relative
        padding-top: 1rem
        
        .add-button
            width: max-content
            background-color: var(--blue)
            color: white
            transition: all ease 0.3s
            
    .observation-widget
        transition: all ease 0.3s
        
        --button-color: darkgray
        
        .ui-button
            transition: all ease 0.3s
            font-size: 11pt
            height: 1.7rem
            background-color: transparent
            background-color: var(--button-color) 
            color: white
            
            &:hover
                background-color: var(--button-color) !important
                color: white
                box-shadow: var(--shadow-3)
            
            .ui-icon
                font-size: 1rem
        
        .edit-button
            --button-color: darkgray
            
            transition: all ease 0.3s
            font-size: 11pt
            height: 1.7rem
            background-color: transparent
            color: var(--button-color)
            border: 1px solid var(--button-color)
            
            &:hover
                background-color: var(--button-color) !important
                color: white

        .cancel-button
            --button-color: darkgray
            border-bottom: 1px darkgray solid
            flex-basis: 100%
            min-height: 1.7rem
            width: 100%

        .save-button
            --button-color: var(--material-blue)
            flex-basis: 45%

        .delete-button
            --button-color: var(--red)
            flex-basis: 45%


    .observation-widget
        padding: 1.7rem 2.4rem
        position: relative
        background: white
        width: 20rem
        border-radius: 1rem
        box-shadow: var(--shadow-1)
        
        .start-time-wrapper,.end-time-wrapper
            width: 100%
            position: relative
            
            .ui-textbox
                width: 100%
            
            &:hover 
                .set-to-current-time-button
                    opacity: 1
                    transition: opacity ease 0.2s
            
            .set-to-current-time-button
                position: absolute
                opacity: 0
                right: 4px
                margin-bottom: 6px
                background-color: darkgray
                
                .ui-icon
                    transform: rotate(90deg)
        
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