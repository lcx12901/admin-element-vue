<template>
    <div class="reports">
        <div id="main"></div>
    </div>
</template>

<script>
import {reqReport} from 'network/api.js'
import * as echarts from 'echarts';
export default {
    name: 'reports',
    data () {
        return {

        }
    },
    mounted() {
        this.getReport()
    },
    methods: {
        async getReport () {
            const {data, meta} = await reqReport()
            data.series.map( item => {
                item.emphasis = {
                    focus: 'series'
                }
                console.log(item)
            })
            var chartDom = document.getElementById('main')
            
            var myChart = echarts.init(chartDom)
            var option
            if (meta.status != 200) return
            option = {
                title: {
                    text: '堆叠区域图'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                ...data
            }
            option && myChart.setOption(option);
        }
    }
}
</script>

<style lang="less">
    .reports {
        #main {
            margin: 40px auto 0;
            width: 80vw;
            height: 90vh;
        }
    }
</style>