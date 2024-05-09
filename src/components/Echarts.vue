<!-- eacharts圖表組件 -->
<template>
    <div>
        <el-card>
            <div class="e_title">
                訂單統計
                <span>
                    <el-check-tag
                        v-for="(item, i) in options"
                        :key="i"
                        :checked="currentOptions == item.value"
                        @change="selectOptions(item.value)"
                    >
                        {{ item.text }}
                    </el-check-tag>
                </span>
            </div>
            <div id="e_main"></div>
        </el-card>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {getEchartsData} from '@/api/home.js';

//echart star
let myChart;

onMounted(() => {
    const chartDom = document.getElementById('e_main');
    myChart = echarts.init(chartDom);
    getEcharsData();
});
//echart end

//頁面銷毀之前
onBeforeUnmount(() => {
    //避免白屏，頁面關閉之前，銷毀myChart實例
    if (myChart) {
        echarts.dispose(myChart);
    }
});

//設置echart數據，並進行後端數據交互
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
    //調用接口之前顯示loading動畫
    myChart.showLoading();
    //獲取真實數據
    const res = await getEchartsData(currentOptions.value);
    if (res.msg && res.msg !== 'ok') {
        return;
    }

    //製作假資料
    res.data.y.forEach((_, index) => {
        res.data.y[index] = Math.floor(Math.random() * 100);
    });
    console.log('訂單統計數據：', res.data);

    //拿到數據之後關閉loading動畫
    myChart.hideLoading();
    option.xAxis.data = res.data.x;
    option.series[0].data = res.data.y;
    myChart.setOption(option);
};

const currentOptions = ref('week');

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
];

const selectOptions = (op) => {
    console.log(op);
    currentOptions.value = op;
    getEcharsData();
};
</script>

<style lang="less" scoped>
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
