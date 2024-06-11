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
        column.add-container(:opacity="editing?0:1")
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
            column.observation-widget(min-height="38rem" position="relative")
                row(v-if="!noSegment() && !editing" style="position: absolute; font-size: 1rem; color: gray; right: 0.9rem; top: 0.7rem; cursor: pointer; opacity: 0.5;" @click="deSelectSegment")
                    | X
                    ui-tooltip(position="top" animation="fade")
                        | De-Select this segment
                row(v-if="noSegment()" style="position: absolute; width: 100%; height: 100%; font-size: 1.476rem; color: gray;")
                    | No Observation Selected
                
                transition(name="fade")
                    row(v-if="!noSegment()" align-h="space-between" width="100%")
                        h5
                            | Observation
                        ui-button.edit-button(
                            v-if="(!editing) && $root.selectedSegment"
                            @click="onEditObservation"
                            icon="edit"
                            color="primary"
                        )
                            | Edit
                transition(name="fade")        
                    row.button-row(v-if="!noSegment() || editing" align-h="space-evenly" width="100%" margin-bottom="0.7rem" margin-top="0.5rem")
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
                transition(name="fade")
                    ui-button.cancel-button(
                        v-if="editing" 
                        @click="onCancelEdit"
                        icon="cancel"
                        color="accent"
                    )
                        | Cancel
                
                transition(name="fade")    
                    container.input-area(v-if="!noSegment()" margin-top="2rem" @keydown="preventBubbling")
                        row.start-time-wrapper
                            ui-textbox(
                                :disabled="!editing"
                                label="Start Time (seconds)"
                                :placeholder="`${observationData.startTime}`"
                                v-model.number="observationData.startTime"
                                :invalid="!isValid.startTime"
                                type="number"
                            )
                            ui-button.set-to-current-time-button(
                                v-if="editing"
                                @click="setStartToCurrentTime"
                                tabindex="-1"
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
                                :invalid="!isValid.endTime"
                                type="number"
                            )
                            ui-button.set-to-current-time-button(
                                v-if="editing"
                                @click="setEndToCurrentTime"
                                tabindex="-1"
                                color="primary"
                                size="small"
                                tooltip="Set end time to current video time"
                                tooltipPosition="top"
                            )
                                ui-icon
                                    | skip_next
                        
                        ui-textbox(
                            ref="labelElement"
                            :disabled="!editing"
                            floating-label
                            label="Label"
                            :invalid="!isValid.label"
                            v-model="observationData.label"
                            @change="onLabelChange"
                            @input="onLabelChange"
                        )
                        ui-textbox(
                            :disabled="!editing"
                            floating-label
                            label="Label Confidence"
                            :invalid="!isValid.labelConfidence"
                            v-model="observationData.labelConfidence"
                        )
                        ui-textbox(
                            :disabled="!editing"
                            floating-label
                            label="Observer (username)"
                            :invalid="!isValid.observer"
                            v-model="observationData.observer"
                        )
                        ui-textbox(
                            :disabled="!editing"
                            floating-label
                            label="Video Id"
                            :invalid="!isValid.videoId"
                            v-model="observationData.videoId"
                        )
                        UiSwitch(:disabled="!editing" v-model="observationData.isHuman")
                            | Observer Is Human
                        UiSwitch(:disabled="!editing" v-model="observationData.confirmedBySomeone" v-if="!observationData.isHuman")
                            | Confirmed By ≥1 Human
                        UiSwitch(:disabled="!editing" v-model="observationData.rejectedBySomeone" v-if="!observationData.isHuman")
                            | Rejected By ≥1 Human
                        ui-textbox(
                            :disabled="true"
                            floating-label
                            label="Created At"
                            v-model="humanTime"
                        )
                        ui-textbox(
                            :disabled="true"
                            floating-label
                            label="Id"
                            tooltip="This is based on 'Created At'"
                            v-model="observationData.createdAt"
                        )
</template>

