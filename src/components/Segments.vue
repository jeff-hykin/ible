<template lang="pug">
    column
        row.segment(
            align-h="left"
            v-for="(each, index) in segments"
            :class="{selected:(index==whichSegment)}"
            @click="jumpSegment(index)"
            :wrap="true"
        )
            h5 Moment
            JsonTree.json-tree-root(:data='each')
</template>

<script>
import { wrapIndex, EventEmitter } from '../utils'
import JsonTree from 'vue-json-tree'

export let segmentEvents = new EventEmitter()

import { videoEvents } from "./VideoPanel"

export default {
    props: [ 'segments' ],
    components: { JsonTree },
    data: ()=>({
        whichSegment: 0,
    }),
    watch: {
    },
    mounted() {
        videoEvents.on('whichSegment:update', (data)=>{
            if (JSON.stringify(this.whichSegment) != JSON.stringify(data.whichSegment)) {
                this.whichSegment = data.whichSegment
            }
        })
    },
    methods: {
        jumpSegment(index) {
            this.whichSegment = wrapIndex(index, this.segments)
            segmentEvents.emit("whichSegment:update", { whichSegment: this.whichSegment })
        },
    }
}
</script>

<style lang='sass'>


[unique-add1e7fa].segment
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