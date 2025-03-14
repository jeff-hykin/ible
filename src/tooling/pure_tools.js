// 
// this is imported by both the backend and the browser. So it shouldn't contain (AKA DONT ADD) any browser-specific/backend-specific code
// 
import * as basics from "./basics.bundle.js"
const { get, set } = basics

export const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".avi": "video/x-msvideo",
    ".mov": "video/quicktime",
    ".wmv": "video/x-ms-wmv",
    ".flv": "video/x-flv",
    ".webm": "video/webm",
    ".ogg": "video/ogg",
    ".mkv": "video/x-matroska",
    ".3gp": "video/3gpp",
    ".3g2": "video/3gpp2",
    ".m4v": "video/x-m4v",
    ".f4v": "video/mp4", // f4v is a variant of mp4
    ".mng": "video/x-mng",
    ".ts": "video/mp2t",
    ".mpeg": "video/mpeg",
    ".mpg": "video/mpeg",
    ".mpe": "video/mpeg",
    ".mpv": "video/mpv",
    ".mxf": "application/mxf",
    ".ogv": "video/ogg",
    ".svi": "video/vnd.sealedmedia.softseal.mov",
    ".3gp2": "video/3gpp2",
    ".m2ts": "video/MP2T",
    ".mts": "video/MP2T",
    ".ttml": "application/ttml+xml",
    ".xspf": "application/xspf+xml",
    ".ass": "application/x-ass",
    ".ssa": "application/x-ssa",
    ".srt": "application/x-subrip",
}
export const videoExtensions = Object.entries(mimeTypes).filter(([key, value]) => value.startsWith("video/")).map(([ext]) => ext.slice(1))
export const videoIdLength = 11
export const createVideoId = ()=>{
    let videoId = ""
    const base = 36
    while (videoId.length < videoIdLength) {
        videoId += Math.floor(Math.random() * base).toString(base)
    }
    return videoId
}

export class EventEmitter {
    constructor() {
        this._events = {}
    }

    on(name, listener) {
        if (!this._events[name]) {
            this._events[name] = []
        }

        this._events[name].push(listener)
    }

