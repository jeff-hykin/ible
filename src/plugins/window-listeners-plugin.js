// api
//     windowListeners:{}
let Vue = require("vue").default

let windowListenersSymbol = Symbol("$windowListeners")
Object.defineProperty(Vue.prototype, "$windowListeners", {
    get() {
        if (this[windowListenersSymbol] == undefined) {
            this[windowListenersSymbol] = {}
        }
        return this[windowListenersSymbol]
    },
    set(value) {
        this[windowListenersSymbol] = value
    }
})
Vue.mixin(module.exports = {
    beforeCreate () {
        const newOption = this.$options.windowListeners
        if (!newOption) {
            return
        }
        const vueStaticDestination = this.$windowListeners || this
        if (vueStaticDestination instanceof Object) {
            if (newOption instanceof Function) {
                Object.assign(vueStaticDestination, newOption.apply(this))
            } else if (typeof newOption === 'object') {
                Object.assign(vueStaticDestination, newOption)
            }
        }
        
        if (this.$windowListeners instanceof Object) {
            for (let [eachKey, eachValue] of Object.entries(this.$windowListeners)) {
                if (eachValue.bind instanceof Function) {
                    eachValue = eachValue.bind(this)
                }
                window.addEventListener(eachKey, eachValue)
            }
        }
    },
    beforeDestroy() {
        // remove all the listeners
        if (this[windowListenersSymbol] instanceof Object) {
            for (let [eachKey, eachValue] of Object.entries(this[windowListenersSymbol])) {
                window.removeEventListener(eachKey, eachValue)
            }
        }
    }
})