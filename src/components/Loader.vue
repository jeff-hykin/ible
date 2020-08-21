<template lang="pug">
    row(align-h="space-evenly" shadow=2 background-color="white" border-radius="1rem" width="18rem" padding="1rem")
        h5
            | Loading 
        GridLoader
</template>

<script>
export default {
    components: {
        GridLoader: require('vue-spinner/src/GridLoader.vue').default,
    }
}
</script>

<style local lang="sass">
h5
    padding: 1rem
</style>