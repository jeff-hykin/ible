<template lang="pug">
    column.wrapper(:hide="!showFade")
        column.search-positioner(@keydown="stopPropogation" @mouseenter="onHover" @mouseleave="restore")
            Search
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
        closing: true,
    }),
    methods: {
        stopPropogation(event){
            window.event = event
            event.stopImmediatePropagation()
        },
        onHover(event) {
            this.showFade = true
            this.closing = false
            console.debug(`event.fromElement is:`,event.fromElement)
        },
        restore(event) {
            console.debug(`event.fromElement is:`,event.fromElement)
            this.closing = true
            setTimeout(() => {
                // if it hasn't been cancelled (would be false if cancelled)
                if (this.closing) {
                    this.showFade = false
                    this.blurBackground = false
                }
            }, 500)
        }
    },

}
</script>
<style lang="sass" scoped>
.wrapper
    position: fixed
    width: 200vw
    height: 10000vh
    top: -10000vh
    left: 0
    z-index: 99999
    background: rgba(0, 0, 0, 0)
    transition: all ease 0.9s
    
    &:not([hide=true])
        top: 0
        background: rgba(0, 0, 0, 0.5)
    
    .search-positioner
        z-index: 99999
        position: fixed
        width: 100vw
        top: 0
        left: 0
        transform: translateY(-100%)
        transition: all ease 0.3s
        
        &:hover
            box-shadow: var(--shadow-3)
            transform: translateY(0%)
            
            ::v-deep[top-button-kj7bgi359860]
                box-shadow: var(--shadow-3)

</style>