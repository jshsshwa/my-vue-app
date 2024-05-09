<!--  -->
<template>
    <div class="content">
        <el-row :gutter="20">
            <!-- 骨架屏 -->
            <template v-if="panelsData.length == 0">
                <el-col :span="6" v-for="i in 4" :key="i">
                    <el-skeleton style="width: 100%" animated loading>
                        <template #template>
                            <el-card shadow="hover">
                                <div class="t_title">
                                    <el-skeleton-item variant="text" style="width: 40%" />
                                    <el-skeleton-item variant="text" style="width: 10%; margin-left: auto" />
                                </div>
                                <div class="t_main">
                                    <el-skeleton-item variant="h3" style="width: 80%" />
                                </div>
                                <div class="t_footer">
                                    <el-skeleton-item variant="text" style="width: 40%" />
                                    <el-skeleton-item variant="text" style="width: 10%; margin-left: auto" />
                                </div>
                            </el-card>
                        </template>
                    </el-skeleton>
                </el-col>
            </template>

            <el-col :span="6" v-for="(item, i) in panelsData" :key="i">
                <el-card shadow="hover">
                    <div class="t_title">
                        <span>{{ item.title }}</span>
                        <el-tag :type="item.unitColor">{{ item.unit }}</el-tag>
                    </div>
                    <div class="t_main">
                        <!-- {{ item.value }} -->
                        <Gsap :value="item.value"></Gsap>
                    </div>
                    <div class="t_footer">
                        <span>{{ item.subTitle }}</span>
                        <span>
                            <el-tag :type="item.unitColor">{{ item.subValue }}</el-tag>
                        </span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!-- 分類組件 -->
        <NavCateList></NavCateList>
        <el-row :gutter="20">
            <el-col :span="12">
                <Echarts></Echarts>
            </el-col>
            <el-col :span="12">
                <GoodsState title="店鋪提示" desc="店鋪提示" :gData="goodsData"></GoodsState>
                <GoodsState title="商品提示" desc="商品提示" :gData="orderData" style="margin-top: 17px"></GoodsState>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import Echarts from '@/components/Echarts.vue';
import NavCateList from '@/components/NavCateList.vue';
import GoodsState from '@/components/GoodsState.vue';
import Gsap from '@/components/Gsap.vue';
import {ref} from 'vue';
import {getAdminInfo, getGoodsState} from '@/api/home.js';

//定義數據源
const panelsData = ref([]);
const goodsData = ref([]);
const orderData = ref([]);

getAdminInfo().then((res) => {
    if (res.msg && res.msg == 'ok') {
        console.log('統計面板資料：', res.data.panels);

        //修正小錯誤，可忽略。
        //如果el-tag 的type屬性==''會錯誤，所以如果是‘’就先換掉
        res.data.panels = res.data.panels.map((item) => {
            if (item.unitColor === '') {
                item.unitColor = 'primary';
            }
            return item;
        });

        //亂數產生測試用數據
        res.data.panels.forEach((item) => {
            item.value = Math.floor(Math.random() * 400);
        });

        panelsData.value = res.data.panels;
    }
});

//商鋪提示
getGoodsState().then((res) => {
    if (res && res.msg !== 'ok') {
        return;
    }
    console.log('店鋪提示&商品提示 數據：',res.data);
    goodsData.value = res.data.goods;
    orderData.value = res.data.order;
});
</script>

<style lang="less" scoped>
.content > .el-row {
    margin-top: 20px;
}

.t_title {
    display: flex;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 5px;

    .el-tag {
        margin-left: auto;
    }
}

.t_main {
    font-size: 28px;
    line-height: 100px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #dbdbdb;
}

.t_footer {
    height: 30px;
    font-size: 14px;
    padding-top: 15px;
    display: flex;
    align-items: center;

    span:nth-child(2) {
        padding-left: 15px;
    }
}
</style>
