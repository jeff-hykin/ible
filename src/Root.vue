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
const endpoints = require("./iilvd-api").endpoints

import { Router } from './plugins/router-plugin'
const { dynamicSort, logBlock, checkIf, get, set } = require("good-js")

// make sure home page exists
if (!("Home" in pages)) {
    throw Error("Hey, this template expects there to be a 'Home.vue' page.\nIf you don't want one that's fine. Just change the router in the App.vue file so it doesn't expect/need one")
}

let colors = [ "#4fc3f7", "#e57373", "#ba68c8", "#04d895", "#fec355",  "#9575cd", "#4fc3f7", "#ff8a65", "#9ccc65", ]
let colorCopy = [...colors]
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
    // 
    // routes
    // 
    router: new Router({
        routes: [
            {
                name: "video",
                path: '/video/:videoId/:labelName',
                component: pages.Home.default
            },
            {
                path: '/video/:videoId',
                redirect: ()=>{
                    // TODO: improve
                    // this is a hack (this function should return the route)
                    setTimeout(() => {
                        window.$root.$router.push({
                            name: "video",
                            params: {
                                videoId: window.location.hash.replace(/#\/video\//,""),
                                labelName: "(No Segments)" 
                            } 
                        })
                    }, 0)
                },
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
        selectedVideo: null,
        selectedLabel: null,
        selectedSegment: null,
        labels: {},
        videos: {},
        currentTime: null,
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
    },
    methods: {
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
            return logBlock({name: "getCachedVideoObject"}, ()=>{
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
            })
        },
        getNamesOfSelectedLabels() {
            return Object.entries(this.$root.labels).filter(([eachKey, eachValue])=>(eachValue.selected)).map(([eachKey, eachValue])=>(eachKey))
        },
        async retrieveLabels() {
            let realEndpoints = await endpoints
            // 
            // get labels
            // 
            this.labels = await realEndpoints.summary.labels()
            // assign colors to all labels in a pretty (irrelevently) inefficient way
            Object.keys(this.labels).forEach(each=> this.labels[each] = {color: (colorCopy.shift()||(colorCopy=[...colors],colorCopy.shift())), ...this.labels[each]})
            this.labelsResolved.resolve(true)
        },
    }
}

</script>
<style lang="scss">
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
    background-color: #2196f3;
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
    
    &:hover {
        background-color: var(--button-color) !important;
        color: white !important;
    }
}
</style>