<template lang="pug">
    column.upload-wrapper(akfdjguo3359gip)
        ui-fab.help-button(
            color="gray"
            icon="live_help"
            raised
            tooltip="Upload Format Requirements"
            tooltipPosition="left"
            @click="showHelp"
        )
        
        //- ui-fab(color="primary" icon="add" :size="size")
        ui-fab.upload-button(
            color="blue"
            raised
            tooltip="upload multiple observations"
            tooltipPosition="left"
        )
            ui-icon
                | cloud_upload
            ui-fileupload(name="file" type="secondary" @change="onUploadObservation" :multiple="true")
        
        //- help message
        portal(to="modal-popups")
            ui-modal.modal(fj20485gh93oi53g ref="helpModal" title="Example Upload" transition="scale-up")
                row(align-h="space-evenly" align-v="top")
                    column(align-v="top")
                        br 
                        | Try editing them! Then look at the code →
                        row(align-h="space-between" padding="2rem 1rem" align-v="top")
                            column
                                h5
                                    | Observation 1
                                container(height="1rem")
                                DummyObservation(:observationData="dummyData1")
                            container(min-width="3rem")
                            column
                                h5
                                    | Observation 2
                                container(height="1rem")
                                DummyObservation(:observationData="dummyData2")
                    
                    container(width="2rem")
                    
                    column(flex-basis="50%" max-width="31rem" align-v="top")
                        span
                            br
                            | To upload these observations
                            br
                            br
                            | 1. Create a file ending with
                            code
                                |  .json 
                            br
                            br
                            | 2. Then add the following text to that file.
                            br
                            br
                        JsonTree.json-tree(:data="[dummyData1, dummyData2]")
                        span
                            br
                            | 3. Then simply use the upload button to upload the file.
                            br
                            br
                            | The JSON file is just a list of each observation represented as a kind of dictionary.
        //- error message
        //- portal(to="modal-popups")
        //-     ui-modal.modal(fj20485gh93oi53g ref="errorModal" :title="errorPreview" transition="scale-up")
        //-             row(width="100%" align-h="space-between")
        //-                 ui-button.cancel-button(
        //-                     :style="`opacity: ${(uploadMessage && !uploadCanceled)?1:0}`"
        //-                     @click="quitUpload"
        //-                     icon="cancel"
        //-                 )
        //-                     | Cancel Upload
        //-                 ui-button.error-button(
        //-                     v-if="latestUploadErrors().length > 0"
        //-                     @click="downloadErrorLog"
        //-                     icon="sms_failed"
        //-                 )
        //-                     | Download Error Log
        //-             br
        //-             code(style="max-width: 80vw; overflow: auto; white-space: preserve; display: flex;")
        //-                 | {{latestUploadErrors()}}
    
</template>
<script>
const { humandReadableTime, download } = require("../utils.js")
const { frontendDb } = require("../iilvd-api.js")
import * as observationTooling from "../observation_tooling.js"
import * as yaml from 'yaml'

