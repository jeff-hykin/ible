<template lang="pug">
    div#left-panel(:class="{open}" @mouseleave="mouseLeft")
        portal-target(name="left-panel")
</template>

<script>
let oldOwner = { giveUpControl: ()=>0 }
export let openPanel = ()=>{
    console.log(`opening panel`)
    window.dispatchEvent(new CustomEvent("LeftSidePanel: Open"))
}
export let takeover = (giveUpControlCallback)=>{
    oldOwner.giveUpControl()
    oldOwner.giveUpControl = giveUpControlCallback
    window.dispatchEvent(new CustomEvent("LeftSidePanel: Open"))
}
export let closePanel = ()=>{
    window.dispatchEvent(new CustomEvent("LeftSidePanel: Close"))
}
export default {
    mounted() {
        window.left = this
    },
    data: ()=>({
        open: false,
    }),
    windowListeners: {
        "LeftSidePanel: Open":  function() {
            console.log(`[LeftSidePanel: Open]`)
            this.open = true
        },
        "LeftSidePanel: Close": function() { this.open = false },
    },
    methods: {
        mouseLeft() {
            this.open = false
            this.$forceUpdate()
        }
    }
}
</script>

<style lang="sass" scoped>
#left-panel
    position: fixed
    z-index: 999999
    top: 0
    left: 0
    height: 100vh
    width: 27rem
    max-width: calc(100vw - 7rem)
    background-color: white
    box-shadow: var(--shadow-3)
    transform: translateX(-105%)
    transition: transform 0.15s ease-in-out, width 1.15s ease-in
    overflow: auto
    
    &.open
        transform: translateX(0%) !important
    
</style>