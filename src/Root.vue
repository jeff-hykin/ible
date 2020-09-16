<template lang="pug">
    #vue-root
        //- [ Put stuff you always want to exist here (like a nav bar) ]
        //- This (below) will load to the Home page by default 
        router-view
</template>
<script>

// libs and plugins
import Vue from "vue"
import './plugins/css-baseline-plugin'
import './plugins/good-vue-plugin'
import './plugins/keen-ui-plugin'
import './plugins/vue-toasted-plugin'
import './plugins/youtube-player-plugin'
import './plugins/root-hooks-plugin'
import './plugins/window-listeners-plugin'
import './plugins/resolvables-plugin'
import { Router } from './plugins/router-plugin'
const endpoints = require("./iilvd-api").endpoints

// Pages 
import pages from "./pages/*.vue"
// make sure home page exists
if (!("Home" in pages)) {
    throw Error("Hey, this template expects there to be a 'Home.vue' page.\nIf you don't want one that's fine. Just change the router in the App.vue file so it doesn't expect/need one")
}

let colors = [ "#4fc3f7", "#e57373", "#ba68c8", "#04d895", "#fec355",  "#9575cd", "#4fc3f7", "#ff8a65", "#9ccc65", ]
let colorCopy = [...colors]

// 
// summary
//
    // set:
    //      this.labels
    //      this.labels[].selected
    //      this.labels[].color
    // 
    // retreives:
    //      endpoints.summary.labels()
    // 
    // listeners:
    //      watch: this.selectedLabel
    // 
    // emits:
    //     


let RootComponent
// create Root instance and attach it (executed after this file loads)
setTimeout(()=>(new (Vue.extend(RootComponent))).$mount('#vue-root'),0)
// actually create the App, user router to pick main pages
export default RootComponent = {
    name: 'RootComponent',
    components: {},
    // 
    // routes
    // 
    router: new Router({
        routes: [
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
    }),
    watch: {
        selectedLabel(newValue, oldValue) {
            oldValue && (oldValue.selected = false)
            newValue && (newValue.selected = true)
        },
    },
    created() {
        // get the labels ASAP
        this.retrieveLabels()
        window.$root = this // for debugging
    },
    methods: {
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
            return output
        },
        getCachedVideoObject(id) {
            // if video isn't cached
            if (!(this.$root.videos[id] instanceof Object)) {
                // then cache it
                this.$root.videos[id] = {}
            }
            console.debug(`this.$root.videos[id] is:`,JSON.stringify(this.$root.videos[id],0,4))
            // ensure the id didn't get messed up
            this.$root.videos[id].$id = id
            console.debug(`this.$root.videos[id] is:`,JSON.stringify(this.$root.videos[id]))
            // return the cached video
            return this.$root.videos[id]
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
        },
    }
}

</script>
<style >
:root {
    --shadow-1: rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px, rgba(0, 0, 0, 0.3) 0px 2px 4px -1px;
    --shadow-3: rgba(0, 0, 0, 0.14) 0px 8px 17px 2px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px, rgba(0, 0, 0, 0.2) 0px 5px 5px -3px;
    --vue-green: #4fc08d;
    --material-blue: #2195f3;
    --blue: #60a5de;
    --red: #e57373;
}
body {
    background: radial-gradient(circle, rgb(245, 245, 245) 0%, rgb(218, 218, 218) 100%);
}
</style>