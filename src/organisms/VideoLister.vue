<template lang="pug">
    //- h5(style="width: 100%; text-align: center; padding-top: 1rem; padding-bottom: 1rem; color: gray; text-decoration: underline;")
    //-     | Videos With Label: {{$root.getSelectedLabelName()}}
    column.video-list-container(width="100%" padding="1rem" align-v="top")
        span(v-if="$root.searchResults.videos.size == 0")
            | (Loading or no other videos with this label)
        column.video-list-element(v-for="eachVideoId in $root.searchResults.videos" @click="selectVideo($event, eachVideoId)")
            row.thumbnail(width="100%" height="100%" :background-image="`url(http://img.youtube.com/vi/${eachVideoId}/mqdefault.jpg)`" position="relative")
</template>

<script>
// BACKTRACK: videos are not being listed
export default {
    methods: {
        getTitleFor(videoId) {
            let videoObject = this.$root.getCachedVideoObject(videoId)
            let title = videoObject&&videoObject.summary&&videoObject.summary.title
            if (title === null) {
                return "[Title not in database]"
            }
            if (title != undefined) {
                return title
            } else {
                this.backend.then(backend=>{
                    console.log(`requesting video title`)
                    backend.mongoInterface.get({
                        from: 'videos',
                        keyList: [videoId, "summary", "title"],
                    }).then(title=>{
                        console.log(`received title ${title}`)
                        if (!(videoObject.summary instanceof Object)) {
                            videoObject.summary = {}
                        }
                        videoObject.summary.title = title || null
                        this.$forceUpdate()
                    })
                })
                return "Loading..."
            }
        },
        selectVideo(eventObj, videoId) {
            console.log(`changing selected video from VideoPicker`)
            console.debug(`videoId of selected is:`,videoId)
            this.$root.routeData$.videoId = newVideoId
        },
    }
}
</script>

<style lang='sass' scoped>
.thumbnail
    background-size: cover
    background-repeat: no-repeat

span
    color: black
    
.video-list-container
    overflow: scroll

.video-list-element
    height: 14rem 
    min-height: 14rem
    width: 100%  
    margin-bottom: 2rem 
    position: relative
    cursor: pointer
    .video-title
        align-self: flex-start
        margin-bottom: 0.5rem
        
    .overlay
        width: 100%
        height: 100%
        position: absolute
</style>