<script>
import { toKebabCase } from '../string.js'
import { isLocalVideo } from '../observation_tooling.js'
let { backend, backendHelpers, fakeBackend } = require('../iilvd-api.js')
let { getColor, currentFixedSizeOfYouTubeVideoId, labelConfidenceCheck, isValidName, storageObject } = require("../utils")
const createUuid = ()=>new Date().getTime() + `${Math.random()}`.slice(1)
export default {
    props: [
        "currentTime",
        "duration",
        "jumpSegment",
    ],
    components: {
        UiSwitch: require("../atoms/UiSwitch").default,
    },
    data: ()=>({
        observationData: {
            createdAt: createUuid(),
            videoId: null,
            startTime: 0,
            endTime: 0,
            observer: "",
            label: "",
            labelConfidence: 0.99,
            isHuman: true,
            confirmedBySomeone: false,
            rejectedBySomeone: false,
            customInfo: {},
        },
        uuidOfSelectedSegment: null,
        dataCopy: null,
        editing: false,
        dontShow: true,
    }),
    computed: {
        
    },
    mounted() {
        window.Editor = this // debugging
        window.player = window.player || { currentTime: 0 }
        this.resetData()
    },
    computed: {
        humanTime() {
            return (new Date(this.observationData.createdAt)).toString()
        },
        // TODO: check this before submitting to backend
        allValid() {
            // not("some of them are invalid")
            return !Object.values(this.valid).some(value=>!value)
        },
        isValid() {
            let observationData = this.observationData
            return {
                startTime: observationData.startTime >= 0 && observationData.startTime < observationData.endTime,
                endTime: observationData.endTime > 0 && observationData.startTime < observationData.endTime && observationData.endTime <= window.player.duration,
                label: isValidName(observationData?.label),
                observer: isValidName(observationData?.observer),
                labelConfidence: labelConfidenceCheck(observationData.labelConfidence),
                videoId: isString(observationData.videoId) && (observationData.videoId.length == currentFixedSizeOfYouTubeVideoId || isLocalVideo(observationData.videoId)),
            }
        }
    },
    rootHooks: {
        watch: {
            "routeData$.videoId": function() {
                if (this.editing) {
                    this.dataCopy = {}
                    this.editing = false
                    this.resetData()
                }
            },
            // when the selected segment changes
            selectedSegment() {
                let selectedSegment = this.$root.selectedSegment
                console.debug(`selectedSegment is:`,selectedSegment)
                if (selectedSegment instanceof Object) {
                    this.uuidOfSelectedSegment = selectedSegment.$uuid
                    this.observationData = {
                        createdAt: selectedSegment.createdAt,
                        videoId:   selectedSegment.videoId,
                        startTime: selectedSegment.startTime,
                        endTime:   selectedSegment.endTime,
                        observer:  selectedSegment.observer,
                        isHuman:   selectedSegment.isHuman,
                        confirmedBySomeone: selectedSegment.confirmedBySomeone,
                        rejectedBySomeone: selectedSegment.rejectedBySomeone,
                        label:           (selectedSegment.observation||{}).label,
                        labelConfidence: (selectedSegment.observation||{}).labelConfidence,
                        customInfo:      selectedSegment.customInfo,
                    }
                }
            },
            selectedVideo() {
                this.resetData()
            }
        },
    },
    windowListeners: {
        keydown(eventObj) {
            if (eventObj.key == "n") {
                this.onNewObservation()
                eventObj.preventDefault()
                eventObj.stopPropagation()
                return
            }
            if (eventObj.key == "l") {
                if (this.observationData instanceof Object) {   
                    this.$refs.labelElement.focus()
                    eventObj.preventDefault()
                    eventObj.stopPropagation()
                    return
                }
            }
            if (eventObj.key == "m") {
                this.observationData.endTime = window.player.currentTime.toFixed(3)
            }
            if (eventObj.key == "s" && this.editing) {
                this.onSaveEdit()
            }
            // NOTE: ctrl+s save is handled in "preventBubbling"
        }
    },
    methods: {
        onLabelChange() {
            // enforce naming convention
            this.observationData.label = toKebabCase(this.observationData.label.toLowerCase())
        },
        onObserverChange() {
            // enforce naming convention
            this.observationData.observer = toKebabCase(this.observationData.observer.toLowerCase())
        },
        preventBubbling(eventObject) {
            if (eventObject.ctrlKey && eventObject.key == "s") {
                this.onSaveEdit()
            }
            eventObject.stopPropagation()
        },
        noSegment() {
            return !(this.$root.selectedSegment instanceof Object) && !this.editing
        },
        deSelectSegment() {
            this.$root.selectedSegment = null
        },
        async onNewObservation() {
            if (!this.editing) {
                this.dataCopy = {}
                this.resetData()
                this.observationData.startTime = window.player.currentTime.toFixed(3)
                this.observationData.endTime = (window.player.currentTime+0.01).toFixed(3)
                this.observationData.label = storageObject.recentLabel || this.$root?.routeData$?.labelName || "example-label"
                this.uuidOfSelectedSegment = new Date().getTime() + `${Math.random()}`.slice(1)
                this.onEditObservation()
            }
        },
        onEditObservation() {
            // save a copy encase they cancel
            this.dataCopy = JSON.parse(JSON.stringify(this.observationData))
            // instantly convert to kebab case if somehow it isn't already
            this.observationData.label = toKebabCase(`${this.observationData.label}`.toLowerCase())
            this.editing = true
        },
        onCancelEdit() {
            // save a copy encase they cancel
            this.observationData = JSON.parse(JSON.stringify(this.dataCopy))
            this.editing = false
        },
        async onSaveEdit() {
            console.log(`onSaveEdit`)
            if (typeof this.observationData.observer == "string" && this.observationData.observer.length > 0) {
                storageObject.observer = this.observationData.observer
            }
            if (typeof this.observationData.label == "string" && this.observationData.label.length > 0) {
                storageObject.recentLabel = this.observationData.label
            }
            if (!this.allValid) {
                this.$toasted.show(`Some fields are invalid (should be marked red)`).goAway(2500)
            }
            
            // convert to numbers 
            this.observationData.startTime -= 0
            this.observationData.endTime -= 0
            
            let observationEntry = {
                createdAt: this.observationData.createdAt,
                type: "segment",
                videoId:            this.observationData.videoId,
                startTime:          this.observationData.startTime,
                endTime:            this.observationData.endTime,
                observer:           this.observationData.observer,
                isHuman:            this.observationData.isHuman,
                confirmedBySomeone: this.observationData.confirmedBySomeone,
                rejectedBySomeone:  this.observationData.rejectedBySomeone,
                observation: {
                    label:           this.observationData.label,
                    labelConfidence: this.observationData.labelConfidence,
                    spacialInfo: {},
                },
                customInfo: this.observationData.customInfo,
            }
            const isNewObervation = !this.uuidOfSelectedSegment
            if (isNewObervation) {
                // if it is a new observation
                this.uuidOfSelectedSegment = `${Math.random()}`
            }
            // 
            // save on storageObject
            // 
            this.$root.addLabel(observationEntry.observation.label)
            const observationsForVideo = storageObject[this.observationData.videoId]||{}
            observationsForVideo[this.uuidOfSelectedSegment] = observationEntry
            storageObject[this.observationData.videoId] = observationsForVideo
            
            try {
                await backendHelpers.setObservation({uuidOfSelectedSegment, observation: observationEntry})
                await fakeBackend.setObservation(observationEntry)
            } catch (error) {
                this.$toasted.show(`There was an error on the database`).goAway(5500)
                console.error("# ")
                console.error("# BACKEND ERROR")
                console.error("# ")
                console.error(error.stack)
                console.error(error)
                console.error("# ")
                this.$toasted.show(error.message.slice(0,65), {
                    closeOnSwipe: false,
                    action: { text:'Close', onClick: (e, toastObject)=>{toastObject.goAway(0)} },
                })
                this.$toasted.show(`(Full error log in the console)`).goAway(6500)
                // throw error
            }
            this.editing = false
            this.$toasted.show(`Changes saved`).goAway(2500)
            // create label if it doesn't exist
            this.$root.addLabel(this.observationData.label, observationEntry.videoId)
            this.$root.selectedSegment = observationEntry
            
            // tell segments they need to get the data from the backend again
            window.dispatchEvent(new CustomEvent("SegmentDisplay-updateSegments"))
            
            this.$root.retrieveLabels()
        },
        async onDelete() {
            this.editing = false
            let index = this.$root.selectedSegment.$displayIndex
            if (this.uuidOfSelectedSegment) {
                backendHelpers.deleteObservation({uuidOfSelectedSegment: this.uuidOfSelectedSegment})
                this.$root.selectedVideo.keySegments = [...this.$root.selectedVideo.keySegments].filter(each=>each.$uuid != this.uuidOfSelectedSegment)
                this.resetData()
                window.dispatchEvent(new CustomEvent("SegmentDisplay-updateSegments"))
                this.$toasted.show(`Data has been deleted`).goAway(2500)
            }
            this.$root.selectedSegment = {}
            // go to next segment
            this.jumpSegment(index+1)
        },
        resetData() {
            this.$root.selectedSegment = null
            this.observationData = {
                createdAt: new Date().getTime() + `${Math.random()}`.slice(1),
                videoId: (this.$root.selectedVideo)&&this.$root.selectedVideo.$id,
                startTime: window.player.currentTime || 0,
                endTime: window.player.currentTime || window.player.duration || 0,
                observer: window.storageObject.observer || "",
                label: this.$root?.routeData$?.labelName||"",
                labelConfidence: 0.95,
                confirmedBySomeone: false,
                rejectedBySomeone:  false,
                isHuman: true,
            }
        },
        setStartToCurrentTime() {
            this.observationData.startTime = window.player.currentTime.toFixed(3)
        },
        setEndToCurrentTime() {
            this.observationData.endTime = window.player.currentTime.toFixed(3)
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
        transition: all ease 0.3s
        
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