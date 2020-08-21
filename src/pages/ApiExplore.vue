<template lang="pug">
    row(margin="1rem")
        Loader(v-if="!loadedAll$")
        row(v-if="loadedAll$")
            | Loaded!
    
</template>

<script>
let databaseApi = require("../iilvd-api")
export default {
    components: {
        Loader: require('../components/Loader').default
    },
    mixins: [
        require("../mixins/loader"),
        databaseApi.mixin,
    ],
    data: ()=>({
        needToLoad$: { test: new Promise((resolve, reject)=>{
            setTimeout(() => {
                resolve()
            }, 20000)
        }) }
    }),
    mounted() {
        
    }
}
</script>

<style>
</style>