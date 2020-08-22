// api
//     loadedAll$
//     needToLoad$

// side effects
//     if value is in $data with the same name, it will be replaced with the awaited value ASAP

module.exports = {
    data: ()=>({
        loadedAll$: false,
        needToLoad$: {},
    }),
    created() {
        setTimeout(async () => {
            // resolve each individually
            Object.keys(this.needToLoad$).forEach(async eachName=>{
                let awaitedValue = await this.needToLoad$[eachName]
                // if its saved on data, then go ahead and replace it
                if (this.$data[eachName] == this.needToLoad$[eachName]) {
                    this.$data[eachName] = awaitedValue
                }
            })
            // check all of them
            for (let each in this.$data.needToLoad$) {
                await this.$data.needToLoad$[each]
            }
            this.$emit("loadedAll$", this.needToLoad$)
            this.loadedAll$ = true
        }, 0)
    }
}