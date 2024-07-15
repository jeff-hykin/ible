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
            h5(style="text-align: center")
                | Once you have videos in your HOME/Videos folder
                span(style="height: 1rem;width: 100%;display: block;")
                | check the Videos tab up there ↗
            
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
                            row(width="100%" padding="2rem" align-v="top")
                                JsonTree.json-tree(v-if="videoInfo&&videoInfo.videoId" :data="videoInfo||{}")
                                column(v-if="videoInfo&&videoInfo.videoId" flex-basis="40%" width="100%")
                                    UiSwitch(v-model="watchedSwitch" @click="clickedHasWatchedVideo")
                                        div(style="width: 10rem")
                                            | Watched Video
                                    UiSwitch(v-model="labeledSwitch" @click="clickedHasLabeledVideo")
                                        div(style="width: 10rem")
                                            | Labeled Video
                                    UiSwitch(v-model="verifiedSwitch" @click="clickedHasVerifiedVideo")
                                        div(style="width: 10rem")
                                            | Verified Labels
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
import { frontendDb } from '../tooling/database.js'
import { Perspective, everyTime } from '../tooling/events.js'
import { deferredPromise } from '../tooling/utils.js'
import * as utils from '../tooling/utils.js'
import * as videoTooling from '../tooling/video_tooling.js'
import * as basics from "../tooling/basics.bundle.js"

const videoInfoTracker = new utils.JsonValueChangeChecker()
const globalEvents = Perspective("CenterStage")
export default {
    props: [],
    components: {
        UiSwitch: require("../atoms/UiSwitch").default,
        SideButton: require("../atoms/SideButton").default,
        VideoPlayer: require("../atoms/VideoPlayer").default,
        InfoSection: require("../molecules/InfoSection").default,
        ObservationEditor: require("../organisms/ObservationEditor").default,
        SegmentDisplay: require("../organisms/SegmentDisplay").default,
        WrappedTopSearch: require("../organisms/WrappedTopSearch").default,
        Card: require("../molecules/Card").default,
        VideoLister: require("../organisms/VideoLister").default,
        JsonTree: require('vue-json-tree').default,
    },
    data: ()=>({
        // it is annoying to have a `this.currentTime` when
        // the video core is inside of VideoPlayer
        // and the videoInterface is $root.videoInterface
        // the reason we have to keep this.currentTime
        // is because the videoInterface is not tracked by Vue
        // so even if we updated it (@currentTimeChanged)
        // it wouldn't cause a re-render in downstream components
        watchedSwitch: false,
        labeledSwitch: false,
        verifiedSwitch: false,
        currentTime: null,
        videoInfo: {},
    }),
    mounted() {
        window.CenterState = this // debugging only
        // get video info ASAP
        const videoId = this.$root.videoInterface.videoId
        
        if (videoId) {
            globalEvents.requestVideos.from("mounted").triggerWith([videoId]).then(async (responses)=>{
                let videos = responses[0]
                let videoInfo = videos.find(each=>each.videoId == this.$root.videoInterface.videoId)
                this.videoInfo = videoTooling.enforceStandardVideoFormat(videoInfo)
            })
        }
        // save the video duration whenever its known
        this.$root.videoInterface.wheneverVideoIsLoaded(this.updateVideoFrontendData)
        
        const name = "CenterStage"
        everyTime(globalEvents.videoStorageEntriesUpated).then(async (who, updatedVideos)=>{
            let newInfoForThisVideo = updatedVideos.find(each=>each.videoId == this.$root.videoInterface.videoId)
            console.log(`${name} saw [videoStorageEntriesUpated] from ${who}: ${JSON.stringify(newInfoForThisVideo)}`)
            if (newInfoForThisVideo) {
                this.videoInfo = videoTooling.enforceStandardVideoFormat(newInfoForThisVideo)
            }
        })
    },
    watch: {
        videoInfo() {
            if (videoInfoTracker.changedSinceLastCheck(this.videoInfo) && this.videoInfo != null) {
                // console.debug(`[CenterStage] this.videoInfo changed to new:`,JSON.stringify(this.videoInfo))
                globalEvents.updateVideoRequest.from("videoInfo").triggerWith(JSON.parse(JSON.stringify(this.videoInfo)))
            }
            this.watchedSwitch = !!(this.videoInfo?.usersFinishedWatchingAt||{})[this.$root.email]
            this.labeledSwitch = !!(this.videoInfo?.usersFinishedLabelingAt||{})[this.$root.email]
            this.verifiedSwitch =  !!(this.videoInfo?.usersFinishedVerifyingAt||{})[this.$root.email]
        },
    },
    rootHooks: {
    },
    windowListeners: {
    },
    computed: {
    },
    methods: {
        hasWatchedVideo() {
            return !!(this.videoInfo?.usersFinishedWatchingAt||{})[this.$root.email]
        },
        hasLabeledVideo() {
            return !!(this.videoInfo?.usersFinishedLabelingAt||{})[this.$root.email]
        },
        hasVerifiedVideo() {
            return !!(this.videoInfo?.usersFinishedVerifyingAt||{})[this.$root.email]
        },
        clickedHasWatchedVideo() {
            if (this.hasWatchedVideo()) {
                this.videoInfo.usersFinishedWatchingAt[this.$root.email] = null
            } else {
                this.videoInfo.usersFinishedWatchingAt[this.$root.email] = new Date().getTime()
            }
            this.videoInfo = { ...this.videoInfo }
        },
        clickedHasLabeledVideo() {
            if (this.hasLabeledVideo()) {
                this.videoInfo.usersFinishedLabelingAt[this.$root.email] = null
            } else {
                this.videoInfo.usersFinishedLabelingAt[this.$root.email] = new Date().getTime()
            }
            this.videoInfo = { ...this.videoInfo }
        },
        clickedHasVerifiedVideo() {
            if (this.hasVerifiedVideo()) {
                this.videoInfo.usersFinishedVerifyingAt[this.$root.email] = null
            } else {
                this.videoInfo.usersFinishedVerifyingAt[this.$root.email] = new Date().getTime()
            }
            this.videoInfo = { ...this.videoInfo }
        },
        async updateVideoFrontendData() {
            const player = this.$root.videoInterface.player
            const videoId = this.$root.videoInterface.videoId
            const newVideoInfo = { videoId }
            if (player.duration || this.$root.videoInterface.videoPath) {
                if (player.duration) {
                        newVideoInfo.durationInSeconds = player.duration
                }
                if (this.$root.videoInterface.videoPath) {
                    newVideoInfo.path = this.$root.videoInterface.videoPath
                }
                Object.assign(
                    newVideoInfo,
                    videoTooling.enforceStandardVideoFormat(newVideoInfo),
                )
            }
            this.videoInfo = newVideoInfo
        },
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

::v-deep .json-tree
    min-width: 60%
    max-width: 100%
    background: transparent
    color: gray
    opacity: 0.7
    
    .json-tree-sign
        visibility: hidden    
</style>