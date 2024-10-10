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
        
        ui-fab.help-button(
            color="gray"
            icon="download"
            raised
            tooltip="Download All Data"
            tooltipPosition="left"
            @click="downloadAllData"
        )
        
        //- ui-fab(color="primary" icon="add" :size="size")
        ui-fab.upload-button(
            color="blue"
            raised
            tooltip="upload multiple timestamps"
            tooltipPosition="left"
        )
            ui-icon
                | cloud_upload
            ui-fileupload(name="file" type="secondary" @change="onUploadTimestamp" :multiple="true")
        
        //- help message
        portal(to="modal-popups")
            ui-modal.modal(fj20485gh93oi53g ref="helpModal" title="Example Upload" transition="scale-up")
                | If you're unsure about what to upload, try downloading the data first.
                br
                | The download is a zip of csv files, including instructions about their contents
                br
                | To upload new data, modify the csv file contents (keep the names the same), and then select all of them for upload.
                
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
import { humandReadableTime, download } from "../tooling/pure_tools.js"
import { frontendDb } from "../tooling/database.js"
import * as timestampTooling from "../tooling/timestamp_tooling.js"
import * as yaml from 'yaml'
import * as zipTools from "../tooling/zip_tooling.js"
import * as videoTooling from "../tooling/video_tooling.js"
import * as vueTooling from "../tooling/vue_tooling.js"
import { trigger, globalEvents, everyTime } from '../tooling/events.js'
import readme from "../tooling/readme.js"

// TASKS:
    // add good error handling for uploads that are problematic