export default {
    components: {
        JsonTree: require('vue-json-tree').default,
        DummyObservation: require("../molecules/DummyObservation").default,
        Card: require("../molecules/Card").default,
    },
    data: ()=>({
        uploadMessage: null,
        uploadCanceled: false,
        errorPreview: "",
        latestUploadErrorsObject: {},
        dummyData1: {
            "createdAt": new Date().getTime() + `${Math.random()}`.slice(1),
            "type": "segment",
            "videoId": "FLK5-00l0r4",
            "startTime": 125.659,
            "endTime": 127.661,
            "observer": "CSCE636-Spring2021-WuAiSeDUdl-1",
            "isHuman": true,
            "observation": {
                "label": "happy",
                "labelConfidence": -0.99,
                "spacialInfo": {},
            },
            "customInfo": {},
        },
        dummyData2: {
            "createdAt": 1718116559422.8207249607261322,
            "videoId": "FLK5-00l0r4",
            "type": "segment",
            "startTime": 92.433,
            "endTime": 96.193,
            "observer": "CSCE636-Spring2021-WuAiSeDUdl-YOLOv3-v12",
            "isHuman": false,
            "confirmedBySomeone": false,
            "rejectedBySomeone": false,
            "observation": {
                "label": "sad",
                "labelConfidence": 0.85,
                "spacialInfo": {},
            },
            "customInfo": {},
        },
    }),
    computed: {
    },
    watch: {
        dummyData1: {
            deep: true,
            handler(...args) { this.dummyDataChange(...args) }
        },
        dummyData2: {
            deep: true,
            handler(...args) { this.dummyDataChange(...args) }
        },
    },
    methods: {
        latestUploadErrors() {
            return yaml.stringify(this.latestUploadErrorsObject)
        },
        numberOfErrors() {
            return Object.values(this.latestUploadErrorsObject).flat(2).length
        },
        quitUpload() {
            console.log(`canceling upload`)
            this.uploadMessage = null
            this.uploadCanceled = true
        },
        downloadErrorLog() {
            const errorLogText = this.latestUploadErrors()
            download("upload_error_log.txt", errorLogText)
            this.latestUploadErrorsObject = {}
        },
        dummyDataChange(dummyData) {
            if (dummyData.isHuman) {
                delete dummyData.confirmedBySomeone
                delete dummyData.rejectedBySomeone
            }
        },
        async showHelp() {
            this.$refs.helpModal.open()
        },
        async onUploadObservation(eventObject) {
            this.uploadCanceled = false
            let newObservations = []
            let observationMapping = {}
            // 
            // check the json of each file
            // 
            for (const [key, eachFile] of Object.entries(eventObject)) {
                const fileIndex = key-0
                const fileText = await eachFile.text()
                try {
                    // save the uploadTime to help with removing bad data
                    let index = -1
                    for (let each of yaml.parse(fileText)) {
                        each.uploadTime = `${(new Date())}`
                        newObservations.push(each)
                        observationMapping[newObservations.length-1] = {
                            fileIndex,
                            fileName: eachFile.name,
                            observationIndex: ++index,
                        }
                    }
                } catch (error) {
                    this.$toasted.show(`File Upload #${fileIndex} Error\nAre you sure the file is valid JSON?`, {
                        closeOnSwipe: false,
                        action: { text:'Close', onClick: (e, toastObject)=>{toastObject.goAway(0)} },
                    })
                    this.$toasted.show(`Processing Error`).goAway(2500)
                    this.$toasted.show(`Are you sure the file is valid JSON?`).goAway(16500)
                    return
                }
            }
            // 
            // start uploading all the observations
            // 
            try {
                
                // NOTE: yes uploading in bulk would be faster. This code is leftover from when it uploaded to a very slow server
                //       and it was important to have a progress bar. It was also so that errors could be seen immediately
                //       and so that errors to each observation could gathered instead of only stopping at the first one
                // a complete refactor of this (while keeping helpful error messages) would be nice
                
                
                this.$toasted.show(`each file at least seems to be valid JSON 👍 `).goAway(6500)
                
                this.uploadCanceled = false
                this.uploadMessage = "starting upload"
                this.latestUploadErrorsObject = {}
                this.errorPreview = ""
                const size = newObservations.length
                const startTime = (new Date()).getTime()
                let timeRemaining = null
                let errorCount = 0
                
                for (const [key, value] of Object.entries(newObservations)) {
                    const observationNumber = key-0+1
                    const {fileIndex, fileName, observationIndex } = observationMapping[key]
                    const fileIndexString = eventObject.length > 1? `File ${fileIndex} of ${eventObject.length}\n\n`:""
                    const timeRemainingString = timeRemaining?" (~ "+humandReadableTime(timeRemaining)+" remaining)":""
                    this.uploadMessage = `${fileIndexString}Uploading ${observationNumber} of ${size}${timeRemainingString}\n`
                    value.observation.label = toKebabCase(`${value.observation.label}`.toLowerCase())
                    try {
                        const frontendErrorMessages = observationTooling.validateObservations([value])[0]
                        if (frontendErrorMessages.length > 0) {
                            throw Error(yaml.stringify(frontendErrorMessages))
                        }
                        await frontendDb.setObservation(value)
                    } catch (error) {
                        if (error.message.match(/Message: Failed to fetch/)) {
                            this.$toasted.show(`Server took too long to respond, and is probably still processing data<br>(Assuming upload will be a success)`).goAway(6500)
                            continue
                        }
                        errorCount++
                        const alreadyShown = this.numberOfErrors() > 0
                        const whichFile = `file ${fileIndex} ${JSON.stringify(fileName).slice(1,-1)}`
                        const whichObservation = `observation ${observationIndex}`
                        this.latestUploadErrorsObject[whichFile] = this.latestUploadErrorsObject[whichFile]||{}
                        let messages
                        try { messages = yaml.parse(error.message) } catch (error) {}
                        if (!(messages instanceof Array)) {
                            messages = [error.message]
                        }
                        const isFirstErrorForObservation = !(this.latestUploadErrorsObject[whichFile][whichObservation] instanceof Array)
                        const hasACreatedAtValue = !!value.createdAt
                        if (isFirstErrorForObservation && hasACreatedAtValue) {
                            messages = [ `The observation with: "createdAt": ${JSON.stringify(value.createdAt)}\n`, ...messages ]
                        }
                        this.latestUploadErrorsObject[whichFile][whichObservation] = [
                            ...(this.latestUploadErrorsObject[whichFile][whichObservation]||[]),
                            ...messages.map(each=>`\n${each}`),
                        ]
                        // otherwise Vue doesn't seem to know its been modified
                        this.latestUploadErrorsObject = this.latestUploadErrorsObject
                        this.errorPreview = `There were some (${this.numberOfErrors()}) errors:`
                        if (this.numberOfErrors()>0 && !alreadyShown) {
                            this.$refs.errorModal.open()
                        }
                    }
                    const changeInTime = (new Date()).getTime() - startTime
                    const changeInCount = observationNumber
                    const rate = changeInTime/changeInCount
                    const remainingObservationCount = size - observationNumber
                    timeRemaining = remainingObservationCount * rate
                    
                    if (this.uploadCanceled === true) {
                        this.$toasted.show(`Canceling remaining upload`).goAway(2500)
                        this.quitUpload()
                        return
                    }
                }
                
                window.dispatchEvent(new CustomEvent("SegmentDisplay-updateSegments"))
                this.$toasted.show(`Upload Finished`, {
                    closeOnSwipe: false,
                    action: { text:'Close', onClick: (e, toastObject)=>{toastObject.goAway(0)} },
                })
            } catch (error) {
                this.quitUpload()
                throw error
            }
            this.quitUpload()
        },
    }
}

