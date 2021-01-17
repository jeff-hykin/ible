class EventEmitter {
    constructor() {
        this._events = {}
    }

    on(name, listener) {
        console.debug(`name, listener is:`,name, listener)
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

window.storageObject = new Proxy(window.localStorage, {
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

function debounce(func, wait, immediate) {
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

function readFileAsString(files) {
    if (files.length === 0) {
        console.log('No file is selected')
        return
    }
    return (new FileReader()).readAsText(files[0])
}

let colors = [ "#26c6da", "#e57373", "#ba68c8", "#04d895",  "#9575cd",  "#fec355", "#29b6f6", "#ff8a65", "#9ccc65", ]
colors.green  = "#04d895"
colors.blue   = "#29b6f6"
colors.purple = "#9575cd"
colors.red    = "#e57373"
colors.yellow = "#fec355"
let colorCopy = [...colors]
function getColor(name) {
    if (typeof name == "string") {
        let total = name.length
        for(let each in name) {
            total += name.charCodeAt(each) * name.length
        }
        return colors[total % colors.length]
    }
    return colorCopy.shift()||(colorCopy=[...colors],colorCopy.shift())
}

const valueKey = Symbol("value")
function Delayable() {
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

function download(filename, text) {
    let element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text))
    element.setAttribute("download", filename)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

function isValidName(value) {
    const namePattern = /^[a-zA-Z0-9_\-.]+$/
    if (typeof value == 'string') {
        return !!value.match(namePattern)
    }
    return false
}

function labelConfidenceCheck(labelConfidence) {
    if (!(labelConfidence === null || labelConfidence === undefined)) {
        if (isFinite(labelConfidence)) {
            if (labelConfidence > 1 || labelConfidence < -1) {
                return true
            }
        }
    }
    return false
}
const currentFixedSizeOfYouTubeVideoId = 11 // This is not guarenteed to stay this way forever

module.exports = {
    EventEmitter,
    storageObject,
    readFileAsString,
    colors,
    getColor,
    debounce,
    Delayable,
    download,
    isValidName,
    labelConfidenceCheck,
    currentFixedSizeOfYouTubeVideoId,
    wrapIndex(val, list) {
        if (val < 0) {
            val = list.length + val
        }
        return val % list.length
    },
}
