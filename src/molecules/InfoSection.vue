<template lang="pug">
    span.info-section
        | Pause Time: {{(currentTime||0).toFixed(2)}} sec
        br
        | {{labelName&&"Selected Label:"}} {{labelName}}
</template>
<script>
export default {
    props: [
        "videoId",
        "labelName",
        "currentTime",
    ],
    data: ()=>({
    }),
    created() {
    },
    watch: {
    }
}
</script>
<style lang='sass' scoped>
.info-section
    margin-left: 1rem
    max-width: 18rem
    overflow: visible
    white-space: pre
    align-self: flex-start
    color: darkgrey
    a 
        color: var(--blue)

.uuid
    font-family: monospace

</style>
