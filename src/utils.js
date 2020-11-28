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
        let item = target.getItem(key)
        if (!item) {
            return undefined
        // if it exists, parse it first
        } else {
            return JSON.parse(target.getItem(key))
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

module.exports = {
    EventEmitter,
    storageObject,
    readFileAsString,
    colors,
    getColor,
    wrapIndex(val, list) {
        if (val < 0) {
            val = list.length + val
        }
        return val % list.length
    },
}
