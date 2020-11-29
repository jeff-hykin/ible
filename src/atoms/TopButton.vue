<template lang="pug">
    column(top-button-kj7bgi359860 :style="{...$attrs}" v-on="$listeners")
        span
            slot
</template>

<script>
export default {

}
</script>

<style lang="sass" scoped>
[top-button-kj7bgi359860]
    --size: 4rem
    position: absolute
    border-radius: 2rem
    background-color: var(--soft-green)
    bottom: 0
    transform: translateY(50%)
    border-radius: 7rem
    border-top-left-radius: 0
    border-top-right-radius: 0
    padding: var(--size)
    color: white
    font-size: 20px
    max-height: 0
    min-height: 0
    overflow: visible
    
[top-button-kj7bgi359860] > span
    min-height: var(--size)
    transform: translateY(75%)
    

</style>