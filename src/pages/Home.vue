<template lang="pug">
    row.home-container(
        align-v='top'
        align-h="left"
        position="relative"
        width='fit-content'
        min-width="100vw"
        height="100vh"
        overflow="hidden"
        :class="{labelSelected: !!$root.selectedLabel}"
    )
        
        LabelPicker
        
        CenterStage
        
        VideoPicker
        
        UploadObservations.upload-button
        
</template>
<script>
let Fuse = require("fuse.js").default

export default {
    name: "HomePage",
    components: {
        CenterStage: require("../organisms/CenterStage").default,
        VideoPicker: require("../organisms/VideoPicker").default,
        LabelPicker: require("../organisms/LabelPicker").default,
        UploadObservations: require("../molecules/UploadObservations").default,
        Card: require("../molecules/Card").default,
    },
    created() {
        this.loadVideoRoute()
    },
    async mounted() {
        // wait till labels exist
        $root.labelsResolved.done || await $root.labelsResolved.promise
        this.loadVideoRoute()
    },
    watch: {
        // when the route changes
        $route(to, from){
            this.loadVideoRoute()
        }
    },
    methods: {
        loadVideoRoute() {
            // prefer the url data (its the source of truth)
            let {videoId, labelName} = this.$route.params
            // fill in missing url data
            videoId   || (videoId = this.$root.getVideoId())
            labelName || (labelName = (this.selectedLabel&&this.selectedLabel.name))
            
            // check if one of the things is new/different
            // update the root data as needed
            if (!this.selectedLabel && labelName) {
                // change the selected label
                this.$root.setSelectedLabelByName(labelName)
            }
            if (this.$root.getVideoId() != videoId) {
                this.$root.selectedVideo = this.$root.getCachedVideoObject(videoId)
            }
            
            // change the url only if needed
            if (videoId && labelName) {
                let newUrlHash = `#/video/${videoId}/${labelName}`
                if (window.location.hash != newUrlHash) {
                    window.location.href = newUrlHash
                }
            }
        }
    }
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