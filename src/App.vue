<template lang="pug">
    #app
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
import { Router } from './plugins/router-plugin'

// Pages 
import pages from "./pages/*.vue"
// make sure home page exists
if (!("Home" in pages)) {
    throw Error("Hey, this template expects there to be a 'Home.vue' page.\nIf you don't want one that's fine. Just change the router in the App.vue file so it doesn't expect/need one")
}

let App
// create App instance and attach it (executed after this file)
setTimeout(()=>(new (Vue.extend(App))).$mount('#app'),0)
// actually create the App, user router to pick main pages
export default App = {
    name: 'App',
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
}

</script>
<style >
:root {
    --shadow-1: rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px, rgba(0, 0, 0, 0.3) 0px 2px 4px -1px;
    --shadow-3: rgba(0, 0, 0, 0.14) 0px 8px 17px 2px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px, rgba(0, 0, 0, 0.2) 0px 5px 5px -3px;
    --vue-green: #4fc08d;
    --material-blue: #2195f3;
    --blue: #60a5de;
}
body {
    background: radial-gradient(circle, rgb(245, 245, 245) 0%, rgb(218, 218, 218) 100%);
}
</style>