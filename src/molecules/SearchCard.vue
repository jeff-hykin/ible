<template lang="pug">
    column.search-card(shadow=1 align-h="left" :background-color="label.color")
        h5 {{labelName}}
        column.stats
            | total number of clips: {{label.segmentCount||0}}
            br
            | total number of videos: {{label.videoCount||0}}
        column.show-samples(@click="selectLabel(labelName, label)")
            | See Clips ▲
</template>

<script>
export default {
    props: ["labelName", "label"],
    methods: {
        selectLabel(labelName, label) {
            const currentVideoId = this.$root.videoInterface.videoId
            label.name = labelName
            const videoIds = Object.keys(label?.videos||{})
            if (videoIds.length == 0) {
                this.$toasted.show(`No videos found for ${labelName}`).goAway(2500)
                return
            } else {
                let selectedVideoId = videoIds[0]
                // get it from the cache (auto-adds to cache if needed)
                this.$toasted.show(`Check the video tab 👍`).goAway(2500)
                
                if (selectedVideoId != currentVideoId) {
                    this.$root.videoInterface.goToThisVideo({ videoId: selectedVideoId })
                }
                // 
                // set selected=true for clicked label (and no others)
                // 
                    // const newLabelValues = {}
                    // for (const [key, value] of Object.entries(this.$root.labels)) {
                    //     if (key != labelName) {
                    //         newLabelValues[key] = {...value, selected: false}
                    //     } else {
                    //         newLabelValues[key] = {...value, selected: true}
                    //     }
                    // }
                    // this.$root.labels = newLabelValues
                    
                this.$root.push({labelName})
            }
        },
    }
}
</script>

<style lang="sass" scoped>
.search-card.good-column
    --card-radius: 0.7rem
    color: white 
    position: relative
    margin: 0.5rem 
    padding: 1.2rem 
    border-radius: var(--card-radius)
    width: 16rem
    min-width: fit-content
    border: 3px solid white
    flex-grow: 1
    transition: all 0.25s ease-out
    
    .stats
        width: max-content
        padding: 0.5rem
            
    .show-samples
        opacity: 0
        transition: opacity 0.25s ease-out
        top: 0 
        right: -0.5px  // fixes issue with clipping and showing 
        height: 2rem
        padding-left: 0.9rem
        padding-right: 0.4rem
        min-width: 6rem
        width: fit-content
        background: white
        border-bottom-left-radius: 0.6rem
        border-top-right-radius: calc(0.2 * var(--card-radius))
        position: absolute
        color: gray
        font-size: 10pt
    
    h5
        text-decoration: underline
        max-width: 80%
        overflow: auto
        scrollbar-width: none  // Firefox specific
        &::-webkit-scrollbar
            display: none //  Chrome, Safari and Opera specific
            
    &:hover
        box-shadow: var(--shadow-3) !important
        .show-samples
            transition: opacity 0.25s ease-out
            opacity: 1
            cursor: pointer
</style>