let Vue = require("vue").default
let ezRpc = require("ez-rpc-frontend")
let { deferredPromise, asyncIteratorToList } = require("./utils.js")
let { get, set, remove } = require("./object.js")
let { toKebabCase, toSnakeCase, toScreamingtoKebabCase, toScreamingtoSnakeCase } = require("./string.js")

// const databaseUrl = "http://192.168.86.198:3000"
// const databaseUrl = "http://localhost:3000"
// const databaseUrl = "http://paradise.cs.tamu.edu:3000"
// const databaseUrl = "http://192.168.192.57:3000"
// const ezRpcUrl = "http://192.168.86.222:6283" // my desktop db 
// const ezRpcUrl = "http://128.194.4.15:3000" // csce-jiang1.engr.tamu.edu:3000
// const ezRpcUrl = "http://128.194.4.15:6283" // csce-jiang1.engr.tamu.edu:6283
const ezRpcUrl = "http://127.0.0.1:6283"
const key = "4a75cfe3cdc1164b67aae6b413c9714280d2f102"

 
// 
// indexDB solution
// 
let db
const dbPromise = deferredPromise()
var dbName = "main"
var storeName = "mainStore"
Object.assign(
    indexedDB.open(dbName, 1),
    {
        onerror(event) {
            dbPromise.reject(event)
        },
        onsuccess(event) {
            db = event.target.result
            dbPromise.resolve() // dont resolve with db because it can change/update
        },
        onupgradeneeded(event) {
            db = event.target.result
            const mainObjectStore = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: false })
            mainObjectStore.createIndex("t", "t", { unique: false })
        }
    }
)
const makeIterator = (tableName)=>{
    return async function* () {
        const transaction = db.transaction([storeName], 'readonly')
        const objectStore = transaction.objectStore(storeName)
        let nextIsReady = deferredPromise()
        let cursor = { continue() {} }
        const element = { value: null, done: false }
        const request = objectStore.index('t').openCursor(IDBKeyRange.only(tableName))
        
        // if early death
        transaction.onerror = (error)=>(nextIsReady.state != 'pending') &&  nextIsReady.reject(error)
        
        let requestPromise = deferredPromise()
        request.onsuccess = function(event) {
            requestPromise.resolve()
            cursor = event.target.result
            if (cursor) {
                element.value = cursor.value
                nextIsReady.resolve(element)
            } else {
                cursor = { continue() {} }
                element.done = true
                nextIsReady.resolve(element)
            }
        }
    
        request.onerror = function(event) {
            requestPromise.reject(event)
        }
        await requestPromise
        while (true) {
            const output = await nextIsReady
            if (output.done) {
                break
            }
            nextIsReady = deferredPromise()
            cursor.continue()
            yield [ output.value.k, output.value.v ]
        }
    }
}
const quickHash = (str)=>{
    let hash = 0, i = 0, len = str.length;
    while ( i < len ) {
        hash  = ((hash << 5) - hash + str.charCodeAt(i++)) << 0
    }
    return hash
}
const indexDb = {
    loaded: dbPromise,
    _tableNames: new Set(JSON.parse(localStorage.getItem("_tableNames")||"[]")),
    /**
     * @example
     * ```js
     * await indexDb.puts([  [["videos","a"],{a:10}], [["videos","b"],{b:20}] ])
     * ```
     */
    async puts(addressValuePairs) {
        if (!db) {
            await dbPromise
        }

        // optimizations:
        // - group by store
        // - group by base key (do all object mutations in group)

        const tableMapping = {}
        for (const [address, value] of addressValuePairs) {
            const table = address[0]
            const key = address[1]
            if (key) {
                tableMapping[table] = tableMapping[table]||{}
                tableMapping[table][key] = tableMapping[table][key]||[]
                tableMapping[table][key].push([address.slice(2), value])
            }
        }

        // ensure all tables exist
        for (const eachTableName in tableMapping) {
            if (!indexDb._tableNames.has(eachTableName)) {
                indexDb._tableNames.add(eachTableName)
                localStorage.setItem("_tableNames", JSON.stringify([...indexDb._tableNames]))
            }
        }
        
        const transaction = db.transaction([storeName], 'readwrite')
        const objectStore = transaction.objectStore(storeName)
        const transactionPromise = new Promise((resolve, reject) => {
            transaction.oncomplete = resolve
            transaction.onerror = reject
        })
        // 
        // for each table
        // 
        await Promise.all(
            Object.entries(tableMapping).map(
                // 
                // for each key
                // 
                async ([tableName, keyMapping])=>{
                    
                    // up to 40 things in parallel
                    // higher can overload RAM usage with too many promises
                    let limiter = 40
                    const promises = []
                    for (const [key, innerAddressPairs] of Object.entries(keyMapping)) {
                        if (!key) {
                            continue
                        }
                        const id = JSON.stringify([tableName, key])
                        // 
                        // one promise/request per key
                        // 
                        const request = objectStore.get(id)
                        const index = promises.length
                        const pending = promises.filter(each=>each!=null)
                        if (pending.length >= limiter) {
                            try {
                                await Promise.any(pending)
                            } catch (error) {
                                reject(error)
                            }
                        }
                        promises.push(
                            (new Promise((resolve, reject)=>{
                                request.onsuccess = ()=>resolve(request)
                                request.onerror = reject
                            })).then(({result})=>{
                                // enforce is object
                                let existingValue = result?.v instanceof Object ? result.v : {}
                                
                                // 
                                // for each assignment
                                // 
                                for (const [subAddress, value] of innerAddressPairs) {
                                    if (subAddress.length == 0) {
                                        existingValue = value
                                    } else {
                                        set({ keyList: subAddress, to: value, on: existingValue })
                                    }
                                }
                                
                                return new Promise(
                                    (resolve, reject)=>
                                        Object.assign(
                                            objectStore.put({id:id, k: key, t: tableName, v:existingValue,}), 
                                            {
                                                onsuccess:resolve,
                                                onerror:reject,
                                            },
                                        )
                                )
                            // mark self as done
                            }).then(()=>{
                                promises[index] = null // for the limiter
                            })
                        )
                    }
                    
                    // await remaining in parallel
                    await Promise.all(promises.filter(each=>each!=null))
                }
            )
        )

        return transactionPromise
    },
    async *gets(addresses) {
        addresses = [...addresses]
        const next = await dbPromise.then(()=>new Promise((resolve, reject)=>{
            const transaction = db.transaction([storeName], 'readwrite')
            const objectStore = transaction.objectStore(storeName)
            transaction.onerror = reject
            const output = { done: false, value: null }
            const next = () => {
                const address = addresses.shift()
                if (address.length < 2 || addresses.some(each=>typeof each != 'string')) {
                    console.warn(`bad address:`,address)
                    return null
                }
                const [ tableName, key, ...subAddress ] = address
                const id = JSON.stringify([tableName, key])
                let requestPromise
                const request = objectStore.get(id)
                Object.assign(request, {
                    onsuccess: ()=>requestPromise.resolve(
                        [ address, get({ keyList: subAddress, from: request.result?.v, failValue: undefined }) ],
                    ),
                    onerror: (err)=>requestPromise.reject(err),
                })
                requestPromise = deferredPromise()
                return requestPromise
            }
            resolve(next)
        }))
        while (addresses.length > 0) {
            yield next()
        }
    },
    // deletes
    async deletes(addresses) {
        addresses = [...addresses]
        const next = await dbPromise.then(()=>new Promise((resolve, reject)=>{
            const transaction = db.transaction([storeName], 'readwrite')
            const objectStore = transaction.objectStore(storeName)
            transaction.onerror = reject
            Promise.all(
                addresses.map(address=>{
                    if (address.length < 2 || addresses.some(each=>typeof each != 'string')) {
                        console.warn(`bad address:`,address)
                        return null
                    }
                    const [ tableName, key, ...subAddress ] = address
                    const id = JSON.stringify([tableName, key])
                    // 
                    // delete whole object
                    // 
                    if (subAddress.length == 0) {
                        const request = objectStore.delete(id)
                        const requestPromise = deferredPromise()
                        Object.assign(request, {
                            onsuccess: ()=>requestPromise.resolve(),
                            onerror: (err)=>requestPromise.reject(err),
                        })
                        return requestPromise
                    // 
                    // delete part of object
                    // 
                    } else {
                        return new Promise((resolve, reject)=>{
                            const request = objectStore.get(id)
                            const requestPromise = deferredPromise()
                            Object.assign(request, {
                                onsuccess: ()=>requestPromise.resolve(request.result?.v),
                                onerror: (err)=>requestPromise.reject(err),
                            })
                            return requestPromise.then(
                                existingValue=>{
                                    if (existingValue instanceof Object) {
                                        remove({ keyList: subAddress, from: existingValue })
                                        return new Promise(
                                            (resolve, reject)=>
                                                Object.assign(
                                                    objectStore.put({id:id, k: key, t: tableName, v:existingValue,}), 
                                                    {
                                                        onsuccess:resolve,
                                                        onerror:reject,
                                                    },
                                                )
                                        )
                                    }
                                }
                            ).catch(reject)
                        })
                    }
                })
            ).then(resolve).catch(reject)
        }))
    },
    get keys() {
        return [...indexDb._tableNames]
    },
    /**
     * iterate keys and values
     *
     * @example
     *     for await (const [ key, value ] of indexDb.iter.videos) {
     *         console.log(key, value)
     *     }
     */
    get iter() {
        return Object.defineProperties({}, Object.fromEntries(
            [...indexDb._tableNames].map(
                tableName=>[
                    tableName,
                    {
                        get() {
                            return makeIterator(tableName)()
                        }
                    }
                ]
            )
        ))
    },
    // all entries
    async *[Symbol.asyncIterator]() {
        const transaction = db.transaction([storeName], 'readonly')
        const objectStore = transaction.objectStore(storeName)
        let nextIsReady = deferredPromise()
        let cursor = { continue() {} }
        const element = { value: null, done: false }
        const request = objectStore.openCursor()
        
        // if early death
        transaction.onerror = (error)=>(nextIsReady.state != 'pending') &&  nextIsReady.reject(error)
        
        let requestPromise = deferredPromise()
        request.onsuccess = function(event) {
            requestPromise.resolve()
            cursor = event.target.result
            if (cursor) {
                element.value = cursor.value
                nextIsReady.resolve(element)
            } else {
                cursor = { continue() {} }
                element.done = true
                nextIsReady.resolve(element)
            }
        }

        request.onerror = function(event) {
            requestPromise.reject(event)
        }
        await requestPromise
        while (true) {
            const output = await nextIsReady
            if (output.done) {
                break
            }
            nextIsReady = deferredPromise()
            cursor.continue()
            yield output.value
        }
    },
    async get(address) {
        for await (const [ address, each ] of indexDb.get(address)) {
            return each
        }
    },
}
// tables
    // labels
    // observations
    // videos
    // observers
