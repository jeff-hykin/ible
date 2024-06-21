<template lang="pug">
    column.video-list-container(width="100%" padding="1rem" align-v="top")
        span(v-if="videoResults.length == 0")
            | (No other videos matching this search)
        column.video-list-element(v-for="eachVideoId in videoResults" @click="$root.videoInterface.goToThisVideo({videoId:eachVideoId})")
            row.thumbnail(width="100%" height="100%" :background-image="isLocalVideo(eachVideoId) ? `url(/icon.png)` : `url(http://img.youtube.com/vi/${eachVideoId}/mqdefault.jpg)`" position="relative" border-radius="0.5rem" overflow="hidden")
                //- this is just used as a thumbnail
                video(
                    v-if="isLocalVideo(eachVideoId)"
                    :src="$root.videoInterface.videoIdToPath(eachVideoId)"
                    style="width: 100%;max-height: 16rem; pointer-events: none;"
                )
                span(style="background-color: rgba(0,0,0,0.45); color: white;position: absolute; bottom: 0.1rem; left: 0.1rem; padding: 0.5rem; border-radius: 0.5rem;")
                    | {{!isLocalVideo(eachVideoId)?"":`${getLocalVideoName(eachVideoId)}`}}
</template>

<script>
import { frontendDb } from '../iilvd-api.js'
import { set } from '../object.js'
import { isLocalVideo, getLocalVideoName } from '../observation_tooling.js'

// TASKS:
    // test clicking on video in video list
    // fix getLocalVideoName

export default {
    data: ()=>({
    }),
    computed: {
        videoResults() {
            let videos = this.$root.searchResults.videos || this.$root.videoInterface.getVideoPathNames()
            let selectedId = this.$root.videoInterface.videoId
            let filtered = Object.keys(videos).filter(each=>each!==selectedId)
            return filtered
        }
    },
    methods: {
        isLocalVideo,
        getLocalVideoName,
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
    overflow: auto

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