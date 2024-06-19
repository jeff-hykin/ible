<template lang="pug">
    //- search for video
    ui-autocomplete.rounded-search(
        placeholder="Video name or YouTube URL"
        @focus="selectSearchText"
        @keydown.enter="videoSelect"
        @change="videoSelect"
        @paste="videoSelect"
        v-model="searchTerm"
        :suggestions="suggestions"
    )
</template>

<script>
import { frontendDb } from '../iilvd-api.js'
import * as videoTooling from '../tooling/video_tooling.js'
import { storageObject } from '../utils.js'

// make sure cachedVideoSearchTerms exists as an Array
storageObject.cachedVideoSearchTerms = storageObject.cachedVideoSearchTerms || []

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
        // add some default suggestions
        this.suggestions = storageObject.cachedVideoSearchTerms
        backend.getLocalVideoNames().then(names=>{
            this.suggestions = names
            storageObject.cachedVideoSearchTerms = names
        })
        this.interval = setInterval(()=>{
            backend.getLocalVideoNames().then(names=>{
                this.suggestions = names
                storageObject.cachedVideoSearchTerms = names
            }).catch(error=>{})
        }, 5000)
    },
    // unmount
    beforeDestroy() {
        clearInterval(this.interval)
    },
    watch: {
        suggestions(newValue) {
            // save video id suggestions to local storage
            storageObject.cachedVideoSearchTerms = newValue
        },
        // when the search term changes
        async searchTerm(value) {
            const minNumberOfCharactersBeforeSearch = 1
            // if no search term
            if (typeof value != 'string' || value.trim().length <= minNumberOfCharactersBeforeSearch) {
                // load all suggestions from storage if search isn't long enough
                this.suggestions = storageObject.cachedVideoSearchTerms
            } else {
                // add results from the database
                let possibleVideoIds = await frontendDb.getVideoIds()
                this.suggestions = [...new Set(possibleVideoIds.concat(this.suggestions))]
            }
        }
    },
    methods: {
        selectSearchText(eventObject) {
            eventObject.target.select()
        },
        extractVideoIdIfPossible(newVideoId) {
            try {
                if (newVideoId.match(/.*www\.youtube\.com/)) {
                    return newVideoId.match(/.+(?:\?|&)v=(.{11})/)[1]
                } else if (newVideoId.match(/.*youtu\.be\//)) {
                    return newVideoId.match(/.*youtu.be\/(.{11})/)[1]
                }
            } catch (error) {}
            return newVideoId
        },
        videoSelect() {
            let videoSearchTerm = this.searchTerm.trim()
            const videoInfo = videoTooling.searchTermToVideoInfo(videoSearchTerm)
            if (!videoInfo) {
                return
            }
            
            if (videoInfo.hasProblem && !videoInfo.isYoutubeUrl) {
                // FIXME
                this.$toasted.show(`This video seems to be missing a video ID`, {
                    keepOnHover:true,
                    action: [
                        {
                            text : 'Load Anyways',
                            onClick : (eventData, toastObject) => {
                                this.notificationAlreadyShown = false
                                this.$root.routeData$.videoId = newVideoId
                                toastObject.goAway(100)
                            },
                        },
                    ]
                })
            } else {
                // pushing searched video route
                this.$root.routeData$.videoInfo = videoInfo
                // emit video event
                this.$emit("goToVideo")
                // sometimes the changes are not detected
                this.$root.routeData$ = {...this.$root.routeData$}
            }
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