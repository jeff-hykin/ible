<template lang="pug">
    div#right-panel(:class="{open}" @mouseleave="mouseLeft")
        portal-target(name="right-panel")
</template>

<script>

export let openPanel = ()=>{
    window.dispatchEvent(new CustomEvent("RightSidePanel: Open"))
}
export let closePanel = ()=>{
    window.dispatchEvent(new CustomEvent("RightSidePanel: Close"))
}
export default {
    mounted() {
        window.right = this
    },
    data: ()=>({
        open: false,
    }),
    windowListeners: {
        "RightSidePanel: Open":  function() { 
            console.log(`[RightSidePanel: Open]`)
            this.open = true  
        },
        "RightSidePanel: Close": function() {
            console.log(`[RightSidePanel: Open]`)
            this.open = false
        },
    },
    methods: {
        mouseLeft() { this.open = false }
    }
}
</script>

<style lang="sass" scoped>
#right-panel
    position: fixed
    z-index: 999999
    top: 0
    right: 0
    height: 100vh
    width: 27rem
    max-width: calc(100vw - 7rem)
    background-color: white
    box-shadow: var(--shadow-3)
    transform: translateX(105%)
    transition: transform 0.15s ease-in-out, width 1.15s ease-in
    
    &.open
        transform: translateX(0%) !important
    
</style>