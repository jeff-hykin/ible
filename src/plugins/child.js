// api
//     $child(...args)
let Vue = require("vue").default

Object.defineProperty(Vue.prototype, "$child", {
    get() {
        return (firstRef, ...args) => new Promise((resolve, reject) => {
            let checker
            checker = () => {
                let ref = this.$refs[firstRef]
                // base case
                if (ref && args.length === 0) {
                    resolve(ref)
                // recursive child case
                } else if (ref) {
                    ref.$child(...args).then(resolve)
                // recursive wait case
                } else {
                    this.$nextTick(()=>{
                        setTimeout(checker, 500)
                    })
                }
            }
            checker()
        })
    },
})
