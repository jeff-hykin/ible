// api
//     root$.watch

const unwatcherSymbol = Symbol("unwatchers")
module.exports = {
    data: ()=>({
        root$: {
            watch: {}
        },
        [unwatcherSymbol]: [],
    }),
    mounted() {
        // add all the watchers
        let root$ = this.$data.root$
        for (let [eachKey, eachValue] of Object.entries(root$.watch)) {
            if (eachValue.bind instanceof Function) {
                eachValue = eachValue.bind(this)
            }
            this.$data[unwatcherSymbol].push(
                this.$root.$watch(eachKey, eachValue, {deep: true})
            )
        }
        // delete them off of data cause they're not needed there anymore
        delete root$.watch
    },
    beforeDestroy() {
        // call all of the unwatchers
        for (let each of this.$data[unwatcherSymbol]) {
            each()
        }
    }
}