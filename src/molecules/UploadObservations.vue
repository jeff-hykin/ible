<template lang="pug">
    column.upload-wrapper(akfdjguo3359gip)
        ui-fab.help-button(
            color="gray"
            icon="live_help"
            raised
            tooltip="Help with file upload"
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
        
        transition(name="fade")
            Card(v-if="uploadMessage && !uploadCanceled" position="fixed" bottom="2rem" right="2rem" z-index="999" width="30rem" max-width="30rem" overflow="scroll" white-space="pre" shadow="3" background="whitesmoke")
                | {{uploadMessage}}
                br
                ui-button.cancel-button(
                    @click="quitUpload"
                    icon="cancel"
                )
                    | Cancel
        
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
    
</template>
<script>
const { humandReadableTime } = require("../utils")

export default {
    components: {
        JsonTree: require('vue-json-tree').default,
        DummyObservation: require("../molecules/DummyObservation").default,
        Card: require("../molecules/Card").default,
    },
    data: ()=>({
        uploadMessage: null,
        uploadCanceled: false,
        dummyData1: {
            "videoId": "FLK5-00l0r4",
            "type": "segment",
            "startTime": 125.659,
            "endTime": 127.661,
            "observer": "CSCE636-Spring2021-WuAiSeDUdl-1",
            "isHuman": true,
            "observation": {
                "label": "happy",
                "labelConfidence": -0.99
            }
        },
        dummyData2: {
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
                "labelConfidence": 0.85
            }
        },
    }),
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
        quitUpload() {
            console.log(`canceling upload`)
            this.uploadMessage = null
            this.uploadCanceled = true
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
            for (const [key, eachFile] of Object.entries(eventObject)) {
                const fileNumber = key-0+1
                let fileText = await eachFile.text()
                let newObservations
                try {
                    newObservations = JSON.parse(fileText)
                    // save the uploadTime to help with removing bad data
                    for (let each of newObservations) {
                        each.uploadTime = `${(new Date())}`
                    }
                } catch (error) {
                    this.$toasted.show(`Processing Error`).goAway(2500)
                    this.$toasted.show(`Are you sure the file is valid JSON?`).goAway(16500)
                    return
                }
                
                this.$toasted.show(`👍 file seems to be valid JSON`).goAway(6500)
                try {
                    this.uploadCanceled = false
                    this.uploadMessage = "starting upload"
                    let errors = ""
                    const size = newObservations.length
                    const startTime = (new Date()).getTime()
                    let timeRemaining = null
                    
                    for (const [key, value] of Object.entries(newObservations)) {
                        const observationNumber = key-0+1
                        const fileNumberString = eventObject.length > 1? `File ${fileNumber} of ${eventObject.length}\n\n`:""
                        const timeRemainingString = timeRemaining?" (~ "+humandReadableTime(timeRemaining)+" remaining)":""
                        this.uploadMessage = `${fileNumberString}Uploading ${observationNumber} of ${size}${timeRemainingString}\n` + errors
                        try {
                            await (await this.backend).addObservation(value)
                        } catch (error) {
                            if (error.message.match(/Message: Failed to fetch/)) {
                                this.$toasted.show(`Server too long to respond, and is probably still processing data<br>(Assuming upload will be a success)`).goAway(2500)
                                continue
                            }
                            errors += `problem with #${observationNumber}:\n`+error.message+"\n"
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
                    if (eventObject.length > 1) {
                        this.$toasted.show(`File Upload #${fileNumber} Success!`, {
                            closeOnSwipe: false,
                            action: { text:'Close', onClick: (e, toastObject)=>{toastObject.goAway(0)} },
                        })
                    } else {
                        this.$toasted.show(`Upload Success! Refresh to see changes`, {
                            closeOnSwipe: false,
                            action: { text:'Close', onClick: (e, toastObject)=>{toastObject.goAway(0)} },
                        })
                    }
                } catch (error) {
                    if (error.message.match(/Message: Failed to fetch/)) {
                        this.$toasted.show(`Server too long to respond, and is probably still processing data<br>(Assuming upload will be a success)`).goAway(2500)
                        continue
                    }
                    console.debug(`uploading error is:`,error)
                    this.$toasted.show(`The Server said there was an error:`).goAway(2500)
                    this.$toasted.show(`Message: ${error.message}<br>`, {
                        closeOnSwipe: false,
                        action: { text:'Close', onClick: (e, toastObject)=>{toastObject.goAway(0)} },
                    })
                    // if arguments are long
                    const maxLength = 2000
                    if (JSON.stringify(error.arguments).length > maxLength) {
                        error.arguments = JSON.stringify(error.arguments).slice(0,maxLength)
                    }
                    this.$root.bigMessage(`Full Details:\n\n${JSON.stringify(error,0,3)}`)
                    this.quitUpload()
                    return
                }
            }
            if (eventObject.length > 1) {
                this.$toasted.show(`All files uploaded! Refresh to see changes`, {
                    closeOnSwipe: false,
                    action: { text:'Close', onClick: (e, toastObject)=>{toastObject.goAway(0)} },
                })
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
        
    &:hover
        .help-button
            opacity: 1

</style>