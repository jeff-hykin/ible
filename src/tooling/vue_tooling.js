import Vue from "vue"


export function showLongMessage(message, actions=[]) {
    Vue.toasted.show(`
        <div style="display: flex; flex-direction: column; with: 10rem;"> 
            ${message}
        </div> 
    `, {
        keepOnHover:true,
        action: actions,
    })
}