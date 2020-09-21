<template lang="pug">
    column(align-v='top' width='100%' flex-grow=1)
        Loader(v-if="!loadedAll$")
        //- top bar search area
        //- column.top-bar-container(v-if="loadedAll$" width="100%")
        //-     column(padding='1.2rem' align-h="left")
        //-         ui-autocomplete.rounded-search(
        //-             placeholder="Search for a label, or a video"
        //-             v-model="searchTerm"
        //-             :suggestions="suggestions"
        //-         )
        column(v-if="loadedAll$" padding="1.2rem")
            row
                //- ui-autocomplete.rounded-search(
                //-     placeholder="Which collection"
                //-     v-model="whichCollection"
                //-     :suggestions="collections"
                //- )
                column
                    h5 Search Options
                    jsonRoot.where(:initValue="{from: 'videos', limit: 10}" @changeValue="newJsonValue")
            
            column
                h5 Search Results
                JsonTree(:data="searchResult")
        
        
</template>

<script>
export default {
    name: "ApiExplore",
    components: {
        Loader: require('../components/Loader').default,
        JsonTree: require('vue-json-tree').default,
        jsonRoot: require("edit-json-vue/src/jsonRoot.vue").default,
        
    },
    mixins: [
        require("../mixins/loader"),
        require("../iilvd-api").mixin,
    ],
    data: ()=>({
        needToLoad$: {},
        searchTerm: null,
        whichCollection: null,
        searchOptions: {},
        collections: [],
        suggestions: [],
        searchResult: null,
    }),
    windowListeners: {
        keydown({key}) {
            if (key == "Enter") {
                this.submitSearch()
            }
        }
    },
    created() {
        this.$once("loadedAll$",async ()=>{
            this.collections = await endpoints.collections()
        })
    },
    methods: {
        newJsonValue(value) {
            this.searchOptions = value
        },
        async submitSearch() {
            this.$toasted.show(`Searching`).goAway(2500)
            this.searchResult = {}
            this.searchResult = await endpoints.raw.all(this.searchOptions)
            this.$toasted.show(`Search results returned`).goAway(2500)
        }
    }
}
</script>

<style lang="sass">
.where
    padding: 1rem

</style>