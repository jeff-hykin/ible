<template lang="pug">
    //- search for video
    ui-textbox.rounded-search(
        placeholder="Enter YouTube url or Video ID"
        @focus="selectSearchText"
        @keydown.enter="videoSelect"
        @change="videoSelect"
        @paste="videoSelect"
        v-model="searchTerm"
    )
</template>

<script>
import { backendHelpers } from '../iilvd-api.js'
const { storageObject, currentFixedSizeOfYouTubeVideoId } = require('../utils')

// make sure cachedVideoIds exists as an Array
storageObject.cachedVideoIds = storageObject.cachedVideoIds || []

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
        this.suggestions = storageObject.cachedVideoIds
    },
    watch: {
        suggestions(newValue) {
            // save video id suggestions to local storage
            storageObject.cachedVideoIds = newValue
        },
        // when the search term changes
        async searchTerm(value) {
            const minNumberOfCharactersBeforeSearch = 1
            // if no search term
            if (typeof value != 'string' || value.trim().length <= minNumberOfCharactersBeforeSearch) {
                // load all suggestions from storage if search isn't long enough
                this.suggestions = storageObject.cachedVideoIds
            } else {
                // add results from the database
                let possibleVideoIds = await backendHelpers.getVideoIds()
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
            let newVideoId = this.searchTerm.trim()
            // if search empty do nothing
            if (newVideoId.length == 0) {
                return
            }
            newVideoId = this.extractVideoIdIfPossible(newVideoId)
            
            if (newVideoId.length == currentFixedSizeOfYouTubeVideoId || newVideoId.startsWith("/videos/")) {
                // pushing searched video route
                this.$root.routeData$.videoId = newVideoId
                // emit video event
                this.$emit("goToVideo", newVideoId)
                // sometimes the changes are not detected
                this.$root.routeData$ = {...this.$root.routeData$}
                console.debug(`this.$root.routeData$ is:`,JSON.stringify(this.$root.routeData$,0,4))
            } else if (!this.notificationAlreadyShown) {
                this.notificationAlreadyShown = true
                this.$toasted.show(`It looks like that video id isn't valid\n(its not 11 characters)\nWould you like to try and load it anyways?`, {
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
</style>