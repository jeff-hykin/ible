<template lang="pug">
    div.side-button(v-on="this.$listeners" :class="{left: $attrs.left, right: $attrs.right}")
        ui-tooltip(position="top" animation="fade")
            | {{ $attrs.left  && "go to previous timestamp (ctrl+left arrow)" }}
            | {{ $attrs.right  && "go to next timestamp (ctrl+right arrow)" }}
        span
            | {{ $attrs.left  && "←" }}
            | {{ $attrs.right && "→" }}
</template>
<script>
export default {}
</script>

<style lang="sass" scoped>
.side-button
    background: var(--soft-green)
    color: white
    padding: 1.9rem
    --radius: 5rem
    cursor: pointer
    width: 2.7rem
    
    &.left
        padding-right: 0
        border-top-left-radius: var(--radius)
        border-bottom-left-radius: var(--radius)
        span
            position: relative
            left: -100%
    &.right
        padding-left: 0
        border-top-right-radius: var(--radius)
        border-bottom-right-radius: var(--radius)
        span
            position: relative
            right: -100%
    
</style>