    removeListener(name, listenerToRemove) {
        if (!this._events[name]) {
            throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`)
        }

        const filterListeners = (listener) => listener !== listenerToRemove

        this._events[name] = this._events[name].filter(filterListeners)
    }

    emit(name, data) {
        ;(this._events[name]||[]).forEach(each=>each(data))
    }
}

export const storageObject = window.storageObject = new Proxy(window.localStorage, {
    get: function(target, key) {
        try {
            return JSON.parse(target.getItem(key))
        } catch (error) {
            return undefined
        }
    },
    set: function (target, key, value) {
        target.setItem(key, JSON.stringify(value))
        return true
    },
    deleteProperty: function(target, key){
        return target.removeItem(key)
    },
    ownKeys: function (target) {
        return Object.keys(target)
    },
    has: function (target, key) {
        return key in target
    },
})

export function debounce(func, wait, immediate) {
    var timeout
    return function(...args) {
        let context = this
        let later = function() {
            timeout = null
            if (!immediate) {
                func.apply(context, args)
            }
        }
        let callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) {
            func.apply(context, args)
        }
    }
}

export function readFileAsString(files) {
    if (files.length === 0) {
        console.log('No file is selected')
        return
    }
    return (new FileReader()).readAsText(files[0])
}

export let colors = [ "#26c6da", "#e57373", "#ba68c8", "#04d895",  "#9575cd",  "#fec355", "#29b6f6", "#ff8a65", "#9ccc65", ]
colors.green  = "#04d895"
colors.blue   = "#29b6f6"
colors.purple = "#9575cd"
colors.red    = "#e57373"
colors.yellow = "#fec355"
let colorCopy = [...colors]
const wrapAroundGet = (number, list) => list[((number % list.length) + list.length) % list.length]
function simpleHash(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
export function getColor(name) {
    if (name == "comment") {
        return "gray"
    } else {
        return wrapAroundGet(simpleHash(name), colors)
    }
}

export const valueKey = Symbol("value")
export function Delayable() {
    // the infinite loop ("you're resolved after you've waited on yourself to be resolved" lol)
    this.promise = new Promise((resolve, reject)=>setTimeout(()=>this.promise.then(resolve).catch(reject), 0))
    // the "ready" switch, breaks the infinite loop
    Object.defineProperty(this, "value", {
        set(value) {
            this[valueKey] = value
            this.promise = new Promise((resolve, reject)=>resolve(value))
        },
        get() {
            return this[valueKey]
        }
    })
    this.update = (value) => {
        // only update if they're not equal according to lodash's rules (the correct)
        if (!isEqual(value, this[valueKey])) {
            this.value = value
        }
    }
    // turn the infinite waiting loop back on
    this.reset = () => {
        this.promise = new Promise((resolve, reject)=>setTimeout(()=>this.promise.then(resolve).catch(reject), 0))
    }
}

export function download(filename, textOrBlob) {
    const element = document.createElement('a')
    let url
    if (typeof textOrBlob == "string") {
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(textOrBlob))
    } else {
        url = URL.createObjectURL(textOrBlob)
        element.href = url
    }
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    url && URL.revokeObjectURL(url)
}

export function isValidName(value) {
    const namePattern = /^[a-z0-9-.]+$/
    if (typeof value == 'string') {
        return !!value.match(namePattern)
    }
    return false
}

export function humandReadableTime(milliseconds) {

    function numberEnding (number) {
        return (number > 1) ? 's' : ''
    }

    var temp = Math.floor(milliseconds / 1000)
    var years = Math.floor(temp / 31536000)
    if (years) {
        return years + ' year' + numberEnding(years)
    }
    //TODO: Months! Maybe weeks? 
    var days = Math.floor((temp %= 31536000) / 86400)
    if (days) {
        return days + ' day' + numberEnding(days)
    }
    var hours = Math.floor((temp %= 86400) / 3600)
    if (hours) {
        return hours + ' hour' + numberEnding(hours)
    }
    var minutes = Math.floor((temp %= 3600) / 60)
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes)
    }
    var seconds = temp % 60
    if (seconds) {
        return seconds + ' second' + numberEnding(seconds)
    }
    return 'less than a second' //'just now' //or other string you like;
}

export function deferredPromise() {
    let methods
    let state = "pending"
    const promise = new Promise((resolve, reject) => {
        methods = {
            resolve(value) {
                if (value?.catch instanceof Function) {
                    value.catch(reject)
                }
                if (value?.then instanceof Function) {
                    value.then(methods.resolve)
                } else {
                    state = "fulfilled"
                    resolve(value)
                }
            },
            reject(reason) {
                state = "rejected"
                reject(reason)
            },
        }
    })
    Object.defineProperty(promise, "state", { get: () => state })
    return Object.assign(promise, methods)
}

export async function asyncIteratorToList(asyncIterator) {
    const results = []
    if (asyncIterator[Symbol.asyncIterator]) {
        asyncIterator = asyncIterator[Symbol.asyncIterator]()
    }
    for await (const each of asyncIterator) {
        results.push(each)
    }
    return results
}

export const quickHash = (str)=>{
    let hash = 0, i = 0, len = str.length;
    while ( i < len ) {
        hash  = ((hash << 5) - hash + str.charCodeAt(i++)) << 0
    }
    return hash
}
export const dynamicSort        = function (property, reverse=false) {
    if (property instanceof Array) {
        if (reverse) {
            return (a,b) => {
                let aValue = get({ keyList: property, from: a, failValue: -Infinity })
                let bValue = get({ keyList: property, from: b, failValue: -Infinity })
                let type = typeof bValue
                if (type == 'number') {
                    return bValue - aValue
                } else if (type == 'string') {
                    return bValue.localeCompare(aValue)
                }
            }
        } else {
            return (b,a) => {
                let aValue = get({ keyList: property, from: a, failValue: -Infinity })
                let bValue = get({ keyList: property, from: b, failValue: -Infinity })
                let type = typeof bValue
                if (type == 'number') {
                    return bValue - aValue
                } else if (type == 'string') {
                    return bValue.localeCompare(aValue)
                }
            }
        }
    }
    if (reverse) {
        return (a,b) => {
            let type = typeof a[property]
            if (type == 'number') {
                return b[property] - a[property]
            } else if (type == 'string') {
                return b[property].localeCompare(a[property])
            }
        }
    } else {
        return (b,a) => {
            let type = typeof a[property]
            if (type == 'number') {
                return b[property] - a[property]
            } else if (type == 'string') {
                return b[property].localeCompare(a[property])
            }
        }
    }
}

export const checkIf = ({ value, is }) => {
    let typeOrClass = is 
    // 
    // Check typeOrClass
    // 
    // see if typeOrClass is actually a class 
    if (typeof typeOrClass == 'function') {
        typeOrClass = typeOrClass.name
    }
    // lowercase any string-names
    if (typeof typeOrClass == 'string') {
        typeOrClass = typeOrClass.toLowerCase()
    }

    //
    // Strict Values
    //
    // object (non-null, non-function, non-array)
    if (typeOrClass === "object") {
        if (!(value instanceof Object)) {
            return false
        } else if (value instanceof Array || value instanceof Function || value instanceof Date) {
            return false
        // check if its stringified+parsed form is also an object 
        // (this is to remove things like BigInt and BigInt64Array and other built-in pseudo-primitives)
        } else {
            let stringified = JSON.stringify(value)
            // note that this is not == '"undefined"'
            if (stringified === 'undefined') {
                return false
            } else if (JSON.parse(stringified) instanceof Object) {
                return true
            } else {
                return false
            }
        }
    }
    // undefined
    else if (typeof typeOrClass === 'undefined' || typeOrClass == 'undefined') {
        return typeof value === 'undefined'
    }
    // null
    else if (typeOrClass === null || typeOrClass == 'null') {
        return value === null
    }
    // NaN
    else if ((typeOrClass !== typeOrClass && typeof typeOrClass == 'number') || typeOrClass == 'nan') {
        return value !== value && typeof value == 'number'
    }
    // false
    else if (typeOrClass === false) {
        return value === false
    }
    // true
    else if (typeOrClass === true) {
        return value === true
    }
    // bool
    else if (typeOrClass === "bool" || typeOrClass === "boolean") {
        return value === true || value === false
    }
    // empty string
    else if (typeOrClass === "") {
        return value === ""
    }
    // empty list
    else if (typeOrClass === "[]" || Array.isArray(typeOrClass) && typeOrClass.length == 0) {
        return value instanceof Array && value.length == 0
    }
    // function
    else if (typeOrClass === "function") {
        return typeof value == "function"
    }
    // number
    else if (typeOrClass == "number" || typeOrClass == Number) {
        if (value !== value) {
            return false
        }
        else {
            return typeof value == "number" || value instanceof Number
        }
    }
    // string
    else if (typeOrClass == "string") {
        return typeof value == "string" || value instanceof String
    }
    // array
    else if (typeOrClass == "array") {
        return value instanceof Array
    }
    // symbol
    else if (typeOrClass == "symbol") {
        return typeof value == "symbol"
    }

    // 
    // Unstrict values
    // 
    // nullish (null, undefined, NaN)
    else if (typeOrClass === 'nullish') {
        return value == null || value !== value
    }
    // emptyish ({},[],"",null,undefined)
    else if (typeOrClass === 'emptyish') {
        if ((value instanceof Array && value.length == 0) || value === "" || value == null) {
            return true
        }
        else if (value instanceof Object) {
            return Object.keys(value).length == 0
        }
        else {
            return false
        }
    }
    // falsey ("0",0,false,null,undefined,NaN)
    else if (typeOrClass === 'falsey' || typeOrClass === 'falsy' || typeOrClass === 'falseish' || typeOrClass === 'falsish') {
        return value == null || value === false || value !== value || value === 0 || value === "0"
    }
    // falsey-or-empty ({},[],"","0",0,false,null,undefined,NaN)
    else if (typeOrClass === 'falsey-or-empty' || typeOrClass === 'falsy-or-empty' || typeOrClass === 'falseish-or-empty' || typeOrClass === 'falsish-or-empty') {
        // empty array
        if (value instanceof Array && value.length == 0) {
            return true
        }
        // empty object
        else if (value instanceof Object) {
            return Object.keys(value).length == 0
        }
        else {
            return (value ? true : false)
        }
    }
    // numberish 
    else if (typeOrClass == 'numberish') {
        return (value != value) || !isNaN(value - 0)
    }
    // 
    // class type
    // 
    else if (aClass) {
        // if no constructor
        if (value === null || value === undefined) {
            return false
        }
        else {
            // see if constructors match
            if (value.constructor.name === typeOrClass) {
                return true
            }
            // check instanceof 
            else {
                return value instanceof aClass
            }
        }
    }
    // 
    // failed to recognize
    // 
    else {
        throw new Error(`when you call checkIf(), I'm not recoginizing the type or class: ${typeOrClass}`)
    }
}

export function wrapIndex(val, list) {
    if (val < 0) {
        val = list.length + val
    }
    return val % list.length
}

export const isInvalidEmail = (string) => {
    if (!`${string}`.includes("@")) {
        return true
    }
    return !`${string}`.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)
}