// FIXME: find everywhere I use the `mongoInterface`
const fakeBackend = {
    async addObservation(observationEntry) {
        if (!db) {
            await await indexDb.loaded
        }
        // observationEntry = {
        //     "videoId": "FLK5-00l0r4",
        //     "type": "segment",
        //     "startTime": 125.659,
        //     "endTime": 127.661,
        //     "observer": "CSCE636-Spring2021-WuAiSeDUdl-1",
        //     "isHuman": true,
        //     "observation": {
        //         "label": "happy",
        //         "labelConfidence": -0.99
        //     }
        // }
        const labelAddress = ["labels", observationEntry.label]
        const labelInfo = (await indexDb.get(labelAddress)||{})
        
        const observerAddress = ["observers", observationEntry.observer]
        const observerInfo = (await indexDb.get(observerAddress)||{})
        
        const videoAddress = ["videos", observationEntry.videoId]
        const videoInfo = (await indexDb.get(videoAddress)||{})
        
        // enforce simplfied names
        observationEntry.observation.label = toKebabCase(observationEntry.observation.label)
        observationEntry.observer = toKebabCase(observationEntry.observer)
        const { videoId, type, startTime, endTime, observer } = observationEntry
        const { label, spacialInfo } = observationEntry.observation
        const observationKey = `${quickHash(JSON.stringify({ videoId, type, startTime, endTime, observer, label, spacialInfo }))}`
        const observationAddress = ["observations", observationKey]
        
        indexDb.puts([
            // add video
            [
                videoAddress,
                {
                    ...videoInfo,
                    observationCount: videoInfo?.count+1,
                    labelCount: {...videoInfo?.labelCount, [label]: ((videoInfo?.labelCount||{})[label]||0)+1},
                }
            ],
            // add observer
            [
                observerAddress,
                {
                    ...observerInfo,
                    observationCount: observerInfo?.count+1,
                    labelCount: {...observerInfo?.labelCount, [label]: ((observerInfo?.labelCount||{})[label]||0)+1},
                    videos: [...new Set(...((observerInfo?.videos||[]).concat([observation.videoId])))],
                }
            ],
            // update labels
            [
                labelAddress,
                {
                    ...labelInfo,
                    count: (labelInfo?.count||0)+1,
                    videos: [...new Set(...((labelInfo?.videos||[]).concat([observation.videoId])))],
                },
            ],
            // add observation
            [
                observationAddress,
                observationEntry,
            ],
        ])
    },
    addSegmentObservation(...args) {
        return fakeBackend.addObservation(...args)
    },
    changeDb() {
        // done (do nothing)
    },
    async collectionNames() {
        await indexDb.loaded
        // done (just used to load the db)
        return indexDb.keys()
    },
    async getUsernames() {
        await indexDb.loaded
        let usernames = []
        for await (const [ key, each ] of await indexDb.iter.observers) {
            usernames.push(key)
        }
        return usernames
    },
    summary: {
        general(filterAndSort) {
            // filterAndSort = {
            //     "minlabelConfidence":
            //     "maxlabelConfidence":
            //     "kindOfObserver":
            //     "validation":
            //     "observer":
            //     labelName:
            // }
            // FIXME:
        },
        labels() {
            // FIXME:
        }
    },
}
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