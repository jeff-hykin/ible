<template lang="pug">
    container(align-self="top" @mouseover="onHover" v-if="$root.selectedSegment").nub
        | Moment
        portal(to="left-panel" v-if="useLeftPanel")
            column(align-v="top" padding="1rem" :data-clipboard-text="getMomentData()")
                H4
                    | Raw Moment
                JsonTree.json-tree-root(:raw="getMomentData()")
                //- The Below code fails because the server isn't https
                //- ui-button(
                //-     color="primary"
                //-     @click="copyToClipBoard"
                //- )
                //-     | Copy ^ To Clipboard
</template>

<script>
const { dynamicSort, logBlock, checkIf, get, set } = require("good-js")
const { openPanel, takeover } = require("../templates/LeftSidePanel")
const clipboardy = require('clipboardy')

export default {
    components: {
        JsonTree: require('vue-json-tree').default,
    },
    data: ()=>({
        useLeftPanel: false,
    }),
    methods: {
        async copyToClipBoard() {
            await clipboardy.write(this.getMomentData())
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
            // this component takes over the left panel, and passes 
            // a callback that (when called) gives up control
            takeover(()=>(this.useLeftPanel = false))
            this.useLeftPanel = true
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