export const escapeHtml = (string)=>{
    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }
    return string.replace(/[&<>"']/g, (m)=>{
        return htmlEscapes[m]
    })
}


const defaultOnError = (err) => {
    console.error("Error inside of DynamicInterval")
    console.error(err.stack)
    console.error(err.message)
}
/**
 * setInterval with dynamic rate
 *
 * @example
 * ```js
 *     let repeater = new DynamicInterval().setRate(200).onInterval(
 *         ()=>console.log("hello")
 *     ).onError(
 *         (err)=>console.error(err)
 *     ).start()
 * 
 *     repeater.setRate(1000)
 *     repeater.stop()
 *
 *     repeater.setAccountForDuration(false) // default is true
 *     // if true then rate is basically rate+durationOfCallback
 * ```
 */
export class DynamicInterval {
    constructor() {
        this.errorCallback = defaultOnError
        this.callback = () => {}
        this.rate = null
        this.accountForDuration = true
        this._id = null
    }
    
    // recurivelty use setTimeout, catch all errors
    async _runCallback() {
        try {
            if (this.accountForDuration) {
                await this.callback()
            } else {
                this.callback().catch(this.errorCallback)
            }
        } catch (err) {
            try {
                await this.errorCallback(err)
            } catch (error) {
                defaultOnError(error)
            }
        }
        this._id = setTimeout(()=>this._runCallback(), this.rate)
    }
    
    setRate(rate) {
        this.rate = rate
        return this
    }

    setAccountForDuration(accountForDuration) {
        this.accountForDuration = accountForDuration
        return this
    }

    onError(callback) {
        this.errorCallback = callback
        return this
    }

    onInterval(callback) {
        this.callback = callback
        return this
    }

    stop() {
        clearTimeout(this._id)
        return this
    }

    start({ delay = 0 } = {}) {
        if (!Number.isFinite(this.rate)) {
            throw Error(`DynamicInterval.start() called but no call-rate was set`)
        }
        this._id = setTimeout(()=>this._runCallback(), delay)
        return this
    }
}

const init = Symbol("init")
export class JsonValueChangeChecker {
    constructor() {
        this.value = init
    }
    
    changedSinceLastCheck(value) {
        const newValue = JSON.stringify(value||null)
        if (this.value !== newValue) {
            this.value = newValue
            return true
        }
        return false
    }
}