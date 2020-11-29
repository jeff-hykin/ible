<template lang="pug">
    column.search-positioner(@keydown="stopPropogation")
        Search
        TopButton(z-index="-1")
            | Search
</template>
<script>
export default {
    props: [],
    components: {
        TopButton: require("../atoms/TopButton").default,
        Search: require("../organisms/Search").default,
    },
    methods: {
        stopPropogation(event){
            window.event = event
            event.stopImmediatePropagation()
        },
    },

}
</script>
<style lang="sass" scoped>
.search-positioner
    z-index: 99999
    position: fixed
    width: 100vw
    top: 0
    transform: translateY(-100%)
    transition: all ease 0.3s
        
    &:hover
        box-shadow: var(--shadow-3)
        transform: translateY(0%)
        
        ::v-deep[top-button-kj7bgi359860]
            box-shadow: var(--shadow-3)

</style>