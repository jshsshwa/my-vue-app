<!-- eacharts图表组件 -->
<template>
    <div>
        <el-card>
            <div class="e_title">
                订单统计
                <span>
                    <el-check-tag v-for="(item, i) in options" :key="i" :checked="currentOptions == item.value"
                        @change="selectOptions(item.value)">{{ item.text }}</el-check-tag>
                </span>
            </div>
            <div id="e_main">

            </div>
        </el-card>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted,onBeforeUnmount } from 'vue'
import { getEchartsData } from '@/api/home.js'

//echart star
var myChart
onMounted(() => {
    var chartDom = document.getElementById('e_main');
    myChart = echarts.init(chartDom);
    getEcharsData()
})
//echart end

//页面销毁之前
onBeforeUnmount(()=>{
    //避免白屏，页面关闭之前，销毁myChart实例
    if(myChart){
        echarts.dispose(myChart)
    }
})

//设置echart数据，并进行后端数据交互
const getEcharsData = async () => {
    var option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };
    //调用接口之前显示loading动画
    myChart.showLoading()
    //获取真实数据
    const res = await getEchartsData(currentOptions.value)    
    if (res.msg && res.msg !== 'ok') {
        return
    }
    //拿到数据之后关闭loading动画
    myChart.hideLoading()
    option.xAxis.data = res.data.x
    option.series[0].data = res.data.y    
    myChart.setOption(option);
}

const currentOptions = ref('week')

const options = [
    {
        text: '月',
        value: 'month'
    },
    {
        text: '周',
        value: 'week'
    },
    {
        text: '天',
        value: 'hour'
    }
]

const selectOptions = (op) => {
    console.log(op)
    currentOptions.value = op
    getEcharsData()
}
</script>

<style lang='less' scoped>
.e_title {
    display: flex;
    border-bottom: 1px solid #dbdbdb;  
    padding-bottom: 15px;
    line-height: 30px;

    span {
        margin-left: auto;

        .el-check-tag {
            margin-left: 10px;
        }
    }
}

#e_main {
    width: 100%;
    height: 330px;
}
</style>