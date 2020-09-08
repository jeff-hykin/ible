// api
//     [resolvable].promise
//     [resolvable].resolve()
//     [resolvable].reject()
//     [resolvable].done
let Vue = require("vue").default

let {logBlock } = require("good-js")

Vue.prototype.$resolvables = {}
const resolvablesSymbol = Symbol("resolvables")
Vue.mixin(module.exports = {
    beforeCreate () {
        const newOption = this.$options.resolvables
        if (!newOption) {
            return
        }
        const vueStaticDestination = this.$resolvables || this
        if (vueStaticDestination instanceof Object) {
            if (newOption instanceof Function) {
                Object.assign(vueStaticDestination, newOption.apply(this))
            } else if (typeof newOption === 'object') {
                Object.assign(vueStaticDestination, newOption)
            }
        }

        this[resolvablesSymbol] = {}
        if (this.$resolvables instanceof Object) {
            for (let [eachKey, eachValue] of Object.entries(this.$resolvables)) {
                    
                this[resolvablesSymbol][eachKey] = []
                let checkerFunction = eachValue
                if (checkerFunction.bind instanceof Function) {
                    checkerFunction = checkerFunction.bind(this)
                }
                
                // 
                // initial synchronous promise workaround
                // 
                    // we can't extract the resolve/reject values outside of the promise
                    //     ex: new Promise((resolve, reject)=>{})
                    // because that function is loaded asyncly and this function is synchronous
                    // meaning the external resolve this function tries to create would
                    // fail if the user calls resolve() before the promise
                    // has had time to set itself up so this code here creates a stand-in
                    // resolve() function to handle that initial case
                const beforeInitActionArg = Symbol()
                const beforeInitResolveCalled = Symbol()
                const beforeInitRejectCalled = Symbol()
                const promiseKey = Symbol("promiseKey")
                const resolveKey = Symbol("resolveKey")
                const rejectKey = Symbol("rejectKey")
                const checkerRunningKey = Symbol("checkerRunningKey")
                let resetSyncCallbackData = ()=> {
                    checkerFunction.done = false
                    this[resolvablesSymbol][eachKey][beforeInitActionArg] = undefined
                    this[resolvablesSymbol][eachKey][beforeInitResolveCalled] = false
                    this[resolvablesSymbol][eachKey][beforeInitRejectCalled] = false
                    this[resolvablesSymbol][eachKey][checkerRunningKey] = false
                }
                // 
                // init the check
                // 
                resetSyncCallbackData()
                checkerFunction.resolve = (arg)=>{
                    // find and use the latest resolver if it exists
                    if (checkerFunction[promiseKey][resolveKey]) {
                        // call the low level resolver
                        checkerFunction[promiseKey][resolveKey](arg)
                    // otherwise this function was called before any resolver was setup
                    // and it needs to fallback on the sync method
                    // the promise setup will look for (and cleanup) these values
                    } else {
                        this[resolvablesSymbol][eachKey][beforeInitResolveCalled] = true
                        this[resolvablesSymbol][eachKey][beforeInitActionArg] = arg
                    }
                }
                checkerFunction.reject = (arg)=>{
                    // find and use the latest rejector if it exists
                    if (checkerFunction[promiseKey][rejectKey]) {
                        checkerFunction[promiseKey][rejectKey](arg)
                    // otherwise this function was called before any resolver was setup
                    // and it needs to fallback on the sync method
                    // the promise setup will look for (and cleanup) these values
                    } else {
                        this[resolvablesSymbol][eachKey][beforeInitRejectCalled] = true
                        this[resolvablesSymbol][eachKey][beforeInitActionArg] = arg
                    }
                }
                checkerFunction.check = async ()=>{
                    // basically don't schedule a bunch of checks if the first one never finished
                    if (!this[resolvablesSymbol][eachKey][checkerRunningKey] && !checkerFunction.done) {
                        this[resolvablesSymbol][eachKey][checkerRunningKey] = true
                        // not sure if func will be async or not so wrap it inside async
                        let result = await (async ()=>checkerFunction(checkerFunction.resolve, checkerFunction.reject))()
                        this[resolvablesSymbol][eachKey][checkerRunningKey] = false
                    }
                }
                
                // calling this mutliple times would
                let synclyRefreshCheckerFunctionPromise = ()=>{
                    // create a new checking promise
                    let promiseData = {}
                    promiseData.id = Math.random()
                    const aPromise = new Promise((resolve, reject)=> setTimeout(() => {
                        // check if it was synchronously resolved first
                        if (this[resolvablesSymbol][eachKey][beforeInitResolveCalled]) {
                            // resolve the promise
                            resolve(this[resolvablesSymbol][eachKey][beforeInitActionArg])
                            resetSyncCallbackData()
                            return
                        } else if (this[resolvablesSymbol][eachKey][beforeInitRejectCalled]) {
                            reject(this[resolvablesSymbol][eachKey][beforeInitActionArg])
                            resetSyncCallbackData()
                            return
                        }
                        // then do the normal checking
                        promiseData[rejectKey] = (...args)=>{
                            (!checkerFunction.done) && reject(...args)
                            resetSyncCallbackData()
                        }
                        promiseData[resolveKey] = (...args)=>{
                            (!checkerFunction.done) && resolve(...args)
                            resetSyncCallbackData()
                        }
                        Object.assign(aPromise, promiseData)
                        
                        // immediately run the check
                        checkerFunction.check()
                        
                        // check again after 1 second
                        // TODO: make this customizable
                        setTimeout(()=>{
                            checkerFunction.check()
                        }, 1000)

                        // if the promise isn't resolved after those checks
                        // then something else from somewhere else needs to call the resolve
                    }, 0))
                    // attach the new promise
                    checkerFunction[promiseKey] = Object.assign(aPromise, promiseData)
                    // synchronously reset the resolved status
                    checkerFunction.done = false
                }
                // init the first promise
                synclyRefreshCheckerFunctionPromise()
                
                // add promise getter 
                Object.defineProperty(checkerFunction, "promise", {
                    get() {
                        // if not yet resolved, check it, then return the existing promise
                        if (!checkerFunction.done) {
                            // run the check again, if the other checks are complete
                            checkerFunction.check()
                            // return the promise
                            return checkerFunction[promiseKey]
                        // if already resolved, then create a new promise
                        // so that the re-check can run
                        } else {
                            // this will call the check function as soon as the promise loads
                            synclyRefreshCheckerFunctionPromise()
                            return checkerFunction[promiseKey]
                        }
                    }
                })
                
                // create the property on the component
                Object.defineProperty(this, eachKey, {
                    get() {
                        return checkerFunction
                    }
                })
            }
        }
    },
})