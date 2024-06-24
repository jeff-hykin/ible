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
        column.add-container
            ui-button.add-button(
                :style="`opacity: ${editing?0:1}`"
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
            column.observation-widget(min-height="37rem" position="relative" align-v="top")
                row(v-if="!noSegment() && !editing" style="position: absolute; font-size: 1rem; color: gray; right: 0.9rem; top: 0.7rem; cursor: pointer; opacity: 0.5;" @click="deSelectSegment")
                    | X
                    ui-tooltip(position="top" animation="fade")
                        | De-Select this segment
                row(v-if="noSegment()" style="position: absolute; width: 100%; height: 100%; font-size: 1.476rem; color: gray;")
                    | No Observation Selected
                column(v-if="!noSegment()" align-h="center" width="100%")
                    transition(name="fade")        
                        row.button-row(v-if="!noSegment() || editing" align-h="space-evenly" width="100%" margin-bottom="0.7rem" margin-top="0.5rem")
                            ui-button.save-button(
                                :style="`opacity: ${editing?1:0}`"
                                @click="onSaveEdit"
                                icon="save"
                                color="primary"
                            )
                                | Save
                            //- spacer
                            container(flex-basis="10%" width="10%")
                            ui-button.delete-button(
                                :style="`opacity: ${editing?1:0}`"
                                @click="onDelete"
                                icon="delete"
                                color="red"
                            )
                                | Delete
                container(height="10px")
                transition(name="fade")
                    row(v-if="!noSegment()" align-h="space-between" width="100%")
                        h5(style="font-size: 1.35rem;")
                            | Observation
                        container(position="relative")
                            ui-button.edit-button(
                                :style="`opacity: ${(!editing) && $root.selectedSegment?1:0}; width: 7rem;`"
                                @click="onEditObservation"
                                icon="edit"
                                color="primary"
                            )
                                | Edit
                            transition(name="fade")
                                ui-button.cancel-button(
                                    :style="`position: absolute; opacity: ${editing?1:0}; pointer-events: ${editing?'all':'none'};`"
                                    @click="onCancelEdit"
                                    icon="cancel"
                                    color="accent"
                                )
                                    | Cancel
                transition(name="fade")    
                    container.input-area(v-if="!noSegment()" margin-top="2rem" @keydown="preventBubbling")
                        row.start-time-wrapper
                            ui-textbox(
                                tabindex="1"
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
                                tabindex="2"
                                :disabled="!editing"
                                ref="endTimeElement"
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
                            ui-tooltip(v-if="editing" position="left" animation="fade" :trigger="$refs.endTimeElement")
                                | {{"&gt start, ≤ duration"}}
                        
                        div(tabindex="-1")
                            ui-tooltip(v-if="editing" position="left" animation="fade" :trigger="$refs.labelElement")
                                | all lowercase letters, numbers, dashes and periods
                            ui-textbox(
                                tabindex="3"
                                ref="labelElement"
                                :disabled="!editing"
                                floating-label
                                label="Label"
                                :invalid="!isValid.label"
                                v-model="observationData.label"
                                @change="onLabelChange"
                                @input="onLabelChange"
                            )
                        div(tabindex="-1")
                            ui-tooltip(v-if="editing" position="left" animation="fade" :trigger="$refs.labelConfidenceElement")
                                | a value between -1 and 1
                            ui-textbox(
                                tabindex="4"
                                ref="labelConfidenceElement"
                                :disabled="!editing"
                                floating-label
                                label="Label Confidence"
                                :invalid="!isValid.labelConfidence"
                                v-model="observationData.labelConfidence"
                            )
                        UiSwitch(:disabled="!editing" v-model="observationData.isHuman" tabindex="6")
                            | Observer Is Human
                        UiSwitch(:disabled="!editing" v-model="observationData.confirmedBySomeone" v-if="!observationData.isHuman" tabindex="7")
                            | Confirmed By ≥1 Human
                        UiSwitch(:disabled="!editing" v-model="observationData.rejectedBySomeone" v-if="!observationData.isHuman" tabindex="8")
                            | Rejected By ≥1 Human
                            
                        div(style="min-height: 4rem")
                        column(
                            v-if="!noSegment()"
                            align-h="center"
                            width="90%"
                            background="whitesmoke" 
                            border-radius="1rem"
                            padding="1rem"
                            :overflow="showOtherData?'auto':'hidden'" 
                            @mouseenter="doShowOtherData" 
                            @mouseleave="hideOtherData"
                            position="absolute"
                            bottom="1rem"
                            left="5%"
                            box-shadow="0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3)"
                        )
                            span(style="width: 12rem; text-align: center; color: var(--gray); padding: 0.5rem; border-radius: 1rem;")
                                | other data
                            transition(name="quick-fade")
                                column(align-h="left" :style="`transition: all ease 0.3s; opacity: ${showOtherData?1:0}; max-height: ${showOtherData?'40rem':0}; height: fit-content; max-width: 100%; min-width: 100%; `")
                                    div(style="margin-top: 0.5rem")
                                    div
                                        //- ui-tooltip(v-if="editing" position="left" animation="fade" :trigger="$refs.observerElement")
                                            | all lowercase letters, numbers, dashes and periods
                                        ui-textbox(
                                            :disabled="true"
                                            ref="observerElement"
                                            floating-label
                                            label="Observer"
                                            :invalid="!isValid.observer"
                                            v-model="observationData.observer"
                                            @change="onObserverChange"
                                            @input="onObserverChange"
                                        )
                                    ui-textbox(
                                        :disabled="true"
                                        floating-label
                                        label="Created At"
                                        v-model="humanTime"
                                    )
                                    ui-textbox(
                                        :disabled="true"
                                        floating-label
                                        label="Video Id"
                                        :invalid="!isValid.videoId"
                                        v-model="observationData.videoId"
                                    )
                                    ui-textbox(
                                        style="margin-top: -0.4rem"
                                        :disabled="true"
                                        floating-label
                                        label="Id"
                                        tooltip="This is based on 'Created At'"
                                        v-model="observationData.observationId"
                                    )
                                    column(align-h="left" color="gray" width="100%" max-width="100%" overflow="auto")
                                        | customInfo
                                        JsonTree.json-tree(:data="observationData.customInfo||{}")
</template>

<script>
import { toKebabCase, toRepresentation } from '../string.js'
import * as observationTooling from '../observation_tooling.js'
import { frontendDb } from '../iilvd-api.js'
import { getColor, isValidName, storageObject } from "../utils"

export default {
    props: [
        "currentTime",
        "jumpSegment",
    ],
    components: {
        JsonTree: require('vue-json-tree').default,
        UiSwitch: require("../atoms/UiSwitch").default,
    },
    data() {
        const defaultObservationData = observationTooling.coerceObservation(
            observationTooling.createDefaultObservationEntry()
        )
        return {
            observationData: defaultObservationData,
            dataCopy: null,
            editing: false,
            dontShow: true,
            showOtherData: false,
        }
    },
    mounted() {
        window.Editor = this // debugging
        this.resetData()
        this.$root.videoInterface.wheneverVideoIsLoaded(this.wheneverVideoChanges)
    },
    computed: {
        humanTime() {
            return (new Date(this.observationData.observationId-0)).toString()
        },
        allValid() {
            // not("some of them are invalid")
            return !Object.values(this.isValid).some(value=>!value)
        },
        isValid() {
            console.debug(`this.observationData.isHuman is:`,this.observationData.isHuman)
            return observationTooling.quickLocalValidationCheck({
                observationData: this.observationData,
                videoDuration: this.$root.videoInterface?.player?.duration,
            })
        },
    },
    rootHooks: {
        watch: {
            // when the selected segment changes
            selectedSegment() {
                let selectedSegment = this.$root.selectedSegment
                console.log(`selectedSegment is:`,selectedSegment)
                if (selectedSegment instanceof Object) {
                    this.observationData = observationTooling.coerceObservation(
                        selectedSegment
                    )
                }
            },
            selectedVideo() {
                this.resetData()
            }
        },
    },
    windowListeners: {
        keydown(eventObj) {
            console.debug(`eventObj is:`,eventObj)
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
            if (eventObj.key == "m" && this.currentTime != null) {
                this.observationData.endTime = this.currentTime.toFixed(3)
            }
            if (eventObj.key == "s" && this.editing) {
                this.onSaveEdit()
            }
            // NOTE: ctrl+s save is handled in "preventBubbling"
        }
    },
    methods: {
        wheneverVideoChanges() {
            if (this.editing) {
                this.resetData()
            }
        },
        doShowOtherData() {
            this.showOtherData = true
        },
        hideOtherData() {
            this.showOtherData = false
        },
        onLabelChange() {
            this.observationData.label = observationTooling.coerceLabel(this.observationData.label)
            // the component is a bit buggy, so we have to do this
            this.$refs.labelElement.$el.querySelector("input").value = this.observationData.label
        },
        onObserverChange() {
            this.observationData.observer = observationTooling.coerceObserver(this.observationData.observer)
            // the component is a bit buggy, so we have to do this
            this.$refs.observerElement.$el.querySelector("input").value = this.observationData.observer
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
                this.resetData()
                this.onEditObservation()
            }
        },
        onEditObservation() {
            // save a copy encase they cancel
            this.dataCopy = JSON.parse(JSON.stringify(this.observationData))
            // instantly convert to kebab case if somehow it isn't already
            this.observationData.label = toKebabCase(`${this.observationData.label}`.toLowerCase())
            this.observationData.videoId = this.$root.videoInterface.videoId
            this.observationData.observer = this.$root.email
            this.editing = true
        },
        onCancelEdit() {
            // save a copy encase they cancel
            this.observationData = JSON.parse(JSON.stringify(this.dataCopy))
            this.editing = false
        },
        async onSaveEdit() {
            console.log(`onSaveEdit`)
            if (observationTooling.observerIsValid(this.observationData.observer)) {    storageObject.observer    = this.observationData.observer }
            if (observationTooling.labelIsValid(this.observationData.label)      ) {    storageObject.recentLabel = this.observationData.label    }
            
            if (!this.allValid) {
                this.$toasted.show(`Some fields are invalid`).goAway(2500)
                return
            }
            
            const observationEntry = this.observationData = observationTooling.coerceObservation(this.observationData)
            
            // 
            // update external things
            // 
            this.$root.addLabel(observationEntry.label, observationEntry.videoId)
            
            // 
            // send request to database
            // 
            try {
                await frontendDb.setObservation(observationEntry, {withCoersion:true})
                
                // on success
                this.editing = false
                this.$toasted.show(`Changes saved`).goAway(2500)
                this.deSelectSegment()
                this.$root.retrieveLabels()
                
                // this should cause the segment display to update
                this.$root.videoInterface.keySegments = [
                    ...this.$root.videoInterface.keySegments.filter(each=>each.observationId != observationEntry.observationId),
                    observationEntry,
                ]
            } catch (error) {
                this.$toasted.show(`There was an error on the database`).goAway(5500)
                console.error("# ")
                console.error("# Database ERROR")
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
        },
        async onDelete() {
            console.log(`onDelete called`)
            this.editing = false
            let index = this.$root.selectedSegment.$displayIndex
            const observationId = this.observationData.observationId
            if (observationId) {
                await frontendDb.deleteObservation({uuidOfSelectedSegment: observationId })
                this.resetData()
                // this should cause the segment display to update
                this.$root.videoInterface.keySegments = [
                    ...this.$root.videoInterface.keySegments.filter(each=>
                        each.observationId != observationId
                    ),
                ]
                this.$toasted.show(`Data has been deleted`).goAway(2500)
            }
            this.$root.selectedSegment = {}
            // go to next segment
            this.jumpSegment(index+1)
        },
        resetData() {
            this.editing = false
            this.dataCopy = {}
            this.observationData = this.observationEntryToData(
                observationTooling.createDefaultObservationEntry(this.currentTime)
            )
            this.observationData.videoId = this.$root.videoInterface.videoId
        },
        setStartToCurrentTime() {
            this.observationData.startTime = (this.currentTime||0).toFixed(3)
        },
        setEndToCurrentTime() {
            this.observationData.endTime = (this.currentTime||0).toFixed(3)
        },
        observationEntryToData(observationEntry) {
            observationEntry = observationTooling.coerceObservation(observationEntry)
            return {
                observationId:      observationEntry.observationId,
                videoId:            observationEntry.videoId,
                startTime:          observationEntry.startTime,
                endTime:            observationEntry.endTime,
                observer:           observationEntry.observer,
                isHuman:            observationEntry.isHuman,
                confirmedBySomeone: observationEntry.confirmedBySomeone,
                rejectedBySomeone:  observationEntry.rejectedBySomeone,
                customInfo:         observationEntry.customInfo,
                label:              observationEntry.label,
                labelConfidence:    observationEntry.labelConfidence,
                spacialInfo:        observationEntry.spacialInfo||{},
            }
        }
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
        padding: 1.7rem 2.4rem
        padding-top: 0.5rem
        position: relative
        background: white
        width: 20rem
        border-radius: 1rem
        box-shadow: var(--shadow-1)
        
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
    
    .quick-fade-enter-active, .quick-fade-leave-active
        transition: all 0.7s
    
    .quick-fade-enter, .quick-fade-leave-to
        opacity: 0

.json-tree
    min-width: 100%
    max-width: 100%
    
    .json-tree-sign
        visibility: hidden
    
</style>