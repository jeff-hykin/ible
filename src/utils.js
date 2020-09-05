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

module.exports = {
    EventEmitter,
    storageObject,
    wrapIndex(val, list) {
        if (val >= list.length) {
            return 0
        } else if (val < 0) {
            return list.length - 1
        } else {
            return val
        }
    },
}
