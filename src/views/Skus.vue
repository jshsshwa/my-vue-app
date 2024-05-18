<!--  -->
<template>
    <div>
        <el-card>
            <el-button type="primary" size="small" @click="oppenDialog">新增</el-button>
            <el-button type="danger" size="small" @click="delSkuMulti">批量刪除</el-button>
            <!-- 表格 -->
            <el-table :data="skusList" style="width: 100%" stripe border @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="規格名稱" />
                <el-table-column prop="default" label="規格數據" />
                <el-table-column prop="order" label="排序" />
                <el-table-column label="狀態">
                    <template #default="scope">
                        <div>
                            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="editStatus1(scope.row)" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="desc" label="操作">
                    <template #default="scope">
                        <div>
                            <el-button type="primary" :icon="Edit" size="small" @click="editSku(scope.row)" />
                            <el-button type="danger" :icon="Delete" size="small" @click="delSku(scope.row.id)" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog v-model="dialogVisibleAddSku" :title="TipsTitle" width="40%" destroy-on-close @close="colseDialog">
            <el-form ref="ruleFormRefAddSku" :model="ruleFormAddSku" :rules="rulesAddSku" label-width="120px">
                <el-form-item label="規格名稱" prop="name">
                    <el-input v-model="ruleFormAddSku.name" />
                </el-form-item>

                <el-form-item label="規格數據" prop="default">
                    <tagInput v-model="ruleFormAddSku.default"></tagInput>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="ruleFormAddSku.order" :min="1" :max="1000" />
                </el-form-item>
                <el-form-item label="狀態">
                    <el-switch v-model="ruleFormAddSku.status" :active-value="1" :inactive-value="0" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddSku = false">取消</el-button>
                    <el-button type="primary" @click="addSkuOk"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import tagInput from '@/components/TagInput.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {ref, reactive} from 'vue';
import {getSkusFn, addSkusFn, editStatus, editSkuFn, delSkuFn} from '@/api/skus.js';
import {Delete, Edit} from '@element-plus/icons-vue';
//定義參數
//sku列表
const skusList = ref([]);
//對話框標題
const TipsTitle = ref('');
//規格id
const skuId = ref(0);
//批量刪除規格id
const skuIds = ref([]);
//新增/編輯 對話框
const dialogVisibleAddSku = ref(false);
//from表單DOM元素
const ruleFormRefAddSku = ref(null);
//表單數據源
const ruleFormAddSku = reactive({
    name: '',
    default: '',
    order: 0,
    status: 1
});
//表單驗證規則
const rulesAddSku = reactive({
    name: [{required: true, message: '請輸入規格名稱', trigger: 'blur'}],
    default: [{required: true, message: '請輸入規格數據', trigger: 'blur'}]
});

//查詢
const getSkusList = async () => {
    const res = await getSkusFn(1);
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return;
    }
    skusList.value = res.data.list;
};
getSkusList();

// //排序
// const handleChangeOrder = (e) => {
//     ruleFormAddSku.order = e;
// };

// //修改狀態
// const isStatus = (e) => {
//     console.log('修改狀態', e);
//     console.log(ruleFormAddSku.status);
//     ruleFormAddSku.status = e;
// };

//打開新增
const oppenDialog = () => {
    TipsTitle.value = '新增';
    ruleFormAddSku.name = '';
    ruleFormAddSku.default = '';
    ruleFormAddSku.order = 1;
    ruleFormAddSku.status = 1;
    dialogVisibleAddSku.value = true;
};

//確定新增/編輯
const addSkuOk = async () => {
    if (TipsTitle.value == '新增') {
        const res = await addSkusFn(ruleFormAddSku);
        console.log(res);
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg);
        }
        dialogVisibleAddSku.value = false;
        getSkusList();
    } else if (TipsTitle.value == '編輯') {
        const res = await editSkuFn(skuId.value, ruleFormAddSku);
        console.log(res);
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg);
        }
        dialogVisibleAddSku.value = false;
        getSkusList();
    }
};

//修改狀態
const editStatus1 = async (row) => {
    const res = await editStatus(row.id, row.status);
    if (res.msg && res.msg !== 'ok') {
        if (row.status == 1) {
            row.status = 0;
        }
        if (row.status == 0) {
            row.status = 1;
        }
        return;
    }
    ElMessage({
        message: '狀態修改成功',
        type: 'success'
    });
};

//打開編輯對話框，並初始化數據
const editSku = (row) => {
    TipsTitle.value = '編輯';
    skuId.value = row.id;

    ruleFormAddSku.name = row.name;
    ruleFormAddSku.default = row.default;
    ruleFormAddSku.order = row.order;
    ruleFormAddSku.status = row.status;

    dialogVisibleAddSku.value = true;
};

//刪除
const delSku = async (id) => {
    const isdel = await ElMessageBox.confirm('是否刪除?', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
    }).catch((err) => err);
    console.log(isdel);
    if (isdel !== 'confirm') {
        return;
    }
    const res = await delSkuFn([id]);
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return;
    }
    ElMessage({
        message: '刪除成功',
        type: 'success'
    });
    getSkusList();
};

//關閉對話框事件
const colseDialog = () => ruleFormRefAddSku.value.resetFields();

//監聽批量選中數據
const handleSelectionChange = (val) => {
    //console.log('val',val);
    skuIds.value = val.map((item) => item.id);
    console.log('批量選中數據', skuIds.value);
};

//批量刪除
const delSkuMulti = async () => {
    const isdel = await ElMessageBox.confirm('是否刪除選中項?', '批量刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
    }).catch((err) => err);
    console.log(isdel);
    if (isdel !== 'confirm') {
        return;
    }
    //執行批量刪除
    const res = await delSkuFn(skuIds.value);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    getSkusList();
    ElMessage({
        message: '批量刪除成功',
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
