<template lang="pug">
    column.upload-wrapper(akfdjguo3359gip)
        ui-fab.help-button(
            color="gray"
            icon="live_help"
            raised
            tooltip="Help with file upload"
            tooltipPosition="left"
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
        ui-modal(ref="helpModal" title="Help" transition="scale-up")
            | Lets look at an example of two observations
            row(align-h="space-between")
                DummyObservation(
                    videoId="FLK5-00l0r4"
                    startTime="92.433"
                    endTime="96.193"
                    observer="deleteme"
                    :isHuman="true"
                    label="Happy"
                    labelConfidence="0.99"
                )
                

    
</template>
<script>


export default {
    components: {
        DummyObservation: require("../molecules/DummyObservation").default,
    },
    methods: {
        async onUploadObservation(eventObject) {
            let fileText = await eventObject[0].text()
            try {
                let newObservations = JSON.parse(fileText)
            } catch (error) {
                this.$toasted.show(`Processing Error`).goAway(2500)
                this.$toasted.show(`Are you sure the file is valid JSON?`).goAway(6500)
                return
            }
            try {
                let newUuids = await (await endpoints).addMultipleSegments(newObservations)
            } catch (error) {
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