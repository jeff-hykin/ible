<template lang="pug">
    column(
        width="100%"
        height="100vh"
        align-h="center"
        align-v="top"
        overflow="auto"
        overflow-x="hidden"
    )
        WrappedTopSearch
        
        column(v-if="!aVideoIsSelected()" width="100%" height="100vh" flex-shrink="1" color="gray")
            h5 No Video Selected
            
        transition(name="fade")
            row.center-stage(v-show="aVideoIsSelected()" align-v="top" align-h="center" padding-top="8rem")
                column.main-container(flex-grow=1 align-v="top")
                    row.below-video-search(flex-basis="100%" padding-top="1rem" align-v="top" :opacity="aVideoIsSelected()? 1 : 0")
                        //- Video area
                        column(align-v="top").video-width-sizer
                            row(width="96%" position="relative")
                                VideoPlayer(
                                    ref="videoPlayer"
                                    :videoPathOrUrl="$root.videoInterface.videoPath"
                                    @videoLoaded="$root.videoInterface.tellRootTheVideoHasLoaded"
                                    @currentTimeChanged="updateCurrentTime"
                                )
                            container.below-video(v-if="$root.videoInterface.videoId")
                                //- BACK
                                SideButton.left-side-button(left @click='wrapperForSelectPreviousSegment')
                                //- segments
                                SegmentDisplay(ref="segmentDisplay" :currentTime="currentTime")
                                //- NEXT
                                SideButton.right-side-button(right @click='wrapperForSelectNextSegment')
                column.side-container(v-if="$root.videoInterface.videoId" align-v="top" overflow="visible" min-height="50rem" width="fit-content")
                    ObservationEditor(
                        :jumpSegment="wrapperForJumpSegment"
                        :currentTime="currentTime"
                    )
                    InfoSection.info-section(
                        :labelName="activeData().labelName"
                        :videoId="activeData().videoId"
                        :currentTime="currentTime"
                    )
</template>
<script>
import { get } from "../object.js"

export default {
    props: [],
    components: {
        SideButton: require("../atoms/SideButton").default,
        VideoPlayer: require("../atoms/VideoPlayer").default,
        InfoSection: require("../molecules/InfoSection").default,
        ObservationEditor: require("../organisms/ObservationEditor").default,
        SegmentDisplay: require("../organisms/SegmentDisplay").default,
        WrappedTopSearch: require("../organisms/WrappedTopSearch").default,
        Card: require("../molecules/Card").default,
        VideoLister: require("../organisms/VideoLister").default,
    },
    data: ()=>({
        // it is annoying to have a `this.currentTime` when
        // the video core is inside of VideoPlayer
        // and the videoInterface is $root.videoInterface
        // the reason we have to keep this.currentTime
        // is because the videoInterface is not tracked by Vue
        // so even if we updated it (@currentTimeChanged)
        // it wouldn't cause a re-render in downstream components
        currentTime: null,
    }),
    mounted() {
    },
    watch: {
    },
    rootHooks: {
    },
    windowListeners: {
    },
    computed: {
    },
    methods: {
        get,
        aVideoIsSelected() {
            return this.$root.videoInterface.aVideoIsSelected
        },
        activeData() {
            return {
                labelName: this.$root.routeData$?.labelName||"",
                videoId: this.$root.videoInterface.videoId||"",
            }
        },
        getVideoPath() {
            if ($root.videoInterface.aVideoIsSelected) {
                return !$root.videoInterface.videoPath
            }
        },
        updateCurrentTime(value) {
            this.currentTime = value
        },
        wrapperForJumpSegment(...args) {
            this.$refs.segmentDisplay.jumpSegment(...args)
        },
        wrapperForSelectNextSegment() {
            return this.$refs.segmentDisplay.selectNextSegment()
        },
        wrapperForSelectPreviousSegment() {
            return this.$refs.segmentDisplay.selectPreviousSegment()
        },
    }
}
</script>
<style lang='sass' scoped>
.center-stage
    .side-container
        padding-left: 5rem
        padding-right: 5rem
        padding-top: 0.5rem
        
        .info-section
            margin-bottom: 2rem
        
    .main-container
        flex-shrink: 0
        min-height: 44vw
        transition: opacity ease 0.5s
        width: fit-content
        min-width: fit-content
        padding-left: 6rem
        
        .below-video-search
            width: 100%
            max-width: 100vw
            margin-bottom: 5.5rem
            
            .video-width-sizer
                --max-width: calc(70rem)
                width: 50vw
                min-width: 18rem
                max-width: var(--max-width)
                height: fit-content
        
        .below-video
            position: relative
            padding: 1rem
            background: white
            border-radius: 1rem
            box-shadow: var(--shadow-1)
            width: 100%
            --from-top: 5.3rem
            
            .left-side-button
                position: absolute
                left: 0rem
                top: var(--from-top)
                transform: translate(-100%, -50%)
            
            .right-side-button
                position: absolute
                right: 0rem
                top: var(--from-top)
                transform: translate(100%, -50%)
    
    .fade-enter-active, .fade-leave-active
        transition: opacity 2.5s
    
    .fade-enter, .fade-leave-to
        opacity: 0
    
</style>