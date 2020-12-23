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
                if (newVideoId.length == currentFixedSizeOfYouTubeVideoId) {
                    // pushing searched video route
                    this.$root.routeData$.videoId = newVideoId
                    // emit video event
                    this.$emit("goToVideo", newVideoId)
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