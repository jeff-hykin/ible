// api
//     workers
// summary
//     workers are aynsc functions that can only have
//     one active instance
//     calling a worker function again before the first one is finished    
//     will simply wait for the first one to finish and return that output

let Vue = require("vue").default

let workersSymbol = Symbol("$workers")
Object.defineProperty(Vue.prototype, "$workers", {
    get() {
        if (this[workersSymbol] == undefined) {
            this[workersSymbol] = {}
        }
        return this[workersSymbol]
    },
    set(value) {
        this[workersSymbol] = value
    }
})
Vue.mixin(module.exports = {
    beforeCreate () {
        const newOption = this.$options.workers
        if (!newOption) {
            return
        }
        const vueStaticDestination = this.$workers || this
        if (vueStaticDestination instanceof Object) {
            if (newOption instanceof Function) {
                Object.assign(vueStaticDestination, newOption.apply(this))
            } else if (typeof newOption === 'object') {
                Object.assign(vueStaticDestination, newOption)
            }
        }
        
        // 
        // watchers
        // 
        const thisComponent = this
        if (this.$workers instanceof Object) {
            for (let [eachKey, eachValue] of Object.entries(this.$workers)) {
                // if its a function that can be bound
                if (eachValue instanceof Function) {
                    const functionAttachedToInstance = eachValue.bind(thisComponent)
                    let functionIsRunning = false
                    let promiseToRunningFunction = null
                    // wrap the function in a checker
                    this.$methods[eachKey] = this.$workers[eachKey] = async (...args) => {
                        if (!functionIsRunning) {
                            functionIsRunning = true
                            promiseToRunningFunction = functionAttachedToInstance(...args)
                        }
                        let result = await promiseToRunningFunction
                        functionIsRunning = false
                        return result
                    }
                }
            }
        }
    },
})