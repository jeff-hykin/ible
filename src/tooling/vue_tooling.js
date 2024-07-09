import Vue from "vue"

export function showLongMessage(message, actions = []) {
    Vue.toasted.show(
        `
        <div style="display: flex; flex-direction: column; padding: 1rem;"> 
            ${message.replace(/<br>/g, "<span style='display: block; height: 1rem;'></span>")}
        </div> 
    `,
        {
            keepOnHover: true,
            action: [
                ...actions,
                {
                    text: "Close",
                    onClick: (eventData, toastObject) => {
                        toastObject.goAway(1)
                    },
                },
            ],
        }
    )
}
