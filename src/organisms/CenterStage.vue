<template lang="pug">
    column(
        width="100%"
        height="100vh"
        align-h="center"
        align-v="top"
        overflow="auto"
    )
        WrappedTopSearch
        
        column(v-if="!get($root, ['routeData$', 'videoId'], false)" width="100%" height="100vh" flex-shrink="1" color="gray")
            h5 No Video Selected
            
        transition(name="fade")
            row.center-stage(v-if="get($root, ['routeData$', 'videoId'], false)" align-v="top" align-h="center" padding-top="8rem")
                column.main-container(flex-grow=1 align-v="top")
                    row.below-video-search(flex-basis="100%" padding-top="1rem" align-v="top" :opacity="get($root, ['routeData$', 'videoId'], false)? 1 : 0")
                        //- Video area
                        column(align-v="top").video-width-sizer
                            row(width="96%" position="relative")
                                VideoPlayer(ref="videoPlayer" :videoId="get($root, ['routeData$', 'videoId'], false)" :eventLine="videoActions" @VideoPlayer-loaded="videoLoaded")
                            container.below-video
                                //- BACK
                                SideButton.left-side-button(left @click='decrementIndex')
                                //- segments
                                SegmentDisplay(:jumpSegment="jumpSegment" :player="get($refs, ['videoPlayer', 'player'], null)" :videoDuration="videoDuration" @SegmentDisplay-segementsRetrived="seekToSegmentStart")
                                //- NEXT
                                SideButton.right-side-button(right @click='incrementIndex')
                column.side-container(align-v="top" padding-top="3rem" overflow="visible" min-height="50rem" width="fit-content")
                    ObservationEditor
                    InfoSection.info-section(:player="get($refs, ['videoPlayer', 'player'], null)")
</template>
<script>
const { wrapIndex } = require('../utils')
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
    data() {
        return {
            get,
            videoActions: [],
            // BACKTRACK: remove this
            // a promise that keeps delaying itself until its replaced with a value
            videoDuration: new Promise((resolve, reject)=>{
                setTimeout(()=>this.videoDuration.then(resolve).catch(reject), 0)
            }),
        }
    },
    mounted() {
        window.centerStage = this
    },
    rootHooks: {
        watch: {
            // BACKTRACK fix current time
            selectedVideo() {
                this.duration = null
            },
        }
    },
    methods: {
        seekToSegmentStart() {
            console.log(`trying to seekToSegmentStart`)
            // go to the start of the selected segment
            if (this.$root.selectedSegment) {
                if (typeof this.$root.selectedSegment.startTime == 'number') {
                    console.log(`pushing seekTo action`)
                    this.videoActions.push({function:"seekTo", args: [this.$root.selectedSegment.startTime] })
                }
            }
        },
        incrementIndex() {
            this.jumpSegment(this.$root.selectedSegment.$displayIndex+1)
        },
        decrementIndex() {
            this.jumpSegment(this.$root.selectedSegment.$displayIndex-1)
        },
        async jumpSegment(newIndex) {
            // basic saftey check
            if (!(this.$root.selectedVideo.keySegments instanceof Array) || this.$root.selectedVideo.keySegments.length == 0) {
                console.debug(`[jumpSegment] segments don't exist, returning`)
                return 
            }
            // get the previous segment or the first one in the list
            let segment = this.$root.selectedSegment || this.$root.selectedVideo.keySegments[0]
            const startingPoint = wrapIndex(newIndex, this.$root.selectedVideo.keySegments)
            let indexOfPreviousSegment = (!segment) ? 0 : segment.$displayIndex
            if (newIndex != indexOfPreviousSegment || !segment.$shouldDisplay) {
                let direction = indexOfPreviousSegment > newIndex ? -1 : 1
                console.debug(`jump direction is:`,direction)
                while (1) {
                    let newSegment = this.$root.selectedVideo.keySegments[ wrapIndex(newIndex, this.$root.selectedVideo.keySegments) ]
                    // if its a displayable segment then good, were done
                    if (newSegment.$shouldDisplay) {
                        segment = newSegment
                        console.debug(`[jumpSegment] found a displayable segment`)
                        break
                    }
                    // cycle the index
                    newIndex += direction
                    // if somehow ended back at the start then fail
                    if (wrapIndex(newIndex, this.$root.selectedVideo.keySegments) == startingPoint) {
                        console.debug(`[jumpSegment] couldn't find a displayable segment`)
                        break
                    }
                }
            }
            
            this.$root.selectedSegment = (segment && segment.$shouldDisplay) ? segment : null
            
            console.debug(`[jumpSegment] this.$root.selectedSegment is:`,this.$root.selectedSegment)
            if (this.$root.selectedSegment instanceof Object) {
                console.debug(`[jumpSegment] seeking to segment start since a new index was found`)
                await this.seekToSegmentStart()
            }
        },
        videoLoaded(player) {
            console.debug(`videoLoaded is:`,player.duration)
            this.videoDuration = new Promise((resolve, reject)=>resolve(player.duration))
        },
    }
}
</script>
<style lang='sass' scoped>
.center-stage
    .side-container
        padding-left: 5rem
        padding-right: 5rem
        
        .info-section
            margin-bottom: 2rem
        
    .main-container
        flex-shrink: 0
        min-height: 44vw
        transition: opacity ease 0.5s
        width: fit-content
        min-width: fit-content
        padding-left: 8rem
        
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
            
            .left-side-button
                position: absolute
                left: 0rem
                top: 50%
                transform: translate(-100%, -50%)
            
            .right-side-button
                position: absolute
                right: 0rem
                top: 50%
                transform: translate(100%, -50%)
    
    .fade-enter-active, .fade-leave-active
        transition: opacity 2.5s
    
    .fade-enter, .fade-leave-to
        opacity: 0
    
</style>