// api
//     rootHooks
let Vue = require("vue").default

let rootHooksSymbol = Symbol("$rootHooks")
Object.defineProperty(Vue.prototype, "$rootHooks", {
    get() {
        if (this[rootHooksSymbol] == undefined) {
            this[rootHooksSymbol] = {}
        }
        return this[rootHooksSymbol]
    },
    set(value) {
        this[rootHooksSymbol] = value
    }
})
const unwatcherSymbol = Symbol("unwatchers")
Vue.mixin(module.exports = {
    beforeCreate () {
        const newOption = this.$options.rootHooks
        if (!newOption) {
            return
        }
        const vueStaticDestination = this.$rootHooks || this
        if (vueStaticDestination instanceof Object) {
            if (newOption instanceof Function) {
                Object.assign(vueStaticDestination, newOption.apply(this))
            } else if (typeof newOption === 'object') {
                Object.assign(vueStaticDestination, newOption)
            }
        }
        
        this[unwatcherSymbol] = []
        // 
        // watchers
        // 
        const thisComponent = this
        if (this.$rootHooks.watch instanceof Object) {
            for (let [eachKey, eachValue] of Object.entries(this.$rootHooks.watch)) {
                if (eachValue.bind instanceof Function) {
                    eachValue = this.$rootHooks.watch[eachKey] = eachValue.bind(thisComponent)
                }
                this[unwatcherSymbol].push(
                    this.$root.$watch(eachKey, eachValue, {deep: true})
                )
            }
        }
    },
    beforeDestroy() {
        // call all of the unwatchers
        if (this[unwatcherSymbol] instanceof Array) {
            for (let each of this[unwatcherSymbol]) {
                each()
            }
        }
    }
})