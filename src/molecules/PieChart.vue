<template>
    <VueApexCharts type="pie" :options="{...chartOptions, labels}" :series="series"></VueApexCharts>  
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
    props: [
        "series",
        "labels",
    ],
    data: ()=> ({
        chartOptions: {
            chart: {
                width: 380,
                type: "donut",
            },
            dataLabels: {
                enabled: true,
            },
            colors,
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
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