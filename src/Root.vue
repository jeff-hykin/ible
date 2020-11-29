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

let RootComponent
// create Root instance and attach it (executed after this file loads)
setTimeout(()=>(new (Vue.extend(RootComponent))).$mount('#vue-root'),0)
// actually create the App, user router to pick main pages
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
    // 
    // global data
    // 
    data: ()=>({
        needToLoad$: {
            backend,
        },
        filterAndSort: {
            label: null,
            minlabelConfidence: null,
            observer: null,
            videoId: null,
            kindOfObserver: 'Either',
            validation: 'Either',
        },
        searchResults: {
            finishedComputing: false,
            videos: new Set(),
            uncheckedObservations: [0],
            // this hardcoded value is only for initilization and is
            // immediately replaced with the result of a backend call
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
        selectedLabel: null,
        selectedSegment: null,
        labels: {},
        videos: {},
        currentTime: null,
        needToLoad$: {
            backend,
        },
    }),
    watch: {
        selectedLabel(newValue, oldValue) {
            oldValue && (oldValue.selected = false)
            newValue && (newValue.selected = true)
        },
    },
    resolvables: {
        labelsResolved() {}
    },
    created() {
        window.$root = this // for debugging
        // get the labels ASAP
        this.retrieveLabels()
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
    methods: {
        getSelectedLabelName() {
            return this.$root.selectedLabel && this.$root.selectedLabel.name
        },
        getVideoId() {
            return this.$root.selectedVideo && this.$root.selectedVideo.$id
        },
        relatedVideos() {
            let output = []
            if (this.selectedLabel instanceof Object && this.selectedLabel.videos instanceof Object) {
                output = Object.keys(this.selectedLabel.videos)
            }
            // don't show the current video in the related videos list
            if (this.selectedVideo instanceof Object) {
                if (this.selectedVideo.$id) {
                    output = output.filter(each=>each != this.selectedVideo.$id)
                }
            }
            // TODO: fix this by using dynamic loading
            const maxRelatedVideoNumber = 1000
            if (output.length > maxRelatedVideoNumber) {
                output = output.slice(0,maxRelatedVideoNumber)
            }
            return output
        },
        getCachedVideoObject(id) {
            console.debug(`id is:`,id)
            // if video isn't cached
            if (!(this.$root.videos[id] instanceof Object)) {
                // then cache it
                this.$root.videos[id] = {}
            }
            // ensure the id didn't get messed up
            this.$root.videos[id].$id = id
            console.debug(`this.$root.videos[id] is:`,JSON.stringify(this.$root.videos[id],0,4))
            // return the cached video
            return this.$root.videos[id]
        },
        getNamesOfSelectedLabels() {
            return Object.entries(this.$root.labels).filter(([eachKey, eachValue])=>(eachValue.selected)).map(([eachKey, eachValue])=>(eachKey))
        },
        async retrieveLabels() {
            // 
            // get labels
            // 
            this.labels = await (await this.backend).summary.labels()
            // assign colors to all labels in a pretty (irrelevently) inefficient way
            Object.keys(this.labels).forEach(each=> this.labels[each] = {color: getColor(each), ...this.labels[each]})
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