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

module.exports = {
    EventEmitter,
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
