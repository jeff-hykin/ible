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
            ui-fileupload(name="file" type="secondary" @change="onUploadObservation")
        
        //- help message
        ui-modal.modal(ref="helpModal" title="Example Upload" transition="scale-up")
            row(align-h="space-evenly" align-v="top")
                column(align-v="top")
                    br
                    | 1. Here are two observations (they can be edited)
                    row(align-h="space-between" padding="2rem 1rem")
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
                        | 2. To upload these, create a file ending with
                        code
                            |  .json 
                        br
                        br
                        | 3. Then add the following text to that file.
                        br
                        br
                    JsonTree.json-tree(:data="[dummyData1, dummyData2]")
                    span
                        br
                        | 4. Then simply use the upload button to upload the file
                        br
                        br
                        | The JSON file is just a list of each observation represented as a kind of dictionary.
    
</template>
<script>


export default {
    components: {
        JsonTree: require('vue-json-tree').default,
        DummyObservation: require("../molecules/DummyObservation").default,
    },
    data: ()=>({
        dummyData1: {
            "videoId": "FLK5-00l0r4",
            "type": "segment",
            "startTime": 125.659,
            "endTime": 127.661,
            "observer": "jimbob",
            "isHuman": true,
            "observation": {
                "label": "Happy",
                "labelConfidence": 0.99
            }
        },
        dummyData2: {
            "videoId": "FLK5-00l0r4",
            "type": "segment",
            "startTime": 92.433,
            "endTime": 96.193,
            "observer": "YOLO-v4-001",
            "isHuman": false,
            "confirmedBySomeone": false,
            "rejectedBySomeone": false,
            "observation": {
                "label": "Sad",
                "labelConfidence": 0.85
            }
        },
    }),
    watch: {
        dummyData1: {
            deep: true,
            handler() {
                console.log(`dummyData1 changed`)
            }
        }
    },
    methods: {
        async showHelp() {
            this.$refs.helpModal.open()
        },
        async onUploadObservation(eventObject) {
            let fileText = await eventObject[0].text()
            let newObservations, newUuids
            try {
                newObservations = JSON.parse(fileText)
                // save the uploadTime to help with removing bad data
                for (let each of newObservations) {
                    each.uploadTime = `${(new Date())}`
                }
            } catch (error) {
                this.$toasted.show(`Processing Error`).goAway(2500)
                this.$toasted.show(`Are you sure the file is valid JSON?`).goAway(6500)
                return
            }
            try {
                newUuids = await (await endpoints).addMultipleSegments(newObservations)
            } catch (error) {
                console.debug(`error is:`,error)
                // TODO: improve this error
                this.$toasted.show(`Server Error`).goAway(2500)
                this.$toasted.show(`This probably means one of the observations was invalid (bad start/end time, no 'observer', etc)`).goAway(6500)
                this.$toasted.show(`In the future this error message will hopefully be improved to be more specific`).goAway(6500)
                return
            }
            this.$toasted.show(`Success! Refresh to see changes`).goAway(2500)
        },
    }
}

</script>
<style lang="sass" scoped>

.upload-wrapper
    padding: 1rem
    --size: 3.9rem
    
    h5
        text-decoration: underline
        color: gray
    
    .modal
        font-size: 14pt
        
        ::v-deep .ui-modal__container
            width: fit-content
            
        .json-tree
            min-width: 100%
            
            ::v-deep .json-tree-sign
                visibility: hidden
    
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

</style>