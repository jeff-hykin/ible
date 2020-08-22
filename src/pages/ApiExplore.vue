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
        column(padding="1.2rem")
            row
                //- ui-autocomplete.rounded-search(
                //-     placeholder="Which collection"
                //-     v-model="whichCollection"
                //-     :suggestions="collections"
                //- )
                column
                    h5 Search Options
                    jsonRoot.where(:initValue="{from: 'video'}" @changeValue="newJsonValue")
            
            column
                h5 Search Results
                JsonTree(:data="searchResult")
        
        
</template>

<script>
let databaseApi = require("../iilvd-api")
let windowListeners = require("../mixins/window-listeners")

export default {
    name: "ApiExplore",
    components: {
        Loader: require('../components/Loader').default,
        JsonTree: require('vue-json-tree').default,
        jsonRoot: require("edit-json-vue/src/jsonRoot.vue").default,
        
    },
    mixins: [
        require("../mixins/loader"),
        require("../mixins/window-listeners"),
        databaseApi.mixin,
    ],
    data: ()=>({
        needToLoad$: {},
        searchTerm: null,
        whichCollection: null,
        searchOptions: {},
        collections: [],
        suggestions: [],
        searchResult: null,
        windowListeners$: {
            keydown({key}) {
                if (key == "Enter") {
                    this.submitSearch()
                }
            }
        }
    }),
    created() {
        this.$once("loadedAll$",async ()=>{
            this.collections = await this.endpoints.collections()
        })
    },
    methods: {
        newJsonValue(value) {
            this.searchOptions = value
        },
        async submitSearch() {
            console.debug(`this.searchOptions is:`,this.searchOptions)
            this.searchResult = await this.endpoints.raw.all(this.searchOptions)
            console.debug(`this.searchResult is:`,this.searchResult)
        }
    }
}
</script>

<style lang="sass">
.where
    padding: 1rem

</style>