</script>
<style lang="sass" scoped>
    
.modal[fj20485gh93oi53g=fj20485gh93oi53g]
    font-size: 14pt
    z-index: 99999
    
    ::v-deep .ui-modal__container
        width: fit-content
        width: -moz-fit-content
        
    .json-tree
        min-width: 100%
        max-width: 100%
        
        ::v-deep .json-tree-sign
            visibility: hidden
    
.upload-wrapper
    padding: 1rem
    --size: 3.9rem
    
    h5
        text-decoration: underline
        color: gray
    
    .upload-button
        transition: all ease 0.3s
        background-color: var(--blue)
        position: relative
        color: white
        max-width: var(--size)
        min-width: var(--size)
        max-height: var(--size)
        min-height: var(--size)
        
        ::v-deep .ui-fileupload
            opacity: 0
            position: absolute
            max-width: var(--size)
            min-width: var(--size)
            max-height: var(--size)
            min-height: var(--size)
            padding: 0
            transform: translate(-73%, -29%)
        
        ::v-deep .ui-fileupload, ::v-deep .ui-fileupload__icon
            color: white
            background-color: transparent
    
    .help-button
        transition: all ease 0.3s
        background-color: gray
        color: white
        margin-bottom: 1rem
        opacity: 0
        max-width: var(--size)
        min-width: var(--size)
        max-height: var(--size)
        min-height: var(--size)
    
    &:hover
        .help-button
            opacity: 1

.cancel-button.ui-button
        --button-color: darkgray
        --text-color: white
        background-color: var(--button-color) 
        color: var(--text-color) !important
        transition: all ease 0.3s
        
        ::v-deep .ui-button__icon
            color: var(--text-color)
                
        &:hover
            background-color: var(--button-color) !important
            color: white
            box-shadow: var(--shadow-3) 
        
.error-button.ui-button
    --button-color: var(--red)
    --text-color: white
    background-color: var(--button-color) 
    color: var(--text-color) !important
    transition: all ease 0.3s
    
    ::v-deep .ui-button__icon
        color: var(--text-color)
            
    &:hover
        background-color: var(--button-color) !important
        color: white
        box-shadow: var(--shadow-3) 
</style>