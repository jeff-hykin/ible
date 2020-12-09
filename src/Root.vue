<template lang="pug">
    #vue-root
        //- [ Put stuff you always want to exist here (like a nav bar) ]
        //- This (below) will load to the Home page by default 
        router-view
        LeftSidePanel
        RightSidePanel
</template>
<script>

// libs and plugins
import Vue from "vue"
import plugins from "./plugins/*.js"
import pages from "./pages/*.vue"
import {getColor} from "./utils"

import { Router } from './plugins/router-plugin'
let { backend } = require("./iilvd-api")

// make sure home page exists
if (!("Home" in pages)) {
    throw Error("Hey, this template expects there to be a 'Home.vue' page.\nIf you don't want one that's fine. Just change the router in the App.vue file so it doesn't expect/need one")
}
// make lodash global because I like to live dangerously
for (const [eachKey, eachValue] of Object.entries(require("lodash"))) { window[eachKey] = eachValue }
let RootComponent
// create Root instance and attach it (executed after this file loads)
setTimeout(()=>(new (Vue.extend(RootComponent))).$mount('#vue-root'),0)
// actually create the App, user router to pick main pages
let prevRouteDataJson = "{}"
export default RootComponent = {
    name: 'RootComponent',
    components: {
        LeftSidePanel: require("./templates/LeftSidePanel").default,
        RightSidePanel: require("./templates/RightSidePanel").default,
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
                path: '/video/:videoId/:labelName?',
                component: pages.Home.default
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
        window.Vue = Vue
        // get the labels ASAP
        this.retrieveLabels()
        // pull in the route options 
        console.debug(`this.$route is:`, this.$route)
        
        setTimeout(() => {
            if (!this.loadedAll$) {
                this.$toasted.show(`Are you on the A&M VPN?`).goAway(6500)
                setTimeout(() => {
                    this.$toasted.show(`If you are, then I think the Server might be down`).goAway(6500)
                    this.$toasted.show(`(Complain to jeff.hykin@gmail.com)`).goAway(6500)
                    setTimeout(()=>{
                        this.$toasted.show(`I'll keep trying to connect in the meantime`).goAway(6500)
                    }, 1600)
                }, 1700)
            }
        }, 3500)
    },
    // 
    // global data
    // 
    data: ()=>({
        needToLoad$: {
            backend,
        },
        routeData$: {
            videoId: null,
            labelName: null,
        },
        filterAndSort: {
            label: null,
            minlabelConfidence: null,
            observer: null,
            videoId: null,
            kindOfObserver: 'Either',
            validation: 'Any',
        },
        searchResults: {
            finishedComputing: false,
            videos: new Set(),
            uncheckedObservations: [0],
            // this hardcoded value is only for initilization and is
            // immediately replaced with the result of a backend call
            // TODO: should probably still remove this
            labels: {
                "Uncertain": 2,
                "Happy": 36,
                "Neutral": 13,
                "Surprise": 2,
                "Disgust": 2,
                "Contempt": 2,
                "Anger": 3,
                "non-face": 1,
                "Sad": 2,
                "headache": 182,
                "Smoking": 49,
                "Shaking Head": 21,
                "Fall": 119,
                "Angry": 14,
                "Hand Rotation": 3,
                "Hand Swipe": 11,
                "Heart-Attack": 27,
                "chest pain": 29
            },
            counts: {
                total: 1,
                fromHuman: 0,
                rejected: 0,
                confirmed: 0,
                disagreement: 0,
            },
        },
        selectedVideo: null,
        selectedSegment: null,
        labels: {},
        videos: {},
        needToLoad$: {
            backend,
        },
    }),
    mounted() {
        // initilize routeData$
        this.$withoutWatchers("root-init", ()=>{
            prevRouteDataJson = get(this.$route, ["query", "_"], "{}")
            for (const [eachKey, eachValue] of Object.entries(JSON.parse(prevRouteDataJson))) {
                if (eachValue != null) {
                    this.routeData$[eachKey] = eachValue
                }
            }
        })
        // BACKTRACK: load label filter from URL
    },
    watch: {
        routeData$: {
            deep: true,
            handler() {
                console.log(`routeData$ changed`)
                // remove null's
                let routeDataNoNull = {...this.routeData$}
                for (const [eachKey, eachValue] of Object.entries(routeDataNoNull)) {
                    if (routeDataNoNull[eachKey] == null) {
                        delete routeDataNoNull[eachKey]
                    }
                }
                
                // 
                // select label
                // 
                if (isString(this.routeData$.labelName) && !isEmpty(this.routeData$.labelName)) {
                    // if label exists
                    let label = (this, [ "labels", this.routeData$.labelName ], null)
                    // make sure to toggle the label
                    if (isObject(label)) {
                        label.selected = true
                    }
                }
            
                // 
                // select video
                // 
                this.setVideoObject()
                
                // prevent navigating to the same location
                const currentJson = JSON.stringify(routeDataNoNull)
                if (prevRouteDataJson === currentJson) {
                    return
                }
                
                // 
                // change route
                // 
                if (this.pushChangeToHistory) {
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
    resolvables: {
        labelsResolved() {}
    },
    methods: {
        setVideoObject() {
            let videoId = get(this, ["routeData$", "videoId"], null)
            if (isString(videoId) && videoId.length > 0) {
                this.$root.selectedVideo = this.$root.getCachedVideoObject(videoId)
            } else {
                this.$root.selectedVideo = {}
            }
        },
        // BACKTRACK: make sure clicking the thumbnails results in a new route
        push(data) {
            this.pushChangeToHistory = true
            this.routeData$ = {...this.routeData$, ...data}
        },
        getCachedVideoObject(id) {
            // if video isn't cached
            if (!(this.$root.videos[id] instanceof Object)) {
                // then cache it
                this.$root.videos[id] = {}
            }
            // ensure the id didn't get messed up
            this.$root.videos[id].$id = id
            // return the cached video
            return this.$root.videos[id]
        },
        getNamesOfSelectedLabels() {
            let labelNames = Object.entries(this.$root.labels).filter(([eachKey, eachValue])=>(eachValue.selected)).map(([eachKey, eachValue])=>(eachKey))
            if (isEmpty(labelNames)) {
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
            let prevLabels = get(this, "labels", {})
            let newLabels = await (await this.backend).summary.labels()
            // assign colors to all labels in a pretty (irrelevently) inefficient way
            Object.keys(newLabels).forEach(
                eachLabelName => newLabels[eachLabelName] = {
                    color: getColor(eachLabelName),
                    ...newLabels[eachLabelName],
                    // preserve selection information
                    // TODO: should probably rewrite where/how this data is saved
                    selected: get(prevLabels, [eachLabelName, "selected"], false),
                }
            )
            this.labels = newLabels
            
            // BACKTRACK: remove this
            this.labelsResolved.resolve(true)
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
</style>