let { deferredPromise, asyncIteratorToList, getColor, dynamicSort } = require("./utils.js")
let { get, set, remove } = require("./object.js")
let { toKebabCase, toSnakeCase, toScreamingtoKebabCase, toScreamingtoSnakeCase } = require("./string.js")
const observationTooling = require("./observation_tooling.js")
import * as basics from "./tooling/basics.bundle.js"
 
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
        if (!db) {
            await dbPromise
        }
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

/**
 * Wrapper for Indexed DB
 *
 * @note
 *     This wrapper is designed to be treated like one big JavaScript object
 *     - not only does get([tableName, id ]) return the item,
 *       but also get([tableName, id, subKey ]) returns the value of the subKey
 *       and get([tableName, id, subKey, subSubKey ]) returns the value of the subSubKey
 *     - same for delete, you can delete an item or a subkey
 *     - NOTE1: "puts" merges! and creates if it doesn't exist
 *     - NOTE2: for sanity reasons, you can't do get([tableName,]) to get the entire table
 *       or delete([tableName,]) to delete the entire table
 *     - NOTE3: items don't store the id within themselves, there's no designated id attribute
 *     
 *     Implementation details:
 *     - everything is stored in a single database in Indexed DB
 *     - AKA every item for every "table" are all in the same array/database
 *     - the "tables" are just the value of the "t" field
 *     - there's an index ("t") on the table key to make looking them up faster
 *     - every entry in the native database has a 
 *       "t" (table) field
 *       "k" (key) field, NOTE: not globally unique only per-table unique 
 *       "id" (uuid), a combination of the table and key (fully unique)
 *       "v" (value) field, should always be a JavaScript object, but not strictly enforced/checked
 *
 */
