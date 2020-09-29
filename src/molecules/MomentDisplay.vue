<template lang="pug">
    container(align-self="top" @mouseover="onHover" :order="order" v-if="$root.selectedSegment").nub
        | Moment
        portal(to="left-panel" :order="order")
            column(align-v="top" padding="1rem" :data-clipboard-text="getMomentData()")
                H4
                    | Raw Moment
                JsonTree.json-tree-root(:raw="getMomentData()")
                ui-button(
                    color="primary"
                    @click="copyToClipBoard"
                )
                    | Copy ^ To Clipboard
</template>

<script>
const { dynamicSort, logBlock, checkIf, get, set } = require("good-js")
const { openPanel } = require("../templates/LeftSidePanel")
const clipboardy = require('clipboardy')

export default {
    components: {
        JsonTree: require('vue-json-tree').default,
    },
    data: ()=>({ 
        order: 2
    }),
    methods: {
        copyToClipBoard() {
            clipboardy.write(this.getMomentData())
            this.$toasted.show(`Copied to clipboard!`).goAway(4500)
        },
        getMomentData() {
            return JSON.stringify(
                Object.fromEntries(
                    Object.entries($root.selectedSegment).filter(
                        ([key, value])=>!key.startsWith("$")
                    ).map(([key, value])=>{
                        if (key == "start") {
                            return [ "startTime", value*1000 ]
                        } else if (key == "end") {
                            return [ "endTime", value*1000 ]
                        } else {
                            return [key, value]
                        }
                    })
                ),
                null, // converter (none)
                4 // indent amount
            )
        },
        onHover() {
            // this looks werid, but basically it just allows kicking-out
            // whatever used to be in the sidepanel
            this.order = 2
            this.$forceUpdate()
            openPanel()
            setTimeout(() => {
                this.order = 1
            }, 0)
        }
    }
}
</script>

<style lang="sass" scoped>
.nub
    position: fixed
    bottom: 0
    left: 0
    height: var(--nub-size)
    width: var(--nub-size)
    background: gray
    color: white
    padding-left: 0.6rem
    padding-bottom: 1.9rem
    border-top-right-radius: var(--nub-size)
    z-index: 1
    align-items: flex-start
    justify-content: flex-end
    // for some reason moments looks bigger than the other ones
    // this shrinks it a little bit
    transform: scale(0.9) translateX(-5.2%) translateY(5.2%)
.json-tree-root
    min-width: 100%
    background: white
    
</style>