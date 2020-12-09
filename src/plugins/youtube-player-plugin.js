import Vue from 'vue'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'

Vue.use(VuePlyr, {
    plyr: {
        hideControls: false,
        keyboard: {
            focused: true,
            global: true,
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
        invertTime: false,
    }
})