<template lang="pug">
    column.side-panel-nub(:class="{open, leftSide, rightSide}")
        slot(name="nub-content")
        column.panel(align-h="center" align-v="top")
            slot(name="panel-content")
        
</template>

<script>
export default {
    props: [ 'open', 'leftSide', 'rightSide' ],
}
</script>

<style lang="sass" scoped>
.side-panel-nub
    --nub-width: 3.5rem
    height: 100%
    width: var(--nub-width)
    position: absolute
    z-index: 9999
    top: 0
    
    &.leftSide
        left: 0
        .panel
            left: 0
            transform: translateX(-100%)
    &.rightSide
        right: 0
        .panel
            right: 0
            transform: translateX(100%)
    
    &:hover, &.open
        color: transparent
        .panel
            transform: translateX(0)
    
    .panel
        height: 100%
        width: 25rem
        min-width: 25vw
        max-width: calc(100vw - calc(var(--nub-width) * 2))
        position: absolute
        top: 0
        transition: transform 0.15s ease-in-out, width 1.15s ease-in
        z-index: 9999
        background-color: white
        
        
</style>