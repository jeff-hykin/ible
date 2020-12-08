<template lang="pug">
    //- search for video
    ui-autocomplete.rounded-search(
        placeholder="Enter YouTube url or Video ID"
        @focus="selectSearchText"
        @select="videoSelect"
        @change="videoSelect"
        v-model="searchTerm"
        :suggestions="suggestions"
    )
</template>

<script>
const { storageObject } = require('../utils')

// make sure cachedVideoIds exists as an Array
storageObject.cachedVideoIds = storageObject.cachedVideoIds || []

export default {
    components: {
    },
    data: ()=>({
        searchTerm: null,
        suggestions: [],
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
                let possibleVideoIds = await (await this.backend).mongoInterface.getAll({
                    from: "videos",
                    where: [
                        {
                            hiddenValueOf: ["_id"],
                            matches: `^${value.trim()}`,
                        }
                    ],
                    forEach:{
                        extractHidden: [ '_id']
                    },
                })
                console.debug(`setting suggestions`)
                this.suggestions = [...new Set(possibleVideoIds.concat(this.suggestions))]
            }
        }
    },
    methods: {
        selectSearchText(eventObject) {
            console.debug(`eventObject is:`,eventObject)
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
            if (newVideoId == get(this.$root, ['routeData$', 'videoId'], null)) {
                this.$toasted.show(`Video is already open`).goAway(2500)
            } else {
                const currentFixedSizeOfYouTubeVideoId = 11 // This is not guarenteed to stay this way forever
                if (newVideoId.length == currentFixedSizeOfYouTubeVideoId) {
                    // pushing searched video route
                    this.$root.routeData$.videoId = newVideoId
                } else {
                    this.$toasted.show(`It looks like that video id isn't valid\n(its not 11 characters)\nWould you like to try and load it anyways?`, {
                        keepOnHover:true,
                        action: [
                            {
                                text : 'Load Anyways',
                                onClick : (eventData, toastObject) => {
                                    this.$root.routeData$.videoId = newVideoId
                                },
                            },
                        ]
                    })
                }
            }
        },
    }
}
</script>

<style lang='sass' scoped>
.rounded-search
    width: 25rem
    max-width: 85%
    margin: 1.2rem
    padding: 0.7rem 2rem 1rem
    background-color: white
    border-radius: 2rem
    height: fit-content
    box-shadow: var(--shadow-1)
</style>