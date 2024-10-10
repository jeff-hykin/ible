<template lang="pug">
    #vue-root
        //- [ Put stuff you always want to exist here (like a nav bar) ]
        //- This (below) will load to the Home page by default 
        //- Card(position="fixed" left="2rem" bottom="2rem" z-index="99999999999" border="var(--red) solid 8px" padding="2rem")
        //-     h1(style="font-size: 35pt")
        //-         | WARNING: Upgrade In Progress
        //-     br
        //-     | Website might not behave as expected
        portal-target(name="modal-popups")
        router-view(ref="router")
        LeftSidePanel
        RightSidePanel
</template>
<script>

// libs and plugins
import Vue from "vue"
import plugins from "./plugins/*.js"
import pages from "./pages/*.vue"
import {getColor, deferredPromise, createVideoId, videoIdLength} from "./tooling/pure_tools.js"
import * as utils from "./tooling/pure_tools.js"
import * as basics from "./tooling/basics.bundle.js"
import * as videoTools from "./tooling/video_tooling.js"
import { frontendDb } from "./tooling/database.js"
import { Router } from './plugins/router-plugin.js'
import * as zipJs from "@zip.js/zip.js"
import * as zipTools from "./tooling/zip_tooling.js"
import { Event, trigger, everyTime, once, globalEvents } from "./tooling/events.js"
import * as vueTooling from "./tooling/vue_tooling.js"

import "./tooling/video_storage_manager.js"
import "./tooling/timestamp_storage_manager.js"

const { get, set } = basics
window.basics = basics // for debugging

// listens to:
//     globalEvents.requestRootData
//     globalEvents.addLabelRequest
//     globalEvents.rootDeSelectTimestampRequest
// triggers:
//     globalEvents.updateVideoRequest
//     globalEvents.addedLabel

//
// Routing Init
//
let prevRouteDataJson = "null"
// make sure home page exists
if (!("Home" in pages)) {
    throw Error("Hey, this template expects there to be a 'Home.vue' page.\nIf you don't want one that's fine. Just change the router in the App.vue file so it doesn't expect/need one")
}

// TASKS:
    // clean up videoIdToPath

