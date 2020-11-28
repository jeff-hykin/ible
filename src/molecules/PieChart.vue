<template>
    <VueApexCharts type="pie" :options="{...chartOptions, labels, colors}" :series="series"></VueApexCharts>  
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import Vue from 'vue'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

let { colors } = require("../utils")

export default {
    components: {
        VueApexCharts: VueApexCharts,
    },
    props: {
        series: Array,
        labels: Array,
        colors: {
            type: Array,
            default: ()=>colors,
        },
    },
    data: ()=> ({
        chartOptions: {
            chart: {
                width: "100%",
                type: "donut",
            },
            dataLabels: {
                enabled: true,
            },
            responsive: [
                {
                    options: {
                        chart: {
                        },
                        legend: {
                            show: false,
                        },
                    },
                },
            ],
            legend: {
                position: "right",
                offsetY: 0,
                height: 230,
            },
        },
    }),
}
</script>

<style>

</style>