<template lang="pug">
    div(asdfasdj0839i5t ref="pieWrapper" :style="`min-height: ${heightOfWrapper}px`")
        .pie-middle(ref="pieMiddleWrapper" :style="calculateScaling()")
                VueApexCharts(asdfasdj0839i5t type="donut" :options="{...chartOptions, labels, colors}" :series="series")
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import Vue from 'vue'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

let { colors } = require("../utils")
let fontSize = 1
export default {
    components: {
        VueApexCharts: VueApexCharts,
    },
    props: {
        scaler: {
            type: Number,
            default: ()=>1,
        },
        series: Array,
        labels: Array,
        colors: {
            type: Array,
            default: ()=>colors,
        },
    },
    windowListeners: {
        resize() {
            // wait for dom to render the change
            this.$nextTick(() => {
                this.heightOfWrapper = this.heightOfWrapper + 0.0
                // force a change because Vue doesn't relize its changed
                this.calculateScaling()
            })
        }
    },
    data: ()=> ({
        heightOfWrapper: 100,
        chartOptions: {
            stroke: {
                show: false,
                curve: 'smooth',
                lineCap: 'butt',
                colors: undefined,
                width: 2,
                dashArray: 0,      
            },
            expandOnClick: true,
            customScale: 1,
            chart: {
                width: "100%",
                type: "donut",
            },
            dataLabels: {
                enabled: true,
                offset: 0,
                minAngleToShowLabel: 4,
                floating: false,
                style: {
                    floating: false,
                    filter: null,
                    fontSize: `${fontSize*1.05}rem`,
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    colors: ['rgba(0, 0, 0, 0.45)'],
                },
            },
            title: {
            },
            plotOptions: {
                pie: {
                    startAngle: 0,
                    expandOnClick: false,
                    offsetX: 0,
                    offsetY: 0,
                    customScale: 1,
                    dataLabels: {
                        offset: 0,
                        minAngleToShowLabel: 10,
                    }, 
                    donut: {
                        size: '60%',
                        background: 'transparent',
                            labels: {
                                show: true,
                                name: {
                                    show: true,
                                    fontSize: `${fontSize*22}px`,
                                    fontFamily: 'Helvetica, Arial, sans-serif',
                                    fontWeight: 600,
                                    color: undefined,
                                    offsetY: -11,
                                    formatter: function (val) {
                                        return val
                                    }
                                },
                                value: {
                                    show: true,
                                    fontSize: `${fontSize*36}px`,
                                    fontFamily: 'Helvetica, Arial, sans-serif',
                                    fontWeight: 400,
                                    color: undefined,
                                    offsetY: 12,
                                    formatter: function (val) {
                                        return val
                                    }
                                },
                                total: {
                                    show: true,
                                    showAlways: true,
                                    label: 'Total',
                                    fontSize: `${fontSize*25}px`,
                                    fontFamily: 'Helvetica, Arial, sans-serif',
                                    fontWeight: 600,
                                    color: '#373d3f',
                                    // formatter: function (w) {
                                    //     return w.globals.seriesTotals.reduce((a, b) => {
                                    //         return a + b
                                    //     }, 0)
                                    // }
                                }
                            }
                    },      
                }
            },
            responsive: [
                {
                    options: {
                        chart: {
                        },
                        legend: {
                            show: true,
                        },
                    },
                },
            ],
            legend: {
                position: "right",
                offsetY: 0,
                height: 230,
                fontSize: '17rem',
            },
        },
    }),
    methods: {
        // a hack to fix the terrible scaling Apex Charts has
        calculateScaling(){
            let outerWidth = this.$refs.pieWrapper && this.$refs.pieWrapper.clientWidth
            let innerWidth = this.$refs.pieMiddleWrapper && this.$refs.pieMiddleWrapper.clientWidth
            let scaleNeeded = outerWidth/innerWidth
            this.heightOfWrapper = this.$refs.pieMiddleWrapper && (this.$refs.pieMiddleWrapper.clientHeight * scaleNeeded)
            return `
                --scaler: ${scaleNeeded};
            `
        },
    },
}
</script>

<style>
.apexcharts-text.apexcharts-datalabel-label {
    font-size: 15pt;
}
[asdfasdj0839i5t] .apexcharts-text.apexcharts-pie-label {
    font: 15pt;
    filter: none;
}
[asdfasdj0839i5t] {
    width: 100%;
    overflow: hidden;
}
.pie-middle {
    --standard-size: 512px;
    min-width: var(--standard-size);
    max-width: var(--standard-size);
    transform: translate(var(--percent), var(--percent)) scale(var(--scaler));
    --percent: calc(calc(calc(1 - var(--scaler)) * 50%) * -1);
}
</style>