// create Root instance and attach it (executed after this file loads)
let RootComponent; setTimeout(()=>(new (Vue.extend(RootComponent))).$mount('#vue-root'), 0)
let untrackedData = {
    firstSearchLoad: true,
    usernameList: [],
    videoIdToPath: {},
    videoPaths: [],
}
const videoInfoChangeChecker = new utils.JsonValueChangeChecker()
const videoPathsChangeChecker = new utils.JsonValueChangeChecker()
export default RootComponent = {
    name: 'RootComponent',
    components: {
        LeftSidePanel: require("./templates/LeftSidePanel").default,
        RightSidePanel: require("./templates/RightSidePanel").default,
        Card: require("./molecules/Card").default,
    },
    mixins: [
        require("./mixins/loader"),
    ],
    // 
    // routes
    // 
    router: new Router({
        routes: [
            {
                name: "video",
                path: '/video/*',
                component: pages.Home.default,
            },
            // load up anything in the pages section
            ...Object.keys(pages).map(eachPageName=>({
                path: "/"+eachPageName.toLowerCase(),
                name: eachPageName,
                component: pages[eachPageName].default,
            })),
            // all other routes redirect to the home page
            // You can change this to a 404 page if you want
            {
                path: "*",
                redirect: "/home",
            },
        ]
    }),
    created() {
        window.$root = this // for debugging
        // get the labels ASAP
        this.retrieveLabels()
    },
    // 
    // global data
    // 
    data() {
        // 
        // calculate route
        // 
            let initialRouteData = {
                videoId: null,
                labelName: null,
                initWithHelp: false,
            }
            prevRouteDataJson = get({ keyList: ["query", "_"], from: this.$route, failValue: "{}" })
            for (const [eachKey, eachValue] of Object.entries(JSON.parse(prevRouteDataJson))) {
                if (eachValue != null) {
                    initialRouteData[eachKey] = eachValue
                }
            }
        
        // 
        // setup video interface
        // 
        // NOTE: normally we would keep it modular, except that its connected to the router and tons of parent-elements
        //       need to interact with it for global keyboard controls, segment rendering, etc
        //       so we put it in here
        // NOTE2: none of this stuff is intended to be reactive, there's just no good way to access it when its outside of $data
            const runVideoCallbacks = async ()=>{
                console.log(`[Root] running video-loaded callbacks`)
                for (const eachCallback of [...this.videoInterface._videoLoadedPermanentCallbacks].concat([...this.videoInterface._videoLoadedTemporaryCallbacks])) {
                    try {
                        await eachCallback()
                    } catch (error) {
                        console.error(error.stack)
                        console.error(`\n\nerror with callback from .wheneverVideoIsLoaded(func)`)
                        console.error(error)
                        console.error(`func is:\n${eachCallback.toString()}`)
                    }
                }
            }
            const $root = this
            let promise = deferredPromise()
            promise.then(runVideoCallbacks)
            const videoInterface = {
                _videoLoadedPromise: promise,
                _videoLoadedPermanentCallbacks: new Set(),
                _videoLoadedTemporaryCallbacks: new Set(),
                _player: null,
                keyTimestamps: [],
                keyTimestampsPromise: Promise.resolve([]),
                // this gets triggered first/immediately
                async _videoInRouteHasChanged() {
                    if (!videoInfoChangeChecker.changedSinceLastCheck($root.routeData$?.videoInfo)) {
                        return
                    }
                    
                    // 
                    // auto detect videoId
                    // 
                    let message
                    if ($root.routeData$?.videoInfo?.path && !$root.routeData$?.videoInfo?.videoId) {
                        const existingVideoPath = $root.routeData$?.videoInfo?.path
                        const videoBaseName = existingVideoPath.split(/\\|\//g).slice(-1)[0]
                        const videoNameParts = videoBaseName.split('.')
                        // might have an id
                        if (videoNameParts.length > 2) {
                            const possibleVideoId = videoNameParts.slice(-2)[0].replace(/\s/,"")
                            if (possibleVideoId.length == videoIdLength) {
                                $root.routeData$.videoInfo.videoId = possibleVideoId
                            } else {
                                let suggestedName
                                if (possibleVideoId > videoIdLength) {
                                    suggestedName = possibleVideoId.slice(0, videoIdLength)
                                } else {
                                    const missingLength = videoIdLength - possibleVideoId.length
                                    suggestedName = possibleVideoId + createVideoId().slice(0,missingLength)
                                }
                                message = `<br>Hey! This video ("${utils.escapeHtml(videoBaseName)}") has video ID ("${utils.escapeHtml(possibleVideoId)}")<br>but its not the right length (${videoIdLength})<br><br>Want me to rename it and give it a new ID?`
                            }
                        }
                    }
                    
                    // 
                    // message if videoId is (still) missing
                    // 
                    if ($root.routeData$?.videoInfo?.path && !$root.routeData$?.videoInfo?.videoId) {
                        const exampleId = createVideoId()
                        const existingVideoPath = $root.routeData$?.videoInfo?.path
                        const videoBaseName = existingVideoPath.split(/\\|\//g).slice(-1)[0]
                        const parts = videoBaseName.split('.').slice(0,-1)
                        let frontPart
                        let extension = "mp4"
                        if (parts.length > 1) {
                            const frontPart = parts.slice(0,-1).join('.')
                            extension = parts.slice(-1)[0]
                        } else {
                            frontPart = parts.join('.')
                        }
                        message = message || `<br>Hey! This video ("${utils.escapeHtml(videoBaseName)}") is missing a video ID<br>I can't record timestamps without an ID<br>Just rename the file to "${utils.escapeHtml(frontPart)}.${exampleId}.${extension}"<br>Where "${exampleId}" is the video ID<br>`
                        vueTooling.showLongMessage(
                            message,
                            [
                                {
                                    text : 'Rename It For Me',
                                    onClick : async (eventData, toastObject) => {
                                        try {
                                            const { videoId, videoPath: path } = await window.backend.giveVideoAnId(existingVideoPath)
                                            Vue.toasted.show(`Video renamed to "${utils.escapeHtml(path)}"`, {
                                                closeOnSwipe: false,
                                                keepOnHover:true,
                                                action: { text:'Close', onClick: (e, toastObject)=>{toastObject.goAway(0)} },
                                            })
                                            await $root.videoInterface.goToThisVideo({videoId, path})
                                        } catch (error) {
                                            Vue.toasted.show(`<br>Error<br>${utils.escapeHtml(error.message)}<br>`.replace(/\n/g,"<br>"), {
                                                closeOnSwipe: false,
                                                keepOnHover:true,
                                                action: { text:'Close', onClick: (e, toastObject)=>{toastObject.goAway(0)} },
                                            })
                                        }
                                        toastObject.goAway(1)
                                    },
                                },
                            ]
                        )
                    }
                    // refresh the promise
                    const promise = deferredPromise()
                    promise.then(runVideoCallbacks)
                    $root.videoInterface._videoLoadedPromise = promise
                    $root.videoInterface._videoLoadedTemporaryCallbacks = new Set()
                    const currentVideoId = $root.videoInterface.videoId
                    // get the segments for the current video
                    $root.videoInterface.updateKeyTimestamps()
                },
                get aVideoIsSelected() {
                    return !!$root.routeData$?.videoInfo?.path
                },
                get player() {
                    return $root.videoInterface._player
                },
                get videoId() {
                    return $root.routeData$?.videoInfo?.videoId
                },
                get videoPath() {
                    return $root.routeData$?.videoInfo?.path
                },
                tellRootTheVideoHasLoaded(player) {
                    console.log(`[Root] video has loaded`)
                    $root.videoInterface._player = player
                    if (player == null) {
                        console.log(`[Root] loaded null video`)
                    // if there's no duration then wait for it to load
                    } else if (!$root.videoInterface?.player?.duration) {
                        console.log(`[Root] WARNING: tellRootTheVideoHasLoaded was called too early. It should only be called once the video player has a duration`)
                        return new Promise((resolve, reject)=>{
                            setTimeout(()=>{
                                console.log(`waiting for duration to load`)
                                resolve($root.videoInterface._videoInRouteHasChanged())
                            },100)
                        })
                    }
                    return $root.videoInterface._videoLoadedPromise.resolve($root.videoInterface._player)
                },
                updateKeyTimestamps() {
                    const currentVideoId = $root.videoInterface.videoId
                    $root.videoInterface.keyTimestampsPromise = frontendDb.getTimestamps({
                        where:[
                            { valueOf: ['videoId'], is: currentVideoId },
                        ],
                        returnObject: false,
                    }).then(keyTimestamps=>{
                        const videoIdChanged = currentVideoId != $root.videoInterface.videoId
                        if (videoIdChanged) {
                            return
                        }
                        $root.videoInterface.keyTimestamps = keyTimestamps
                    })
                },
                focusVideoPlayer() {
                    const tabIndex = window.VideoPlayer.$el.getAttribute("tabindex")
                    window.VideoPlayer.$el.setAttribute("tabindex", "-1")
                    window.VideoPlayer.$el.focus()
                    window.VideoPlayer.$el.setAttribute("tabindex", tabIndex)
                },
                async goToThisVideo(videoInfo) {
                    $root.videoInterface._player = null
                    $root.videoInterface._videoLoadedTemporaryCallbacks = new Set()
                    const originalVideoInfo = {...videoInfo}
                    // 
                    // add what we know to the videoInfo
                    // 
                    if (videoInfo?.videoId && typeof videoInfo?.videoId == "string") {
                        let videoPath = untrackedData.videoIdToPath[videoInfo.videoId]
                        const moreVideoInfo = await frontendDb.getVideoById(videoInfo.videoId)
                        if (moreVideoInfo) {
                            videoInfo = { path: videoPath, ...moreVideoInfo, ...videoInfo}
                        }
                    } else if (videoInfo?.path && typeof videoInfo?.path == "string") {
                        const moreVideoInfo = await frontendDb.getVideoByPath(videoInfo.path)
                        if (moreVideoInfo) {
                            videoInfo = {...moreVideoInfo, ...videoInfo}
                        }
                    }
                    const newVideoInfo = {...videoInfo, ...originalVideoInfo}
                    // this is a hack. The CenterStage detects changes based on the videoId (should be refacted a bit)
                    // if (!newVideoInfo.videoId) {
                        setTimeout(() => {
                            window.location.reload()
                        }, 500)
                    // }
                    return $root.push({ videoInfo: newVideoInfo })
                },
                onceVideoIsLoaded(callback=()=>{}) {
                    if ($root.videoInterface._videoLoadedPromise.state != "pending") {
                        return Promise.resolve(callback()).catch(error=>{
                            console.error(error.stack)
                            console.error(error.message)
                        })
                    }
                    $root.videoInterface._videoLoadedTemporaryCallbacks.add(callback)
                    return $root.videoInterface._videoLoadedPromise
                },
                wheneverVideoIsLoaded(callback) {
                    if ($root.videoInterface._videoLoadedPromise.state != "pending") {
                        return Promise.resolve(callback()).catch(error=>{
                            console.error(error.stack)
                            console.error(error.message)
                        })
                    }
                    $root.videoInterface._videoLoadedPermanentCallbacks.add(callback)
                },
                getVideoPaths() {
                    return window.storageObject.videoPaths
                },
                getVideoInfos() {
                    const videoInfos = []
                    for (const [key, value] of Object.entries(untrackedData.videoIdToPath)) {
                        videoInfos.push({
                            videoId: key,
                            path: value,
                            isYoutubeUrl: false
                        })
                    }
                    return videoInfos
                },
                videoIdToPath(videoId) {
                    if (videoTools.isLocalVideo(videoId)) {
                        return untrackedData.videoIdToPath[videoId]
                    } else {
                        return `https://www.youtube.com/embed/${videoTools.extractYoutubeVideoId(videoId)}?amp;iv_load_policy=3&amp;modestbranding=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`
                    }
                },
                async refreshLocalVideoData() {
                    try {
                        const videoPaths = await window.backend.getLocalVideoPaths()
                        if (videoPathsChangeChecker.changedSinceLastCheck(videoPaths)) {
                            const videoIds = videoPaths.map(videoTools.extractLocalVideoId)
                            let videos = []
                            for (const [path,id] of basics.zip(videoPaths,videoIds)) {
                                if (id) {
                                    videos.push({
                                        videoId: id,
                                        path: path,
                                    })
                                }
                            }
                            trigger(globalEvents.updateVideoRequest, "root", videos)
                            window.storageObject.videoPaths = videoPaths
                        }
                    } catch (error) {
                        console.warn(`Asked local server for videoPaths, but got error: ${error}`)
                    }
                },
            }
            new utils.DynamicInterval().setRate(5000).onInterval(()=>{
                this.videoInterface.refreshLocalVideoData()
            }).start()
        
        return {
            videoInterface,
            loadStart: (new Date()).getTime(),
            routeData$: initialRouteData,
            filterAndSort: {
                maxlabelConfidence: null,
                minlabelConfidence: null,
                observer: "",
                kindOfObserver: 'Either',
                validation: [ 'Unchecked', 'Confirmed', 'Rejected', 'Disagreement' ],
            },
            searchResults: {
                videos: {},
                uncheckedTimestamps: [0],
                observers: {},
                labels: {},
                counts: {
                    total: 1,
                    fromHuman: 0,
                    rejected: 0,
                    confirmed: 0,
                    disagreement: 0,
                },
            },
            selectedTimestamp: null,
            labels: {},
            videos: {},
            email: window.storageObject.email,
        }
    },
    mounted() {
        this.videoInterface._videoInRouteHasChanged() //inital load
        setTimeout(() => {
            this.getAValidEmail()
        }, 100)
        frontendDb.getUsernames().then(usernames=>{
            untrackedData.usernameList = untrackedData.usernameList.concat(usernames)
        })
        
        // 
        // listening
        // 
        const name = "root"
        everyTime(globalEvents.requestRootData).then((who, newLabel)=>this.$root.$data)
        everyTime(globalEvents.addLabelRequest).then((who, ...args)=>{
            console.log(`${name} saw [addLabelRequest] from ${who}`)
            this.$root.addLabel(...args)
            trigger(globalEvents.addedLabel, "root")
        })
        everyTime(globalEvents.rootDeSelectTimestampRequest).then((who)=>{
            console.log(`${name} saw [rootDeSelectTimestampRequest] from ${who}`)
            this.$root.selectedTimestamp = null
        })
    },
    watch: {
        email(newValue){
            window.storageObject.email = this.$root.email
        },
        
        "searchResults.videos": {
            deep: true,
            handler() {
                // ignore it the first time
                if (untrackedData.firstSearchLoad) {
                    untrackedData.firstSearchLoad = false
                    return
                }
                // then let the video be set each time new search results roll in
                if (!this.$root.videoInterface.aVideoIsSelected && this.searchResults instanceof Array && this.searchResults.length > 0) {
                    const videoIdOfFirstResult = Object.keys(this.$root.searchResults.videos)[0]
                    this.$root.videoInterface.goToThisVideo({videoId: videoIdOfFirstResult})
                }
            }
        },
        $route: {
            deep: true,
            handler() {
                // 
                // import data from url
                // 
                prevRouteDataJson = this.$route?.query?._ || "{}"
                let newObject = {}
                for (const [eachKey, eachValue] of Object.entries(JSON.parse(prevRouteDataJson))) {
                    if (eachValue != null) {
                        newObject[eachKey] = eachValue
                    }
                }
                this.routeData$ = newObject
            }
        },
        routeData$: {
            deep: true,
            handler() {
                // remove null's
                let routeDataNoNull = {...this.routeData$}
                for (const [eachKey, eachValue] of Object.entries(routeDataNoNull)) {
                    if (routeDataNoNull[eachKey] == null) {
                        delete routeDataNoNull[eachKey]
                    }
                }
                
                // prevent navigating to the same location
                const previousRouteData = JSON.parse(prevRouteDataJson)
                const currentJson = JSON.stringify(routeDataNoNull)
                if (prevRouteDataJson === currentJson) {
                    return
                }
                prevRouteDataJson = currentJson
                
                // 
                // select label
                // 
                if (typeof this.routeData$.labelName == 'string' && !!this.routeData$.labelName) {
                    // if label exists
                    let label = (this, [ "labels", this.routeData$.labelName ], null)
                    // make sure to toggle the label
                    if (label instanceof Object) {
                        label.selected = true
                        this.labels = {...this.labels}
                    }
                }
                
                const videoIdChanged = JSON.stringify(previousRouteData?.videoInfo) !== JSON.stringify(JSON.parse(currentJson)?.videoInfo)
                if (videoIdChanged) {
                    this.videoInterface._videoInRouteHasChanged()
                }
                
                // 
                // change route
                // 
                if (this.pushChangeToHistory) {
                    console.log(`pushing route changes to history`)
                    this.$router.push({ name: this.$route.name, query: {"_":currentJson} })
                } else {
                    this.$router.replace({ name: this.$route.name, query: {"_":currentJson} })
                }
                this.pushChangeToHistory = false
            },
        },
        labels() {
            // run the route handler to update the selected label
            this.routeData$ = {...this.routeData$}
        }
    },
    computed: {
        noSearch() {
            const filterAndSort = this.$root.filterAndSort
            return (
                filterAndSort.kindOfObserver == "Either" 
                && !filterAndSort.observer 
                && !this.$root.routeData$.labelName 
                && !filterAndSort.minlabelConfidence 
                && !filterAndSort.maxlabelConfidence 
                && (filterAndSort.validation.length == 4 || filterAndSort.validation.length == 0)
            )
        }
    },
    methods: {
        clearSearch() {
            this.$root.filterAndSort = {
                maxlabelConfidence: null,
                minlabelConfidence: null,
                observer: "",
                kindOfObserver: 'Either',
                validation: [ 'Unchecked', 'Confirmed', 'Rejected', 'Disagreement' ],
            }
            this.$root.routeData$.labelName = ""
        },
        getAValidEmail() {
            if (utils.isInvalidEmail(this.$root.email)) {
                let prefix = ""
                let email = ""
                while (true) {
                    email = prompt(`${prefix}What email do you want to attach to your timestamps?`)
                    if (utils.isInvalidEmail(email)) {
                        prefix = "Sorry that doesn't seem to be a valid email\n"
                    } else {
                        break
                    }
                }
                this.$root.email = email
            }
        },
        getUsernameList() {
            untrackedData.usernameList = [... new Set(untrackedData.usernameList.concat(Object.keys(this.searchResults.observers)))].filter(each=>each)
            return untrackedData.usernameList
        },
        push(data) {
            this.pushChangeToHistory = true
            this.routeData$ = {...this.routeData$, ...data}
        },
        getNamesOfSelectedLabels() {
            let labelNames = Object.entries(this.$root.labels).filter(([eachKey, eachValue])=>(eachValue.selected)).map(([eachKey, eachValue])=>(eachKey))
            if (!labelNames || labelNames instanceof Array && labelNames.length == 0) {
                return Object.keys(this.$root.labels)
            } else {
                return labelNames
            }
        },
        async retrieveLabels() {
            console.log(`retriving lables`)
            // 
            // get labels
            // 
            let prevLabels = get({ keyList: ["labels"], from: this, failValue: {} })
            let newLabels
            try {
                newLabels = await frontendDb.summary.labels()
            } catch (error) {
                this.$toasted.show(`Unable to get summary.labels()`).goAway(3500)
                console.error(error.message)
                console.error(error.stack)
                return
            }
            // assign colors to all labels in a pretty (irrelevently) inefficient way
            Object.keys(newLabels).forEach(
                eachLabelName => newLabels[eachLabelName] = {
                    color: getColor(eachLabelName),
                    ...newLabels[eachLabelName],
                    // preserve selection information
                    // TODO: should probably rewrite where/how this data is saved
                    selected: get({ keyList: [eachLabelName, "selected"], from: prevLabels, failValue: false }),
                }
            )
            this.labels = newLabels
        },
        addLabel(labelName, videoId) {
            const noneAreSelected = Object.values(this.$root.labels).every(each=>!each.selected)
            if (!this.$root.labels[labelName]) {
                // if the label doesnt exist
                this.$toasted.show(`Note: Thats a new label name`).goAway(7500)
                // then add it
                this.$root.labels[labelName] = {
                    color: getColor(labelName),
                    segmentCount: 1,
                    videoCount: 1,
                    videos: [ videoId ],
                    selected: !noneAreSelected, // if nothing is selected, keep it that way
                }
            } else {
                let label = this.$root.labels[labelName]
                console.debug(`label.videos is:`,label.videos)
                const videos = [...new Set([...Object.keys(label.videos||{}), videoId])]
                this.$root.labels[labelName] = {
                    color: getColor(labelName),
                    segmentCount: (label.segmentCount||0)+1,
                    videos: videos,
                    videoCount: videos.length,
                    selected: !noneAreSelected, // if nothing is selected, keep it that way
                }
            }
            this.$root.labels = {...this.$root.labels}
        },
        selectAllLabels() {
            const newLabelValues = {}
            for (const [key, value] of Object.entries(this.$root.labels)) {
                newLabelValues[key] = {...value, selected: true}
            }
            this.$root.labels = newLabelValues
        },
    }
}
</script>
<style>
    :root {
        --shadow-1: rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px, rgba(0, 0, 0, 0.3) 0px 2px 4px -1px;
        --shadow-3: rgba(0, 0, 0, 0.14) 0px 8px 17px 2px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px, rgba(0, 0, 0, 0.2) 0px 5px 5px -3px;
        --vue-green: #4fc08d;
        --soft-green: #73c4a0;
        --material-blue: #2195f3;
        --blue: #60a5de;
        --red: #e57373;
        --break-tag-height: 18px;
        --gray: #a8a8a8;
        --darkgray: #686868;
    }
    #vue-root {
        overflow: hidden;
    }
    body {
        background: radial-gradient(circle, rgb(245, 245, 245) 0%, rgb(218, 218, 218) 100%);
    }
    .ui-fab--color-primary:hover {
        background-color: var(--material-blue);
    }
    body .ui-button {
        min-width: fit-content;
    }
    body .outline-button {
        transition: all ease 0.3s;
        height: 1.7rem;
        background-color: transparent !important;
        color: var(--button-color) !important;
        border: 1px solid var(--button-color) !important;
        
    }
    body .outline-button:hover {
        background-color: var(--button-color) !important;
        color: white !important;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity 1.5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
        opacity: 0
    }   
    .tippy-popper {
        z-index: 999999999 !important;
    }
    body br {
        display: block;
        content: "";
        border-bottom: var(--break-tag-height) solid transparent;
    }
    @-moz-document url-prefix() {
        body br {
            margin-bottom: var(--break-tag-height);
        }
    }
</style>