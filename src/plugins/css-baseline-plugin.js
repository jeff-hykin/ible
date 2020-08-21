import 'css-baseline/css/4.css'

// also add something to fix window resizing
let setViewWidth = () => {
    window.document.documentElement.style.setProperty('--vw', `${window.innerWidth}px`)
}
window.addEventListener('resize', setViewWidth)
setViewWidth()