export default {
    components: {
        JsonTree: require('vue-json-tree').default,
        DummyTimestamp: require("../molecules/DummyTimestamp").default,
        Card: require("../molecules/Card").default,
    },
    data: ()=>({
        uploadMessage: null,
        uploadCanceled: false,
        errorPreview: "",
        latestUploadErrorsObject: {},
        dummyData1: {
            "timestampId": new Date().getTime() + `${Math.random()}`.slice(1),
            "type": "segment",
            "videoId": "FLK5-00l0r4",
            "startTime": 125.659,
            "endTime": 127.661,
            "observer": "CSCE636-Spring2021-WuAiSeDUdl-1",
            "isHuman": true,
            "label": "happy",
            "labelConfidence": -0.99,
            "spacialInfo": {},
            "customInfo": {},
        },
        dummyData2: {
            "timestampId": 1718116559422.8207249607261322,
            "videoId": "FLK5-00l0r4",
            "type": "segment",
            "startTime": 92.433,
            "endTime": 96.193,
            "observer": "CSCE636-Spring2021-WuAiSeDUdl-YOLOv3-v12",
            "isHuman": false,
            "confirmedBySomeone": false,
            "rejectedBySomeone": false,
            "label": "sad",
            "labelConfidence": 0.85,
            "spacialInfo": {},
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
        async downloadAllData() {
            const entries = await frontendDb.getTimestamps({where: [], returnObject: false})
            const videos = await frontendDb.getAllVideos()
            
            download(
                "data.ible.zip",
                await zipTools.createZipOfTextFiles({
                    "readme.md": readme,
                    "timestamps.typed.csv": await timestampTooling.timestampsToCsv(entries),
                    "videos.typed.csv": await videoTooling.videosToCsv(videos),
                    "video_review_status.typed.csv": await videoTooling.videoObserverTableToCsv(videos),
                })
            )
        },
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
        async onUploadTimestamp(eventObject) {
            try {
                
                this.uploadCanceled = false
                let newTimestamps = []
                let timestampMapping = {}
                // 
                // check the json of each file
                // 
                const files = {}
                for (const [key, eachFile] of Object.entries(eventObject)) {
                    const fileIndex = key-0
                    const fileText = await eachFile.text()
                    const fileName = eachFile.name
                    files[fileName] = fileText
                }
                
                if (files["videos.typed.csv"]) {
                    videoTooling.videosCsvToActions(files["videos.typed.csv"]).then(frontendDb.executeVideoActions)
                }
                
                if (files["video_review_status.typed.csv"]) {
                    videoTooling.videoObserverTableCsvToActions(files["video_review_status.typed.csv"]).then(frontendDb.executeVideoActions)
                }
                
                if (files["timestamps.typed.csv"]) {
                    timestampTooling.timestampsCsvToActions(files["timestamps.typed.csv"]).then(frontendDb.executeTimestampActions)
                }
                
                this.$toasted.show(`Upload Finished`, {
                    closeOnSwipe: false,
                    action: { text:'Refresh Page for changes to take effect', onClick: (e, toastObject)=>{ window.location.reload() } },
                }).goAway(8500)
                
            } catch (error) {
                vueTooling.showLongMessage(`Sorry there was an error :/ the error was:\n\n${error.stack}`)
            }
            
            // 
            // start uploading all the timestamps
            // 
            // try {
                
            //     // NOTE: yes uploading in bulk would be faster. This code is leftover from when it uploaded to a very slow server
            //     //       and it was important to have a progress bar. It was also so that errors could be seen immediately
            //     //       and so that errors to each timestamp could gathered instead of only stopping at the first one
            //     // a complete refactor of this (while keeping helpful error messages) would be nice
                
                
            //     this.$toasted.show(`each file at least seems to be valid JSON 👍 `).goAway(6500)
                
            //     this.uploadCanceled = false
            //     this.uploadMessage = "starting upload"
            //     this.latestUploadErrorsObject = {}
            //     this.errorPreview = ""
            //     const size = newTimestamps.length
            //     const startTime = (new Date()).getTime()
            //     let timeRemaining = null
            //     let errorCount = 0
                
            //     for (const [key, value] of Object.entries(newTimestamps)) {
            //         const timestampNumber = key-0+1
            //         const {fileIndex, fileName, timestampIndex } = timestampMapping[key]
            //         const fileIndexString = eventObject.length > 1? `File ${fileIndex} of ${eventObject.length}\n\n`:""
            //         const timeRemainingString = timeRemaining?" (~ "+humandReadableTime(timeRemaining)+" remaining)":""
            //         this.uploadMessage = `${fileIndexString}Uploading ${timestampNumber} of ${size}${timeRemainingString}\n`
            //         value.label = toKebabCase(`${value.label}`.toLowerCase())
            //         try {
            //             const frontendErrorMessages = timestampTooling.validateTimestamps([value])[0]
            //             if (frontendErrorMessages.length > 0) {
            //                 throw Error(yaml.stringify(frontendErrorMessages))
            //             }
            //             await frontendDb.setTimestamp(value)
            //         } catch (error) {
            //             if (error.message.match(/Message: Failed to fetch/)) {
            //                 this.$toasted.show(`Server took too long to respond, and is probably still processing data<br>(Assuming upload will be a success)`).goAway(6500)
            //                 continue
            //             }
            //             errorCount++
            //             const alreadyShown = this.numberOfErrors() > 0
            //             const whichFile = `file ${fileIndex} ${JSON.stringify(fileName).slice(1,-1)}`
            //             const whichTimestamp = `timestamp ${timestampIndex}`
            //             this.latestUploadErrorsObject[whichFile] = this.latestUploadErrorsObject[whichFile]||{}
            //             let messages
            //             try { messages = yaml.parse(error.message) } catch (error) {}
            //             if (!(messages instanceof Array)) {
            //                 messages = [error.message]
            //             }
            //             const isFirstErrorForTimestamp = !(this.latestUploadErrorsObject[whichFile][whichTimestamp] instanceof Array)
            //             const hasAtimestampIdValue = !!value.timestampId
            //             if (isFirstErrorForTimestamp && hasAtimestampIdValue) {
            //                 messages = [ `The timestamp with: "timestampId": ${JSON.stringify(value.timestampId)}\n`, ...messages ]
            //             }
            //             this.latestUploadErrorsObject[whichFile][whichTimestamp] = [
            //                 ...(this.latestUploadErrorsObject[whichFile][whichTimestamp]||[]),
            //                 ...messages.map(each=>`\n${each}`),
            //             ]
            //             // otherwise Vue doesn't seem to know its been modified
            //             this.latestUploadErrorsObject = this.latestUploadErrorsObject
            //             this.errorPreview = `There were some (${this.numberOfErrors()}) errors:`
            //             if (this.numberOfErrors()>0 && !alreadyShown) {
            //                 this.$refs.errorModal.open()
            //             }
            //         }
            //         const changeInTime = (new Date()).getTime() - startTime
            //         const changeInCount = timestampNumber
            //         const rate = changeInTime/changeInCount
            //         const remainingTimestampCount = size - timestampNumber
            //         timeRemaining = remainingTimestampCount * rate
                    
            //         if (this.uploadCanceled === true) {
            //             this.$toasted.show(`Canceling remaining upload`).goAway(2500)
            //             this.quitUpload()
            //             return
            //         }
            //     }
            //     this.$root.videoInterface.updateKeySegments()
            //     this.$toasted.show(`Upload Finished`, {
            //         closeOnSwipe: false,
            //         action: { text:'Close', onClick: (e, toastObject)=>{toastObject.goAway(0)} },
            //     })
            // } catch (error) {
            //     this.quitUpload()
            //     throw error
            // }
            // this.quitUpload()
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