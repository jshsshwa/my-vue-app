<!-- 分销模块 -->
<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6" v-for="(item, i) in disData" :key="i">
                <el-card>
                    <span>{{ item.value }}</span>
                    {{ item.label }}
                </el-card>
            </el-col>
        </el-row>
        <el-card>
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-input placeholder="请输入搜索信息" clearable v-model="queryData.keyword" @clear="getDisList">
                        <template #append>
                            <el-button :icon="Search" @click="getDisList" />
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="6" :offset="12">
                    <el-radio-group v-model="queryData.type" @change="radioChange">
                        <el-radio-button value="all">全部</el-radio-button>
                        <el-radio-button value="today">今天</el-radio-button>
                        <el-radio-button value="yesterday">昨天</el-radio-button>
                        <el-radio-button value="last7days">最近7天</el-radio-button>
                    </el-radio-group>
                </el-col>
            </el-row>

            <el-table :data="disListValue" style="width: 100%" border stripe>
                <!-- <el-table-column prop="date" label="Date" width="180" /> -->
                <el-table-column label="头像">
                    <template #default="{row}">
                        <div>
                            <el-avatar :size="50" :src="row.avatar"> </el-avatar>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="用户信息" width="200">
                    <template #default="{row}">
                        <div>
                            <p>用户：{{ row.username }}</p>
                            <p>电话：{{ row.phone }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="share_num" label="推广数量" />
                <el-table-column prop="share_order_num" label="订单数量" />
                <el-table-column prop="order_price" label="订单金额" />
                <el-table-column prop="commission" label="账户佣金" />
                <el-table-column prop="cash_out_price" label="已提现佣金" />
                <el-table-column prop="no_cash_out_price" label="未提现佣金" />

                <el-table-column label="操作">
                    <template #default="{row}">
                        <el-button type="primary" size="small" text @click="openDisList(row.id)">推广明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <dialogDis ref="disDom"></dialogDis>
    </div>
</template>

<script setup>
import dialogDis from '@/components/dialogDis.vue';
import {getDisDataFn, getDisListFn} from '@/api/distribution.js';
import {ref, reactive} from 'vue';
import {Search} from '@element-plus/icons-vue';
const disData = ref([]);

//定义查询参数
const queryData = reactive({
    keyword: '',
    type: 'all'
});

//获取分销数据统计
const getDisData = async () => {
    const res = await getDisDataFn();
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return;
    }
    disData.value = res.data.panels;
};
getDisData();
const page = ref(1);
const disListValue = ref([]);
//获取分销推广员列表
const getDisList = async () => {
    const res = await getDisListFn(page.value, queryData);
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return;
    }
    disListValue.value = res.data.list;
};
getDisList();

//radio
const radioChange = (val) => {
    console.log(val);
    queryData.type = val;
    getDisList();
};

const disDom = ref(null);
const openDisList = (id) => {
    disDom.value.openDialog(id);
};
</script>

<style lang="less" scoped>
.el-row .el-card {
    margin-top: 20px;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;

    span {
        display: block;
        font-size: 23px;
        font-weight: bold;
        padding-bottom: 10px;
    }
}

.el-card {
    margin-top: 20px;

    .el-table {
        margin-top: 20px;
    }
}
</style>
