export class Event extends Set {}
export const trigger = async (event, ...args)=>Promise.all([...event].map(each=>each(...args)))
export const everyTime = (event)=>({ then:(action)=>event.add(action) })
export const once = (event)=>{
    let selfRemovingRanFirst = false
    let output
    let resolve
    const selfRemoving = async (...args)=>{
        event.delete(selfRemoving)
        output = args
        selfRemovingRanFirst = true
        // if promise ran before it had access to output
        // (and therefore couldnt handle the return)
        // then this function needs to handle the return
        if (resolve) {
            resolve(output)
        }
    }
    event.add(selfRemoving)
    return new Promise(res=>{
        resolve = res
        // if selfRemoving finished before it had access to resolve/reject
        // then the promise needs to handle the return
        if (selfRemovingRanFirst) {
            resolve(output)
        }
    })
}

export const globalEvents = new Proxy({}, {
    // Object.keys
    ownKeys(target, ...args) { return Reflect.ownKeys(target, ...args) },
    // function call (original value needs to be a function)
    apply(original, context, ...args) { console.log(args) },
    // new operator (original value needs to be a class)
    construct(original, args, originalConstructor) {},
    get(original, key, ...args) {
        if (!Object.hasOwn(original, key)) {
            original[key] = new Event()
        } 
        return Reflect.get(original, key, ...args)
    },
    set(original, key, ...args) {
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

// TODO: I need to rethink this helper:
// export const Responder = (name, events)=>{
//     const namedTrigger = async (event, ...args)=>Promise.all([...event].map(each=>each(name, ...args)))
//     for (const [globalEventName, callback] of Object.entries(events)) {
//         everyTime(globalEvents[globalEventName]).then((who, ...args)=>{
//             console.log(`${name} saw [${globalEventName}] from ${who}`)
//             return callback(...args)
//         })
//     }
//     return { trigger }
// }