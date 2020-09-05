<template lang="pug">
    column
        row.segment(
            align-h="left"
            v-for="(each, index) in segments"
            :class="{selected:(index==$root.selectedSegment)}"
            @click="jumpSegment(index)"
            :wrap="true"
        )
            h5 Moment
            JsonTree.json-tree-root(:data='each')
</template>

<script>
const { wrapIndex } = require('../utils')
const { dynamicSort, logBlock } = require("good-js")

export default {
    props: [ 'segments' ],
    components: { 
        JsonTree: require('vue-json-tree').default,
    },
    data: ()=>({
    }),
    watch: {
        // FIXME: change whenever the selected label changes
    },
    mounted() {
    },
    methods: {
        jumpSegment(index) {
            this.$root.selectedSegment = wrapIndex(index, this.segments)
        },
    }
}
</script>

<style lang='sass' scoped>


.segment
    border-top: gray solid 2px
    background: #f7f8f9
    padding-top: 1pc
    margin-bottom: 1rem
    min-width: 100%
    color: black
    opacity: 0.7
    transition: all 0.25s ease-out
    
    .json-tree-root
        border-bottom: gray solid 2px
        max-width: 50vw
        min-width: 3rem
        width: 100%
        padding: 1rem
        border-radius: 0
    
    h5
        padding: 0 1pc
        
    &.selected
        padding-bottom: 2pc
        font-weight: bold
        background: #2196f3
        color: white
        opacity: 1
        
        .json-tree-root
            margin-left: 1rem
            margin-right: 1rem
            
        h5
            padding: 1pc 1pc
</style>