// api
//     this.withoutWatchers(source, callback)
let Vue = require("vue").default
// TODO: potenial issue if a second source calls this before the first one ends (async)
// TODO: issues with dynamically added watchers
Vue.mixin(module.exports = {
    methods: {
        $withoutWatchers(source, callback) {
            const watchers = this._watchers.map((watcher) => ({ cb: watcher.cb, sync: watcher.sync }))
            
            // disable
            for (let index in this._watchers) {
                this._watchers[index] = Object.assign(this._watchers[index], { cb: () => null, sync: true })
            }

            if (this.$withoutWatchers.showSource) {
                console.group(`[${source}] suspended all watch functions`)
            }
            callback()
            if (this.$withoutWatchers.showSource) {
                console.groupEnd()
                console.log(`[${source}] resumed all watch functions`)
            }
            
            // enable
            for (let index in this._watchers) {
                this._watchers[index] = Object.assign(this._watchers[index], watchers[index])
            }
        },
    },
})