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
                @click="onNewTimestamp"
                icon="add"
                color="primary"
                raised
                tooltip="create a new timestamp"
                tooltipPosition="right"
            )
                | New Timestamp
        container(height="20px")
        transition(name="fade")
            column.timestamp-widget(min-height="37rem" position="relative" align-v="top")
                row(v-if="!noSegment() && !editing" style="position: absolute; font-size: 1rem; color: gray; right: 0.9rem; top: 0.7rem; cursor: pointer; opacity: 0.5;" @click="deSelectSegment")
                    | X
                    ui-tooltip(position="top" animation="fade")
                        | De-Select this segment
                row(v-if="noSegment()" style="position: absolute; width: 100%; height: 100%; font-size: 1.476rem; color: gray;")
                    | No Timestamp Selected
                column(v-if="!noSegment()" align-h="center" width="100%")
                    transition(name="fade")        
                        column(width="100%")
                            row.button-row(v-if="!noSegment() || editing" align-h="space-evenly" width="100%" margin-bottom="0.7rem" margin-top="0.5rem" :display="editing?'flex':'none'")
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
                            row.button-row(v-if="!noSegment() && !editing" align-h="space-evenly" width="100%" margin-bottom="0.7rem" margin-top="0.5rem" :display="(!noSegment() && !editing)?'flex':'none'")
                                ui-button.confirm-button(
                                    :style="`opacity: ${(editing) && $root.selectedSegment?0:1}; --button-color: ${hasRejected()? 'darkgray' : 'var(--soft-green)'}; min-width: 7rem; font-size: 0.7em; ${isOwner ? 'opacity: 0.3; box-shadow: 0 0 0 1px; color: gray;' : ''} `"
                                    @click="toggleConfirm"
                                    :tooltip="isOwner ? `(only someone else can confirm your timestamp)` : `Click if you agree with this timestamp`"
                                    icon="check"
                                )
                                    | {{hasConfirmed()? "Confirmed" : "Confirm"}}
                                //- spacer
                                container(flex-basis="10%" width="10%")
                                ui-button.reject-button(
                                    :style="`opacity: ${(editing) && $root.selectedSegment?0:1}; --button-color: ${hasConfirmed()? 'darkgray' : 'var(--red)'}; min-width: 7rem; font-size: 0.7em;${isOwner ? 'opacity: 0.3; box-shadow: 0 0 0 1px; color: gray;' : ''} `"
                                    @click="toggleReject"
                                    :tooltip="isOwner ? `(only someone else can reject your timestamp)` : `Click if you disagree with this timestamp`"
                                    icon="cancel"
                                )
                                    | {{hasRejected()? "Rejected" : "Reject"}}
                        
                container(height="10px")
                transition(name="fade")
                    row(v-if="!noSegment()" align-h="space-between" width="100%")
                        h5(style="font-size: 1.35rem;")
                            | Timestamp
                        container(position="relative")
                            ui-button.edit-button(
                                :style="`opacity: ${(!editing) && $root.selectedSegment?1:0}; width: 7rem;`"
                                @click="onEditTimestamp"
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
                    container.input-area(
                        v-if="!noSegment()"
                        margin-top="2rem"
                        @keydown="preventBubbling"
                        @click="handleClickToEdit"
                    )
                        row.start-time-wrapper
                            ui-textbox(
                                tabindex="1"
                                :disabled="!editing"
                                label="Start Time (seconds)"
                                :placeholder="`${timestampData.startTime}`"
                                v-model.number="timestampData.startTime"
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
                                :placeholder="`${timestampData.endTime}`"
                                v-model.number="timestampData.endTime"
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
                            UiAutocomplete(
                                tabindex="3"
                                ref="labelElement"
                                @select="onLabelChange"
                                @input="onLabelChange"
                                @paste="onLabelChange"
                                :invalid="!isValid.label"
                                v-model="timestampData.label"
                                :suggestions="Object.keys($root.labels)"
                                :disabled="!editing"
                                minChars=0
                                floating-label
                                label="Label"
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
                                v-model="timestampData.labelConfidence"
                            )
                        div(tabindex="-1")
                            UiTextbox(
                                tabindex="5"
                                :disabled="!editing"
                                floating-label
                                label="Comment"
                                v-model="timestampData.comment"
                            )
                        //- UiSwitch(:disabled="!editing" v-model="timestampData.isHuman" tabindex="6")
                        //-     | Observer Is Human
                        //- UiSwitch(:disabled="!editing" v-model="timestampData.confirmedBySomeone" v-if="!timestampData.isHuman" tabindex="7")
                        //-     | Confirmed By ≥1 Human
                        //- UiSwitch(:disabled="!editing" v-model="timestampData.rejectedBySomeone" v-if="!timestampData.isHuman" tabindex="8")
                        //-     | Rejected By ≥1 Human
                            
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
                                            v-model="timestampData.observer"
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
                                        v-model="timestampData.videoId"
                                    )
                                    ui-textbox(
                                        style="margin-top: -0.4rem"
                                        :disabled="true"
                                        floating-label
                                        label="Timestamp Id"
                                        tooltip="This is based on 'Created At'"
                                        v-model="timestampData.timestampId"
                                    )
                                    column(align-h="left" color="gray" width="100%" max-width="100%" overflow="auto")
                                        | customInfo
                                        JsonTree.json-tree(:data="timestampData.customInfo||{}")
</template>

<script>
import Vue from "vue"
import {quickLocalValidationCheck,coerceLabel,coerceObserver,observerIsValid,labelIsValid, Timestamp} from '../tooling/timestamp_tooling.js'
import { frontendDb } from '../tooling/database.js'
import { toKebabCase, toRepresentation } from '../tooling/basics.bundle.js'
import { getColor, isValidName, storageObject } from "../tooling/pure_tools.js"
import { trigger, globalEvents, everyTime } from '../tooling/events.js'

const timestampTooling = {quickLocalValidationCheck,coerceLabel,coerceObserver,observerIsValid,labelIsValid}

// triggers:
//    globalEvents.updateTimestampRequest
//    globalEvents.addLabelRequest
//    globalEvents.rootDeSelectTimestampRequest
//    globalEvents.rootRetriveLabelsRequest
//    globalEvents.deleteTimestampRequest

export default {
    props: [
        "currentTime",
        "jumpSegment",
    ],
    components: {
        JsonTree: require('vue-json-tree').default,
        UiSwitch: require("../atoms/UiSwitch").default,
        UiTextbox: require("../atoms/UiTextbox").default,
        UiAutocomplete: require("../atoms/UiAutocomplete").default,
    },
    data() {
        return {
            window,
            timestampData: new Timestamp(
                {}, 
                {
                    currentTime: this.currentTime,
                    observer: window.storageObject.observer,
                    recentLabel: window.storageObject.recentLabel,
                }
            ).coerce(),
            dataCopy: null,
            editing: false,
            dontShow: true,
            showOtherData: false,
        }
    },
    mounted() {
        window.TimestampEditor = this // debugging
        this.resetData()
        this.$root.videoInterface.wheneverVideoIsLoaded(this.wheneverVideoChanges)
    },
    computed: {
        isOwner() {
            return this.$root.email == this.timestampData.observer
        },
        humanTime() {
            return (new Date(this.timestampData.timestampId-0)).toString()
        },
        allValid() {
            // not("some of them are invalid")
            return !Object.values(this.isValid).some(value=>!value)
        },
        invalidFields() {
            return Object.entries(this.isValid).filter(([key, value])=>!value).map(([key, value])=>key)
        },
        isValid() {
            // its bad to mutate inside of a computed property, but whatever
            if (this.timestampData.endTime < this.timestampData.startTime) {
                this.timestampData.endTime = this.timestampData.startTime
            }
            return timestampTooling.quickLocalValidationCheck({
                timestampData: this.timestampData,
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
                    this.timestampData = new Timestamp(selectedSegment).coerce()
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
                this.onNewTimestamp()
                eventObj.preventDefault()
                eventObj.stopPropagation()
                return
            }
            if (eventObj.key == "l") {
                if (this.timestampData instanceof Object) {   
                    this.$refs.labelElement.focus()
                    eventObj.preventDefault()
                    eventObj.stopPropagation()
                    return
                }
            }
            if (eventObj.key == "m" && this.currentTime != null) {
                this.timestampData.endTime = this.currentTime.toFixed(3)
            }
            // NOTE: ctrl+s save is handled in "preventBubbling"
            if (eventObj.key == "s" && this.editing) {
                this.onSaveEdit()
            }
            if (eventObj.key == "c" && !this.editing && !this.noSegment()) {
                this.toggleConfirm()
            }
            if ((eventObj.key == "x") && !this.editing && !this.noSegment()) {
                this.toggleReject()
            }
        }
    },
    methods: {
        handleClickToEdit() {
            if (!this.editing) {
                this.$toasted.show(`Click the Edit button to make changes`).goAway(3500)
                this.$root.videoInterface.focusVideoPlayer()
            }
        },
        hasConfirmed() {
            return (this.timestampData.confirmedBy||[]).includes(this.$root.email)
        },
        hasRejected() {
            return (this.timestampData.rejectedBy||[]).includes(this.$root.email)
        },
        toggleConfirm() {
            if (!this.isOwner) {
                const shouldUnConfirm = this.hasConfirmed()
                if (shouldUnConfirm) {
                    this.timestampData.confirmedBy = this.timestampData.confirmedBy.filter(each=>each!=this.$root.email)
                } else {
                    this.timestampData.confirmedBy.push(this.$root.email)
                    this.timestampData.rejectedBy = this.timestampData.rejectedBy.filter(each=>each!=this.$root.email)
                }
                trigger(globalEvents.updateTimestampRequest, "TimestampEditor", this.timestampData)
                this.$forceUpdate()
            }
        },
        toggleReject() {
            if (!this.isOwner) {
                const shouldUnReject = this.hasRejected()
                if (shouldUnReject) {
                    this.timestampData.rejectedBy = this.timestampData.rejectedBy.filter(each=>each!=this.$root.email)
                } else {
                    this.timestampData.rejectedBy.push(this.$root.email)
                    this.timestampData.confirmedBy = this.timestampData.confirmedBy.filter(each=>each!=this.$root.email)
                }
                trigger(globalEvents.updateTimestampRequest, "TimestampEditor", this.timestampData)
                this.$forceUpdate()
            }
        },
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
            this.timestampData.label = timestampTooling.coerceLabel(this.timestampData.label)
            // the component is a bit buggy, so we have to do this
            this.$refs.labelElement.$el.querySelector("input").value = this.timestampData.label
        },
        onObserverChange() {
            this.timestampData.observer = timestampTooling.coerceObserver(this.timestampData.observer)
            // the component is a bit buggy, so we have to do this
            this.$refs.observerElement.$el.querySelector("input").value = this.timestampData.observer
        },
        preventBubbling(eventObject) {
            if (eventObject.altKey && eventObject.key == "s") {
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
        async onNewTimestamp() {
            if (!this.editing) {
                this.resetData()
                this.onEditTimestamp()
            }
        },
        onEditTimestamp() {
            // save a copy encase they cancel
            this.dataCopy = this.timestampData.toJSON()
            // this is redundant but whatever
            this.timestampData.label = timestampTooling.coerceLabel(this.timestampData.label)
            this.timestampData.videoId = this.$root.videoInterface.videoId
            this.timestampData.observer = this.$root.email
            this.editing = true
        },
        onCancelEdit() {
            // restore copy
            this.timestampData = new Timestamp(this.dataCopy)
            this.editing = false
        },
        async onSaveEdit() {
            console.log(`onSaveEdit`)
            if (timestampTooling.observerIsValid(this.timestampData.observer)) {    storageObject.observer    = this.timestampData.observer }
            if (timestampTooling.labelIsValid(this.timestampData.label)      ) {    storageObject.recentLabel = this.timestampData.label    }
            
            if (!this.allValid) {
                this.$toasted.show(`These fields are invalid: ${this.invalidFields}`).goAway(3500)
                return
            }
            
            try {
                const { success, errorMessage } = (await trigger(globalEvents.updateTimestampRequest, "TimestampEditor", this.timestampData))[0]
                if (!success) {
                    if (errorMessage) {
                        this.$toasted.show(errorMessage).goAway(2500)
                    }
                    return
                }
            } catch (error) {
                this.$toasted.show(errorMessage)
                console.log(error)
                console.log(error.stack)
            }
            // on success
            this.editing = false
            Vue.toasted.show(`Changes saved`).goAway(2500)
            trigger(globalEvents.addLabelRequest, "TimestampEditor", this.timestampData.label, this.timestampData.videoId)
            trigger(globalEvents.rootDeSelectTimestampRequest, "TimestampEditor")
            trigger(globalEvents.rootRetriveLabelsRequest, "TimestampEditor")
        },
        async onDelete() {
            console.log(`onDelete called`)
            this.editing = false
            let index = this.$root.selectedSegment.$displayIndex
            const timestampId = this.timestampData.timestampId
            if (timestampId) {
                await trigger(globalEvents.deleteTimestampRequest, "TimestampEditor", timestampId)
                this.resetData()
                this.$toasted.show(`Data has been deleted`).goAway(2500)
            }
            this.$root.selectedSegment = {}
            // go to next segment
            this.jumpSegment(index+1)
        },
        resetData() {
            this.editing = false
            this.dataCopy = {}
            this.timestampData = timestampTooling.createDefaultTimestampEntry(this.currentTime)
            this.timestampData.videoId = this.$root.videoInterface.videoId
        },
        setStartToCurrentTime() {
            this.timestampData.startTime = (this.currentTime||0).toFixed(3)
        },
        setEndToCurrentTime() {
            this.timestampData.endTime = (this.currentTime||0).toFixed(3)
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
            
    .timestamp-widget
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
        
        .confirm-button
            --button-color: var(--soft-green)
            flex-basis: 45%
        
        .reject-button
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

            
    .add-timestamp-area
            
        .upload-timestamps-button
            opacity: 0
            transition: opacity ease 0.3s
            background-color: var(--vue-green)
            
        &:hover
            .upload-timestamps-button
                visibility: visible
                opacity: 1
            
        .new-timestamp-button, .upload-timestamps-button
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