<!--  -->
<template>
    <div>
        <el-card>
            <div><el-button type="primary" @click="openDialog">新增</el-button></div>
            <el-table :data="tableData" style="width: 100%" border stripe>
                <el-table-column prop="name" label="會員等級" />
                <el-table-column prop="discount" label="折扣比例（%）" />
                <el-table-column prop="level" label="等級權重" />
                <el-table-column prop="date" label="狀態">
                    <template #default="scope">
                        <div>
                            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeHandle(scope.row)" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="操作">
                    <template #default="scope">
                        <div>
                            <el-button type="primary" :icon="Edit" size="small" @click="openDialogEdit(scope.row)" />
                            <el-button type="danger" :icon="Delete" size="small" @click="delLevel(scope.row.id)" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog v-model="dialogVisible" :title="Tips" width="30%" @close="closeDialog">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px">
                <el-form-item label="等級名稱" prop="name">
                    <el-input v-model="ruleForm.name" />
                </el-form-item>
                <el-form-item label="等級權重" prop="level">
                    <el-input v-model="ruleForm.level" />
                </el-form-item>
                <el-form-item label="折扣比例" prop="discount">
                    <el-input v-model="ruleForm.discount">
                        <template #append>%</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="累計消費金額" prop="max_price">
                    <el-input v-model="ruleForm.max_price">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="累計消費次數" prop="max_times">
                    <el-input v-model="ruleForm.max_times">
                        <template #append>次</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="是否啟用">
                    <el-switch v-model="ruleForm.status" :active-value="1" :inactive-value="0" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitOk"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {ElMessage} from 'element-plus';
import {Delete, Edit} from '@element-plus/icons-vue';

import {getLevelListFn, addLevelFn, editLevelFn, delLevelFn, editLevelStatus} from '@/api/level.js';
import {ref, reactive} from 'vue';

const tableData = ref([]);
const page = ref(1);

//獲取會員等級列表
const getLevelList = async () => {
    const res = await getLevelListFn(page.value);
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    tableData.value = res.data.list;
};
getLevelList();

const dialogVisible = ref(false);
const Tips = ref();
const levelId = ref(0);
const ruleFormRef = ref(null);
const ruleForm = reactive({
    name: '',
    level: null,
    discount: null,
    max_price: null,
    max_times: null,
    status: 1
});
const rules = reactive({
    name: [{required: true, message: '請輸入等級名稱', trigger: 'blur'}],
    level: [{required: true, message: '請輸入等級權重', trigger: 'blur'}],
    discount: [{required: true, message: '請輸入折扣比例', trigger: 'blur'}],
    max_price: [{required: true, message: '請輸入累計消費金額', trigger: 'blur'}],
    max_times: [{required: true, message: '累計消費次數', trigger: 'blur'}]
});

//打開新增
const openDialog = () => {
    Tips.value = '新增';
    ruleForm.name = '';
    ruleForm.level = null;
    ruleForm.discount = null;
    ruleForm.max_price = null;
    ruleForm.max_times = null;
    ruleForm.status = 1;
    dialogVisible.value = true;
};

//關閉對話框
const closeDialog = () => {
    ruleFormRef.value.resetFields();
};

//submit
const submitOk = async () => {
    if (Tips.value == '新增') {
        const res = await addLevelFn(ruleForm);
        console.log(res);
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg);
        }
        dialogVisible.value = false;
        ElMessage({
            message: '新增成功',
            type: 'success'
        });
        getLevelList();
    }
    if (Tips.value == '編輯') {
        const res = await editLevelFn(levelId.value, ruleForm);
        console.log(res);
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg);
        }
        dialogVisible.value = false;
        ElMessage({
            message: '編輯成功',
            type: 'success'
        });
        getLevelList();
    }
};

//編輯
const openDialogEdit = (row) => {
    console.log(row);
    levelId.value = row.id;
    Tips.value = '編輯';
    ruleForm.name = row.name;
    ruleForm.level = row.level;
    ruleForm.discount = row.discount;
    ruleForm.max_price = row.max_price;
    ruleForm.max_times = row.max_times;
    ruleForm.status = row.status;
    dialogVisible.value = true;
};

//刪除
const delLevel = async (id) => {
    const res = await delLevelFn(id);
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    ElMessage({
        message: '刪除成功',
        type: 'success'
    });
    getLevelList();
};

const changeHandle = async (row) => {
    const res = await editLevelStatus(row.id, row.status);
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        if (row.status == 1) {
            row.status = 0;
        }
        if (row.status == 0) {
            row.status = 1;
        }
        ElMessage.error(res.msg);
        return;
    }
    ElMessage({
        message: '狀態修改成功',
        type: 'success'
    });
};
</script>

<style lang="less" scoped>
.el-card {
    margin-top: 20px;

    .el-table {
        margin-top: 20px;
    }
}
</style>
