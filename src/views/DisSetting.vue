<!-- 分銷設置 -->
<template>
    <div>
        <el-card>
            <el-form :model="formData" label-width="120px">
                <p>基礎設置</p>
                <el-form-item label="分銷啓用">
                    <el-radio-group v-model="formData.distribution_open">
                        <el-radio :label="1" border>是</el-radio>
                        <el-radio :label="0" border>否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="分銷海報">
                    <selectImg v-model="formData.spread_banners" :num="2"></selectImg>
                </el-form-item>
                <p>佣金設置</p>
                <el-form-item label="一級返傭比例">
                    <el-input v-model="formData.store_first_rebate">
                        <template #append>%</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="二級返傭比例">
                    <el-input v-model="formData.store_second_rebate">
                        <template #append>%</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="自購返傭">
                    <el-radio-group v-model="formData.is_self_brokerage">
                        <el-radio :label="1" border>是</el-radio>
                        <el-radio :label="0" border>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <p>結算設置</p>
                <el-form-item label="結算時間">
                    <el-input v-model="formData.settlement_days">
                        <template #append>天</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="結算方式">
                    <el-radio-group v-model="formData.brokerage_method">
                        <el-radio label="hand" border>手動結算</el-radio>
                        <el-radio label="wx" border>自動結算到微信</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="">
                    <el-button type="primary" @click="editOk">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import {ElMessage} from 'element-plus';
import selectImg from '@/components/SelectImg.vue';
import {reactive} from 'vue';
import {getDisSettingFn, editDisSettingFn} from '@/api/distribution.js';

const formData = reactive({
    distribution_open: 0, //分銷啓用:0禁用1啓用
    spread_banners: [], //分銷海報圖
    store_first_rebate: 20, //一級返傭比例：0~100
    store_second_rebate: 30, //二級返傭比例：0~100
    is_self_brokerage: 1, //自購返傭:0否1是
    settlement_days: 6, //結算時間（單位：天）
    brokerage_method: 'hand' //佣金到賬方式:hand手動,wx微信
});

//獲取

const getSetting = async () => {
    const res = await getDisSettingFn();
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return;
    }
    //線上替換本地
    for (const key in formData) {
        formData[key] = res.data[key];
    }
};
getSetting();

//修改

const editOk = async () => {
    const res = await editDisSettingFn();
    console.log(res);
    if (res.msg && res.msg != 'ok') {
        return ElMessage.error(res.msg);
    }
    ElMessage({
        message: '設置成功',
        type: 'success'
    });
};
</script>

<style lang="less" scoped>
.el-card {
    margin-top: 20px;
    .el-form {
        width: 500px;
    }
}
</style>
