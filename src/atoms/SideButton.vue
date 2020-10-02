<template lang="pug">
    div.side-button(v-on="this.$listeners" :class="{left: $attrs.left, right: $attrs.right}")
        span
            | {{ $attrs.left  && "←" }}
            | {{ $attrs.right && "→" }}
</template>
<script>
export default {}
</script>

<style lang="sass" scoped>
.side-button
    background: var(--vue-green)
    color: white
    padding: 2.3rem
    --radius: 5rem
    cursor: pointer
    
    &.left
        padding-right: 0
        margin-right: -10px
        border-top-left-radius: var(--radius)
        border-bottom-left-radius: var(--radius)
        span
            position: relative
            left: -100%
    &.right
        padding-left: 0
        margin-left: -10px
        border-top-right-radius: var(--radius)
        border-bottom-right-radius: var(--radius)
        span
            position: relative
            right: -100%
    
</style>