const indexDb = {
    loaded: dbPromise,
    _tableNames: new Set(JSON.parse(localStorage.getItem("_tableNames")||"[]")),

    /**
     * Shallow Merges with existing data (creates if doesn't exist)
     *
     * @example
     * ```js
     * await indexDb.puts([  [["videos","a"],{a:10}], [["videos","b"],{b:20}] ])
     * ```
     *
     * @param {[[[String], Object]]} addressValuePairs - tableName, key
     * @returns {Promise} - promise around native indexed DB transaction
     *
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
                                        if (value instanceof Object) {
                                            existingValue = basics.merge({oldData: existingValue, newData: value })
                                        } else {
                                            existingValue = value
                                        }
                                    } else {
                                        const existingSubValue = get({ keyList: subAddress, failValue: undefined, from: existingValue })
                                        let newValue = value
                                        if (newValue instanceof Object) {
                                            newValue = basics.merge({oldData: existingSubValue||{}, newData: newValue })
                                        }
                                        set({ keyList: subAddress, to: newValue, on: existingValue })
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
    /**
     * retrieve multiple key-values
     *
     * @example
     * ```js
     *     // NOTE the "await" in "for await", its required
     *     for await (const [ id, value ] of indexDb.gets([
     *         ["videos", "a"],
     *         ["videos", "b"],
     *         ["videos", "c"],
     *     ])) {
     *         console.log(id, value)
     *     }
     * ```
     *
     * @param {[[String]]} addresses - tableName, key
     * @returns {AsyncIterator<>} output - description
     *
     */
    async *gets(addresses) {
        if (!db) {
            await dbPromise
        }
        addresses = [...addresses]
        // a little weird, but done so that the transaction.onerror would reject the promise
        // TODO: there's still the possibility of transaction.onerror being called after the promise is resolved
        //       should just rewrite this whole file to use dexie.js 
        const next = await new Promise((resolve, reject)=>{
            const transaction = db.transaction([storeName], 'readwrite')
            const objectStore = transaction.objectStore(storeName)
            transaction.onerror = reject
            const output = { done: false, value: null }
            const next = () => {
                const address = addresses.shift()
                if (address.length < 2 || address.some(each=>typeof each != 'string')) {
                    console.warn(`bad address:`,address)
                    return null
                }
                const [ tableName, key, ...subAddress ] = address
                const id = JSON.stringify([tableName, key])
                let requestPromise
                const request = objectStore.get(id)
                Object.assign(request, {
                    onsuccess: (thingy)=>{
                        if (subAddress.length == 0) {
                            requestPromise.resolve(
                                [ address, request.result?.v ]
                            )
                        } else {
                            const value = get({ keyList: subAddress, from: request.result?.v, failValue: undefined })
                            console.debug(`request.result is:`,request.result)
                            requestPromise.resolve(
                                [ address, value ],
                            )
                        }
                        return requestPromise
                    },
                    onerror: (err)=>requestPromise.reject(err),
                })
                requestPromise = deferredPromise()
                return requestPromise
            }
            resolve(next)
        })
        while (addresses.length > 0) {
            yield next()
        }
    },
    /**
     * delete mutliple items
     *
     * @example
     *     indexDb.deletes([
     *         ["videos", "a"],
     *         ["videos", "b"],
     *         ["videos", "c"],
     *     ])
     */
    async deletes(addresses) {
        if (!db) {
            await dbPromise
        }
        addresses = [...addresses]
        const transaction = db.transaction([storeName], 'readwrite')
        const objectStore = transaction.objectStore(storeName)
        transaction.onerror = (error)=>console.error(`[indexDb.deletes] ${error}`)
        return Promise.all(
            addresses.map(address=>{
                if (address.length < 2 || address.some(each=>typeof each != 'string')) {
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
                    console.debug(`delete request is:`,request)
                    const requestPromise = deferredPromise()
                    Object.assign(request, {
                        onsuccess: (...args)=>requestPromise.resolve(request, args),
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
        )
    },
    async getTableNames() {
        if (!db) {
            await dbPromise
        }
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
        const originalThing = Object.defineProperties({}, Object.fromEntries(
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
        const proxySymbol = Symbol.for('Proxy')
        const thisProxySymbol = Symbol('thisProxy')
        // originalThing[Symbol.iterator]      // used by for..of loops and spread syntax.
        // originalThing[Symbol.toPrimitive]
        return new Proxy(originalThing, {
            // Object.keys
            ownKeys(target, ...args) { return Reflect.ownKeys(target, ...args) },
            // new operator (original value needs to be a class)
            construct(original, args, originalConstructor) {},
            get(original, key, ...args) {
                if (key == proxySymbol||key == thisProxySymbol) {return true}
                if (!Object.hasOwn(original, key)) {
                    return (async function*(){})()
                }
                return Reflect.get(original, key, ...args)
            },
            set(original, key, ...args) {
                if (key == proxySymbol||key == thisProxySymbol) {return}
                return Reflect.set(original, key, ...args)
            },
            has: Reflect.has,
            deleteProperty: Reflect.deleteProperty,
            isExtensible: Reflect.isExtensible,
            preventExtensions: Reflect.preventExtensions,
            setPrototypeOf: Reflect.setPrototypeOf,
            defineProperty: Reflect.defineProperty,
            getPrototypeOf: Reflect.getPrototypeOf,
            getOwnPropertyDescriptor: Reflect.getOwnPropertyDescriptor,
        })
    },
    // all entries
    async *[Symbol.asyncIterator]() {
        if (!db) {
            await dbPromise
        }
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
        for await (const [ _, each ] of indexDb.gets([address])) {
            return each
        }
    },
    set(address, value) {
        return indexDb.puts([[address, value]])
    },
    async select({from, where=[], returnObject=false}) {
        let output
        if (returnObject) {
            output = {}
        } else {
            output = []
        }

        if (where.length == 0) {
            if (returnObject) {
                for await (const [ key, each ] of indexDb.iter[from]) {
                    output[key] = each
                }
            } else {
                for await (const [ key, each ] of indexDb.iter[from]) {
                    output.push(each)
                }
            }
        } else {
            const equalityCheckers             = where.filter(each=>Object.keys(each).includes("is"))
            const notEqualCheckers             = where.filter(each=>Object.keys(each).includes("isNot"))
            const lessThanOrEqualToCheckers    = where.filter(each=>Object.keys(each).includes("isLessThanOrEqualTo"))
            const greaterThanOrEqualToCheckers = where.filter(each=>Object.keys(each).includes("isGreaterThanOrEqualTo"))
            const lessThanCheckers             = where.filter(each=>Object.keys(each).includes("isLessThan"))
            const greaterThanCheckers          = where.filter(each=>Object.keys(each).includes("isGreaterThan"))

            const passesChecks = (eachObject)=>{
                for (const rule of equalityCheckers) {
                    const value = get({ keyList: rule.valueOf, from: eachObject, failValue: undefined })
                    if (value !== rule.is) {
                        return false
                    }
                }
                for (const rule of notEqualCheckers) {
                    const value = get({ keyList: rule.valueOf, from: eachObject, failValue: undefined })
                    if (value === rule.isNot) {
                        return false
                    }
                }
                for (const rule of lessThanOrEqualToCheckers) {
                    const value = get({ keyList: rule.valueOf, from: eachObject, failValue: NaN })
                    if (value !== value || value > rule.isLessThanOrEqualTo) {
                        return false
                    }
                }
                for (const rule of greaterThanOrEqualToCheckers) {
                    const value = get({ keyList: rule.valueOf, from: eachObject, failValue: NaN })
                    if (value !== value || value < rule.isLessThanOrEqualTo) {
                        return false
                    }
                }
                for (const rule of lessThanCheckers) {
                    const value = get({ keyList: rule.valueOf, from: eachObject, failValue: NaN })
                    if (value !== value || value >= rule.isLessThan) {
                        return false
                    }
                }
                for (const rule of greaterThanCheckers) {
                    const value = get({ keyList: rule.valueOf, from: eachObject, failValue: NaN })
                    if (value !== value || value <= rule.isGreaterThan) {
                        return false
                    }
                }
                return true
            }

            if (returnObject) {
                for await (const [ key, each ] of indexDb.iter[from]) {
                    if (passesChecks(each)) {
                        output[key] = each
                    }
                }
            } else {
                for await (const [ key, each ] of indexDb.iter[from]) {
                    if (passesChecks(each)) {
                        output.push(each)
                    }
                }
            }
        }
        return output
    },
}
window.indexDb = indexDb

const managers = {
    labels: {
        async regenerate(existingValues, {addressesToIgnore=[], entriesToAssume=[]}={}) {
            const labels = {...existingValues}
            // reset computed values
            for (const [key, value] of Object.entries(labels)) {
                value.count = 0
                value.videos = new Set()
            }
            const observationKeysToSkip = addressesToIgnore.filter(
                    each=>each instanceof Array && each[0] == "observations"
                ).map(
                    each=>each[1]
                )
            const addEntry = (observationEntry)=>{
                if (observationEntry.label) {
                    const labelName = observationEntry.label
                    labels[labelName] = labels[labelName]||{}
                    labels[labelName].color = labels[labelName].color || getColor(labelName)
                    labels[labelName].count = (labels[labelName].count||0)+1
                    labels[labelName].videos = labels[labelName].videos||new Set()
                    labels[labelName].videos.add(observationEntry.videoId)
                }
            }
            for (const each of entriesToAssume) {
                addEntry(each)
            }
            for await (const [ key,observationEntry ] of indexDb.iter.observations) {
                if (observationKeysToSkip.includes(key)) {
                    continue
                }
                addEntry(observationEntry)
            }
            // convert sets to arrays
            for (const [key, value] of Object.entries(labels)) {
                value.videos = [...value.videos]
            }
            return labels
        },
        async whenEditObservations({oldObservationEntries, newObservationEntries, existingValues}) {
            // NOTE: this isn't very efficient.
                // We would need to change the data structure of the video to include the ID's of the observations
                // in order to maintain correctness and have ~O(1) operations for editing a observation.
                // Large bulk edits should still use this method, but for small edits we it would be better to use a
                // the incremental approach
            return managers.labels.regenerate(
                existingValues,
                {
                    addressesToIgnore:oldObservationEntries.map(each=>["observations", each.observationId]),
                    entriesToAssume: newObservationEntries,
                },
            )
        },
        renameLabels({oldLabelName, newLabelName, existingTables}) {
            existingTables.labels[newLabelName] = existingTables.labels[oldLabelName]
            delete existingTables.labels[oldLabelName]
            for (const [key, value] of Object.entries(existingTables.observations)) {
                if (value.label == oldLabelName) {
                    value.label = newLabelName
                }
            }
            return existingTables
        },
    },
    observers: {
        async regenerate(existingObservers, {addressesToIgnore=[], entriesToAssume=[]}={}) {
            const observers = {...existingObservers}
            // reset computed values
            for (const [key, value] of Object.entries(observers)) {
                value.observationCount = 0
                value.labelCounts = {}
                value.videos = new Set()
            }
            const observationKeysToSkip = addressesToIgnore.filter(
                    each=>each instanceof Array && each[0] == "observations"
                ).map(
                    each=>each[1]
                )
            const addEntry = (observationEntry)=>{
                if (observationEntry.observer) {
                    const videoId = observationEntry.videoId
                    const label = observationEntry.label
                    const observer = observationEntry.observer
                    observers[observer] = observers[observer]||{}
                    observers[observer].observationCount   = (observers[observer].observationCount||0)+1
                    observers[observer].labelCounts        = observers[observer].labelCounts||{}
                    observers[observer].labelCounts[label] = (observers[observer].labelCounts[label]||0)+1
                    observers[observer].videos             = observers[observer].videos||new Set()
                    observers[observer].videos.add(videoId)
                }
            }
            for (const each of entriesToAssume) {
                addEntry(each)
            }
            for await (const [ key,observationEntry ] of indexDb.iter.observations) {
                if (observationKeysToSkip.includes(key)) {
                    continue
                }
                addEntry(observationEntry)
            }
            // convert sets to arrays
            for (const [key, value] of Object.entries(observers)) {
                value.videos = [...value.videos]
            }
            return observers
        },
        async whenEditObservations({oldObservationEntries, newObservationEntries, existingValues}) {
            // NOTE: this isn't very efficient.
                // We would need to change the data structure of the video to include the ID's of the observations
                // in order to maintain correctness and have ~O(1) operations for editing a observation.
                // Large bulk edits should still use this method, but for small edits we it would be better to use a
                // the incremental approach
            return managers.labels.regenerate(
                existingValues,
                {
                    addressesToIgnore:oldObservationEntries.map(each=>["observations", each.observationId]),
                    entriesToAssume: newObservationEntries,
                },
            )
        },
        renameObserver({oldObserverName, newObserverName, existingTables}) {
            existingTables.observers[newObserverName] = existingTables.observers[oldObserverName]
            delete existingTables.observers[oldObserverName]
            for (const [key, value] of Object.entries(existingTables.observations)) {
                if (value.observer == oldObserverName) {
                    value.observer = newObserverName
                }
            }
            return existingTables
        },
    },
    // videos: {
    //     async regenerate(existingVideos, {addressesToIgnore=[], entriesToAssume=[]}={}) {
    //         const videos = {...existingVideos}
    //         // reset computed values
    //         for (const [key, value] of Object.entries(videos)) {
    //             value.observationCount = 0
    //             value.observationsPerLabel = {}
    //         }
    //         const observationKeysToSkip = addressesToIgnore.filter(
    //                 each=>each instanceof Array && each[0] == "observations"
    //             ).map(
    //                 each=>each[1]
    //             )
    //         const addEntry = (observationEntry)=>{
    //             if (observationEntry.videoId) {
    //                 const videoId = observationEntry.videoId
    //                 const label = observationEntry.label
    //                 videos[videoId] = videos[videoId]||{}
    //                 videos[videoId].count = (videos[videoId].count||0)+1
    //                 videos[videoId].observationsPerLabel = videos[videoId].observationsPerLabel||{}
    //                 videos[videoId].observationsPerLabel[label] = (videos[videoId].observationsPerLabel[label]||0)+1
    //             }
    //         }
    //         for (const each of entriesToAssume) {
    //             addEntry(each)
    //         }
    //         for await (const [ key,observationEntry ] of indexDb.iter.observations) {
    //             if (observationKeysToSkip.includes(key)) {
    //                 continue
    //             }
    //             addEntry(observationEntry)
    //         }
    //         return videos
    //     },
    //     async whenEditObservations({oldObservationEntries, newObservationEntries, existingValues}) {
    //         // NOTE: this isn't very efficient.
    //             // We would need to change the data structure of the video to include the ID's of the observations
    //             // in order to maintain correctness and have ~O(1) operations for editing a observation.
    //             // Large bulk edits should still use this method, but for small edits we it would be better to use a
    //             // the incremental approach
    //         return managers.labels.regenerate(
    //             existingValues,
    //             {
    //                 addressesToIgnore:oldObservationEntries.map(each=>["observations", each.observationId]),
    //                 entriesToAssume: newObservationEntries,
    //             },
    //         )
    //     },
    // },
}

const frontendDb = {
    async setObservations(observationEntries, {withCoersion=false}={}) {
        // observationEntries[0] = {
        //     "observationId": "1623456789.308420294042",
        //     "type": "segment",
        //     "videoId": "FLK5-00l0r4",
        //     "startTime": 125.659,
        //     "endTime": 127.661,
        //     "observer": "CSCE636-Spring2021-WuAiSeDUdl-1",
        //     "isHuman": true,
        //     "label": "happy",
        //     "labelConfidence": -0.99,
        //     "customInfo": {},
        // }

        // 
        // synchonous changes before bulk set
        // 
        if (withCoersion) {
            observationEntries = observationEntries.map(observationTooling.coerceObservation)
        }
        // 
        // validate
        // 
        const errorMessagesPerObservation = observationTooling.validateObservations(observationEntries)
        if (errorMessagesPerObservation.some(each=>each.length>0)) {
            throw new observationTooling.InvalidFormatError(errorMessagesPerObservation)
        }
    
        const entryIds = observationEntries.map(({observationId})=>["observations", observationId])
        
        const newLabels    = managers.labels.regenerate(    {},{addressesToIgnore: entryIds, entriesToAssume: observationEntries,},)
        const newObservers = managers.observers.regenerate( {},{addressesToIgnore: entryIds, entriesToAssume: observationEntries,},)
        // const newVideos    = managers.videos.regenerate(    {},{addressesToIgnore: entryIds, entriesToAssume: observationEntries,},)
    
        // 
        // bulk set
        // 
        return indexDb.puts([
            ...observationEntries.map(each=>[
                ["observations", each.observationId], each,
            ]),
            ...Object.entries(newLabels   ).map(([key, value])=>[   ["labels",    key],   value,   ]),
            ...Object.entries(newObservers).map(([key, value])=>[   ["observers", key],   value,   ]),
            // ...Object.entries(newVideos   ).map(([key, value])=>[   ["videos",    key],   value,   ]),
        ])
    },
    setObservation(observationEntry, {withCoersion=false}={}) {
        return frontendDb.setObservations([observationEntry],{withCoersion})
    },
    async tableNames() {
        return indexDb.getTableNames()
    },
    async getUsernames() {
        let usernames = []
        for await (const [ key, each ] of indexDb.iter.observations) {
            usernames.push(each.observer)
        }
        return [...new Set(usernames)]
    },
    async getObservations({where=[], returnObject=false}) {
        return indexDb.select({from:"observations", where, returnObject})
    },
    async deleteObservation({uuidOfSelectedSegment}) {
        return indexDb.deletes([["observations", uuidOfSelectedSegment]])
    },
    async getVideoById(videoId) {
        // TODO: clean this up after changing data structure
        return indexDb.get(["videos", videoId, ])
    },
    async updateVideos(videos) {
        let addressValuePairs = []
        for (const video of videos) {
            if (typeof video.videoId != 'string') {
                throw Error(`Tried to use frontendDb.updateVideos() but one of the videos videoId wasn't a string`)
            }
            addressValuePairs.push([
                ["videos", video.videoId],
                video,
            ])
        }
        return indexDb.puts(addressValuePairs)
    },
    async getVideos(videoIds) {
        let values = []
        for await (const [ address, value ] of indexDb.gets(videoIds.filter(each=>typeof each == "string").map(each=>["videos", each]))) {
            values.push(value)
        }
        return values
    },
    async getAllVideos() {
        const values = []
        for await (const [ key, value ] of indexDb.iter.videos) {
            values.push(value)
        }
        return values
    },
    async getVideoByPath(videoPath) {
        return indexDb.select({
            from:'videos',
            where:[
                { valueOf: ['path'], is: videoPath },
            ],
        })
    },
    async executeVideoActions(actions) {
        for (const [ action, keyList, value ] of actions) {
            if (action == "update") {
                await indexDb.puts([[
                    ["videos", ...keyList], value
                ]])
            } else if (action == "delete") {
                await indexDb.deletes([[
                    ["videos", ...keyList]
                ]])
            }
        }
    },
    async executeObservationActions(actions) {
        for (const [ action, keyList, value ] of actions) {
            if (action == "update") {
                await indexDb.puts([[
                    ["observations", ...keyList], value
                ]])
            } else if (action == "delete") {
                await indexDb.deletes([[
                    ["observations", ...keyList]
                ]])
            }
        }
    },
    summary: {
        async general(filterAndSort) {
            await indexDb.loaded
            let where = []
                    
            // 
            // build the query
            // 
            if (filterAndSort.labelName                            ) { where.push({ valueOf: ['label'                            ], is:                     filterAndSort.labelName         , }) }
            if (Number.isFinite(filterAndSort.maxlabelConfidence)  ) { where.push({ valueOf: ['labelConfidence'                  ], isLessThanOrEqualTo:    filterAndSort.maxlabelConfidence, }) }
            if (Number.isFinite(filterAndSort.minlabelConfidence)  ) { where.push({ valueOf: ['labelConfidence'                  ], isGreaterThanOrEqualTo: filterAndSort.minlabelConfidence, }) }
            if (filterAndSort.observer                             ) { where.push({ valueOf: ['observer'                         ], is:                     filterAndSort.observer          , }) }
            if (filterAndSort.kindOfObserver == "Only Humans"      ) { where.push({ valueOf: ['isHuman'                          ], is:                     true                          , }) }
            if (filterAndSort.kindOfObserver == "Only Robots"      ) { where.push({ valueOf: ['isHuman'                          ], is:                     false                         , }) }
            if (!filterAndSort.validation.includes("Confirmed")    ) { where.push({ valueOf: ['confirmedBySomeone'               ], isNot:                  true                          , }) }
            if (!filterAndSort.validation.includes("Rejected")     ) { where.push({ valueOf: ['rejectedBySomeone'                ], isNot:                  true                          , }) }

            let results = {
                finishedComputing: true,
                uncheckedObservations: [],
                rejected: [],
                labels: {},
                observers: {},
                usernames: {},
                videos: {},
                counts: {
                    total: 0,
                    fromHuman: 0,
                    rejected: 0,
                    confirmed: 0,
                    disagreement: 0,
                },
            }
            
            // 
            // this section should be rewritten to use the search^ instead of Javascript filters
            // 
            const hideUnchecked = !filterAndSort.validation.includes("Unchecked")
            const hideDisagreement = !filterAndSort.validation.includes("Disagreement")
            // this is so weird because of the dumb ways Javascript handles string->number
            // it behaves like if ($root.filterAndSort.minlabelConfidence) then min = $root.filterAndSort.minlabelConfidence
            let min = `${filterAndSort.minlabelConfidence}`; min = min.length>0 && isFinite(min-0) ? min-0 : -Infinity
            let max = `${filterAndSort.maxlabelConfidence}`; max = max.length>0 && isFinite(max-0) ? max-0 : Infinity
            const items = await indexDb.select({
                from:'observations',
                where:[
                    ...where,
                ],
            })
            for (const each of items) {
                // filters 
                if ((each.labelConfidence < min) || (each.labelConfidence > max)) { continue }
                if (hideUnchecked && (!each.confirmedBySomeone && !each.rejectedBySomeone)) { continue }
                if (hideDisagreement && (each.confirmedBySomeone && each.rejectedBySomeone)) { continue }
                
                // 
                // this section is actual logic
                // 
                
                // count observations for observers
                if (!results.observers[each.observer]) { results.observers[each.observer] = 0 }
                results.observers[each.observer] += 1
                
                // count observations for labels
                if (!results.labels[each.label]) { results.labels[each.label] = 0 }
                results.labels[each.label] += 1
                
                // count observations for videos
                if (!results.videos[each.videoId]) { results.videos[each.videoId] = 0  }
                results.videos[each.videoId] += 1
                
                results.counts.total += 1
                if (each.isHuman) {
                    results.counts.fromHuman += 1 
                } else {
                    if (each.confirmedBySomeone == true) {
                        results.counts.confirmed += 1
                    }
                    if (each.rejectedBySomeone == true) {
                        results.counts.rejected  += 1 
                        results.rejected.push(each)
                    }
                    if (each.rejectedBySomeone && each.confirmedBySomeone) {
                        results.counts.disagreement += 1
                    }
                    if (each.rejectedBySomeone !== true && each.confirmedBySomeone !== true) {
                        results.uncheckedObservations.push(each)
                    }
                }
            }
            
            return results
        },
        async labels() {
            await indexDb.loaded
            // start summarizing the data
            let results = {}
            let videosWithLabels = new Set()
            for await (const [ key, eachObservationEntry ] of indexDb.iter.observations) {
                videosWithLabels.add(eachObservationEntry.videoId)
                // init
                if (!Object.hasOwn(results, eachObservationEntry.label)) {
                    results[eachObservationEntry.label] = {}
                    results[eachObservationEntry.label].videos = {[eachObservationEntry.videoId]: 1}
                    results[eachObservationEntry.label].segmentCount = 1
                // update
                } else {
                    results[eachObservationEntry.label].videos[eachObservationEntry.videoId] += 1
                    results[eachObservationEntry.label].segmentCount += 1
                }
            }
            
            // generate videoCount
            for (const [key, value] of Object.entries(results)) {
                // record length
                value.videoCount = Object.keys(value.videos).length
                // sort by segment count (split into [keys, values], then sort by value (e.g. 1))
                value.videos = Object.fromEntries(Object.entries(value.videos).sort(dynamicSort([1], true)))
            }

            // 
            // hard coded colors (probably should remove these)
            // 
            results["uncertain"] || (results["uncertain"]={})
            results["uncertain"].color = "gray"

            // sort results by largest segmentCount
            results = Object.fromEntries(Object.entries(results).sort(dynamicSort([1, "segmentCount"], true)))
            return results
        }
    },
}
window.frontendDb = frontendDb // debugging only

window.backend = {
    async getLocalVideoPaths() {
        return JSON.parse(await (await fetch("/backend/list_videos/")).text())
    },
    async giveVideoAnId(videoPath) {
        const response = await (await fetch(`/backend/give_video_id/${videoPath}`)).text()
        try {
            return JSON.parse(response) 
        } catch (error) {
            console.debug(`response is:`,response)
            throw Error(response)
        }
    },
}
module.exports = {
    frontendDb,
}