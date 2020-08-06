<template lang="pug">
    #app
        // [ Put stuff you always want to exist here (like a nav bar) ]
        // This (below) will load to the Home page by default 
        router-view
</template>
<script>
    // libs and plugins
    import Vue from "vue"
    import { Router } from './plugins/router-plugin'
    import './plugins/css-baseline-plugin'
    import './plugins/good-vue-plugin'
    
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