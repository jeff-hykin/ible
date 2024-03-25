<template lang="pug">
    column.card(shadow=1 align-h="left" v-bind="{...$props, ...$attrs}")
        slot
</template>

<script>
export default {

}
</script>

<style lang="sass" scoped>
.card.good-column
    --card-radius: 0.7rem
    color: gray 
    background-color: white
    position: relative
    margin: 0.5rem 
    padding: 1.2rem 
    border-radius: var(--card-radius)
    width: 16rem
    min-width: fit-content
    border: 3px solid white
    flex-grow: 1
    transition: all 0.25s ease-out

    &:hover
        box-shadow: var(--shadow-3) !important
        
</style>