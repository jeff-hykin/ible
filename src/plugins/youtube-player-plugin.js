import Vue from 'vue'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'

Vue.use(VuePlyr, {
    plyr: {
        seekTime: 5, // default skip amount is 5 seconds
        hideControls: false,
        keyboard: {
            focused: false,
            global: false,
        },
        tooltips: {
            controls: true,
            seek: true,
        },
        fullscreen: {
            enabled: false,
            fallback: false,
            iosNative: false,
            container: null,
        },
        youtube: {
            noCookie: false,
        },
        invertTime: false,
    }
})