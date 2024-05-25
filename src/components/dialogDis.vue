<!-- 推廣人列表 -->
<template>
    <el-dialog v-model="dialogVisible" :title="Tips" width="60%">
        <el-form :model="formData" label-width="100px">
            <el-form-item label="時間選擇">
                <el-radio-group v-model="formData.type">
                    <el-radio-button label="all">全部</el-radio-button>
                    <el-radio-button label="today">今天</el-radio-button>
                    <el-radio-button label="yesterday">昨天</el-radio-button>
                    <el-radio-button label="last7days">最近7天</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="開始日期">
                <el-date-picker v-model="formData.starttime" type="date" placeholder="開始日期" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="結束日期">
                <el-date-picker v-model="formData.endtime" type="date" placeholder="結束日期" value-format="YYYY-MM-DD" />
            </el-form-item>

            <el-form-item label="用户類型">
                <el-radio-group v-model="formData.level">
                    <el-radio-button :label="0">全部</el-radio-button>
                    <el-radio-button :label="1">一級推廣</el-radio-button>
                    <el-radio-button :label="2">二級推廣</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="頭像">
                <template #default="{row}">
                    <div>
                        <el-avatar :size="50" :src="row.avatar"></el-avatar>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="用户信息" />
            <el-table-column prop="share_num" label="推廣數量" />
            <el-table-column prop="share_order_num" label="推廣訂單數量" />
            <el-table-column prop="create_time" label="創建時間" />
        </el-table>
    </el-dialog>
</template>

<script setup>
import {getDisListFn} from '@/api/distribution.js';
import {ref, reactive} from 'vue';

const page = ref(1);

const Tips = ref('');

const formData = reactive({
    type: 'all',
    starttime: '',
    endtime: '',
    level: 0
});

const userId = ref(0);

const getList = async () => {
    const res = await getDisListFn(page.value, {
        ...formData,
        user_id: userId.value
    });
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return;
    }
    tableData.value = res.data.list;
};

const tableData = ref([]);

const dialogVisible = ref(false);
const openDialog = async (id) => {
    Tips.value = '推明細列表';
    console.log(id);
    userId.value = id;
    getList();
    dialogVisible.value = true;
};

defineExpose({
    openDialog
});
</script>

<style lang="less" scoped></style>
