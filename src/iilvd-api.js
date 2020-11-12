let Vue = require("vue").default
let ezRpc = require("ez-rpc-frontend")

// const databaseUrl = "http://192.168.86.198:3000"
// const databaseUrl = "http://localhost:3000"
// const databaseUrl = "http://paradise.cs.tamu.edu:3000"
// const databaseUrl = "http://192.168.192.57:3000"
// const ezRpcUrl = "http://192.168.192.137:54321" // my desktop db 
// const ezRpcUrl = "http://128.194.4.15:3000" // csce-jiang1.engr.tamu.edu:3000
const ezRpcUrl = "http://128.194.4.15:6283" // csce-jiang1.engr.tamu.edu:6283
const key = "4a75cfe3cdc1164b67aae6b413c9714280d2f102"

window.backend = ezRpc.buildInterfaceFor(ezRpcUrl)

module.exports = {
    backend,
    mixin: {
        data: ()=>({
            backend,
        }),
    },
}

// add the backend to all of the components
Vue.mixin(module.exports.mixin)