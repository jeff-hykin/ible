<template lang="pug">
    //- search for video
    ui-autocomplete.rounded-search(
        placeholder="Video name or YouTube URL"
        @focus="selectSearchText"
        @select="videoSelect"
        @paste="videoSelect"
        v-model="searchTerm"
        :suggestions="suggestions"
        minChars=0
    )
</template>

<script>
import * as videoTooling from '../tooling/video_tooling.js'

export default {
    components: {
    },
    data: ()=>({
        searchTerm: null,
        // TODO: remove or add back suggestions feature
        suggestions: [],
        notificationAlreadyShown: false,
    }),
    mounted() {
        // janky, but so is trying to pass them down all the way through the component tree
        // the issue is that $root.videoInterface is not reactive (the suggestions update, but the update wouldn't trigger a re-render)
        this.interval = setInterval(()=>{
            this.suggestions = (this.$root.videoInterface.getvideoPaths()||[]).filter(each=>each)
        }, 1000)
    },
    // unmount
    beforeDestroy() {
        clearInterval(this.interval)
    },
    watch: {
    },
    methods: {
        selectSearchText(eventObject) {
            eventObject.target.select()
        },
        videoSelect() {
            let videoSearchTerm = this.searchTerm.trim()
            if (!window.storageObject.videoPaths.includes(videoSearchTerm)) {
                if (!confirm("This doesn't seem to be one of the available videos, do you want me to try and load it anyways?")) {
                    return
                }
            }
            const videoInfo = videoTooling.searchTermToVideoInfo(videoSearchTerm)
            if (!videoInfo) {
                return
            }
            
            this.$root.videoInterface.goToThisVideo(videoInfo)
            this.$emit("submit", videoInfo) // triggers "hideSearchArea"
        },
    }
}
</script>

<style lang='sass' scoped>
.ui-textbox.rounded-search
    width: 25rem
    max-width: 25rem
    margin: 1.2rem
    padding: 0.7rem 2rem 1rem
    background-color: white
    border-radius: 2rem
    height: fit-content
    box-shadow: var(--shadow-1)

.ui-autocomplete-suggestion
    min-height: 2rem
    color: gray
</style>