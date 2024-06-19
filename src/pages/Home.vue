<template lang="pug">
    row.home-container(
        align-v='top'
        align-h="left"
        position="relative"
        width='fit-content'
        min-width="100vw"
        height="100vh"
        overflow="hidden"
    )
        
        LabelPicker
        
        CenterStage
        
        VideoPicker
        
        UploadObservations.upload-button(ref="uploadObservations")
        
</template>
<script>
let Fuse = require("fuse.js").default
let _ = require("lodash")

export default {
    name: "HomePage",
    components: {
        CenterStage: require("../organisms/CenterStage").default,
        VideoPicker: require("../organisms/VideoPicker").default,
        LabelPicker: require("../organisms/LabelPicker").default,
        UploadObservations: require("../molecules/UploadObservations").default,
        Card: require("../molecules/Card").default,
    },
    mounted() {
        if (this.$root.routeData$.initWithHelp) {
            attempt(async ()=>{
                (await this.$child("uploadObservations", "helpModal")).open()
            })
        }
    },
}
</script>
<style lang="sass" scoped>

.home-container
    ::v-deep .nub
        --nub-size: 7rem
        font-size: 15pt
    
::v-deep .rounded-search
    width: 25rem
    max-width: 85%
    margin: 1.2rem
    padding: 0.7rem 2rem 1rem
    background-color: white
    border-radius: 2rem
    height: fit-content
    box-shadow: var(--shadow-1)
        
.upload-button
    position: fixed 
    bottom: 2rem
    right: 2rem

// fix a strange bug where the buttons in the 
// ObservationEditor are show overtop of the help model 
::v-deep .ui-button__content
    z-index: unset
    
    
</style>