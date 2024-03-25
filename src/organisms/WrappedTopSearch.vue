<template lang="pug">
    column.wrapper(:hide="!showFade")
        column.search-positioner(@keydown="stopPropogation" @mouseenter="onHover" @mouseleave="restore")
            Search(@goToVideo="restore")
            TopButton(z-index="-1" background-color="slategray")
                | Search
</template>
<script>
export default {
    props: [],
    components: {
        TopButton: require("../atoms/TopButton").default,
        Search: require("../organisms/Search").default,
    },
    data: ()=>({
        showFade: false,
    }),
    mounted() {
        window.showSearch = this.onHover
    },
    methods: {
        stopPropogation(event){
            window.event = event
            event.stopImmediatePropagation()
        },
        onHover(event) {
            this.showFade = true
        },
        restore(event) {
            this.showFade = false
        }
    },

}
</script>
<style lang="sass" scoped>
.wrapper
    position: fixed
    width: 102vw
    height: 100vh
    top: -100vh
    left: 0
    z-index: 999
    background: rgba(0, 0, 0, 0)
    transition: all ease 0.3s
    will-change: background
    
    .search-positioner
        z-index: 999
        position: fixed
        width: 100vw
        top: 0
        left: 0
        transform: translateY(-100%)
        transition: all ease-out 0.3s
        will-change: transform
    
    &:not([hide=true])
        transition: background ease-in 0.9s 0.3s
        top: 0
        background: rgba(0, 0, 0, 0.5)
        .search-positioner
            box-shadow: var(--shadow-3)
            transform: translateY(0%)
            
            ::v-deep[top-button-kj7bgi359860]
                box-shadow: var(--shadow-3)
    
</style>