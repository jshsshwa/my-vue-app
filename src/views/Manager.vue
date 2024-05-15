<!-- 管理員管理 -->
<template>
    <div>
        <el-card>
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-input v-model="keyword" placeholder="請輸入管理員" clearable @clear="getDataList">
                        <template #append>
                            <el-button :icon="Search" @click="getDataList" />
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="addManagerHandle">新增管理員</el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData" style="width: 100%; margin-bottom: 20px">
                <el-table-column label="管理員">
                    <template #default="scope">
                        <div class="avatar">
                            <el-avatar :size="50" :src="scope.row.avatar" />
                            {{ scope.row.username }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="所屬管理員">
                    <template #default="scope">
                        <div>
                            <!-- {{  scope.row.role? scope.row.role.name:'-'}} -->
                            {{ scope.row.role.name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="狀態">
                    <template #default="scope">
                        <div>
                            <!-- active-value switch 打開狀態的值
                                inactive-value switch 關閉狀態的值                            
                            -->
                            <el-switch
                                v-model="scope.row.status"
                                :active-value="1"
                                :inactive-value="0"
                                @change="changeState($event, scope.row)"
                            />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <div>
                            <el-button type="primary" :icon="Edit" size="small" @click="editManagerHandle(scope.row)" />
                            <el-button type="warning" :icon="Delete" size="small" @click="delMansgerHandle(scope.row.id)" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                v-model:current-page="page"
                v-model:page-size="limit"
                :page-sizes="[5, 10, 15, 20]"
                small
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </el-card>
        <!-- 新增對話框 -->
        <el-dialog v-model="dialogVisibleAddManager" :title="dialogTitle" width="40%" @close="colseAddDialogHandle">
            <el-form ref="ruleFormRefAddManager" :model="ruleFormAddManager" :rules="rulesAddManager" label-width="105px">
                <el-form-item label="用戶名" prop="username">
                    <el-input v-model="ruleFormAddManager.username" />
                </el-form-item>
                <el-form-item label="密碼" prop="password" v-if="dialogTitle == '新增管理員'">
                    <el-input v-model="ruleFormAddManager.password" />
                </el-form-item>
                <el-form-item label="所屬角色" prop="role_id">
                    <el-select v-model="ruleFormAddManager.role_id" placeholder="請選擇角色" class="select-width" @change="selectChange">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="頭像" prop="avatar">
                    <SelectImg v-model="ruleFormAddManager.avatar"></SelectImg>
                </el-form-item>
                <el-form-item label="狀態" prop="status">
                    <el-switch
                        v-model="ruleFormAddManager.status"
                        :active-value="1"
                        :inactive-value="0"
                        @change="chageStateHandle($event)"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddManager = false">取消</el-button>
                    <el-button type="primary" @click="addManagerOkHandle"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import SelectImg from '@/components/SelectImg.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {getManagerList, editState, addManager, editManager, delManager} from '@/api/manager.js';
import {ref, reactive} from 'vue';
const Search = ref('Search');
const Edit = ref('Edit');
const Delete = ref('Delete');

//分頁頁碼
const page = ref(1);
//分頁條數
const limit = ref(5);
//搜索關鍵字
const keyword = ref('');
const tableData = ref([]);
//條數
const total = ref(0);
//角色列表
const rolesList = ref([]);

//新增管理員數參數str
const ruleFormAddManager = reactive({
    username: '',
    password: '',
    //所屬角色就是獲取管理員列表中的  roles屬性
    role_id: null,
    status: 1,
    avatar: ''
});
//驗證規則
const rulesAddManager = reactive({
    username: [{required: true, message: '請輸入用戶名', trigger: 'blur'}],
    password: [{required: true, message: '請輸入密碼', trigger: 'blur'}],
    role_id: [{required: true, message: '請選擇所屬管理員', trigger: 'blur'}]
});
//新增對話框
const dialogVisibleAddManager = ref(false);
//表單DOM元素
const ruleFormRefAddManager = ref(null);

//對話框標題
const dialogTitle = ref('');

//編輯id
const managerId = ref(null);

//end

//select
const selectChange = (val) => {
    console.log(val);
    ruleFormAddManager.role_id = val;
};

//獲取管理員數據
const getDataList = async () => {
    const res = await getManagerList(page.value, limit.value, keyword.value);
    console.log('獲取管理員數據', res);
    if (res.msg && res.msg !== 'ok') {
        return;
    }
    tableData.value = res.data.list;
    total.value = res.data.totalCount;
    rolesList.value = res.data.roles;
};
getDataList();

//修改狀態
const changeState = async (e, row) => {
    console.log('修改狀態', row);
    //調用api
    const res = await editState(row.id, e);
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        if (row.status == 0) {
            row.status = 1;
        } else if (row.status == 1) {
            row.status = 0;
        }
        ElMessage.error(res.msg);
        return;
    }
    //提示成功
    ElMessage({
        message: '狀態修改成功',
        type: 'success'
    });
};

//修改管理員狀態
const chageStateHandle = (e) => {
    console.log(e);
    ruleFormAddManager.status = e;
};

//打開新增管理員對話框
const addManagerHandle = () => {
    ruleFormAddManager.username = '';
    ruleFormAddManager.role_id = null;
    ruleFormAddManager.status = 1;
    ruleFormAddManager.avatar = '';
    dialogTitle.value = '新增管理員';
    dialogVisibleAddManager.value = true;
};
//關閉對話框重置數據
const colseAddDialogHandle = () => {
    ruleFormRefAddManager.value.resetFields();
};
//確定新增管理員
const addManagerOkHandle = () => {
    //校驗表單數據
    ruleFormRefAddManager.value.validate(async (isValid) => {
        if (!isValid) {
            return;
        }
        if (dialogTitle.value == '新增管理員') {
            //校驗通過調用api接口
            const res = await addManager(ruleFormAddManager);
            console.log(res);
            if (res.msg && res.msg !== 'ok') {
                return ElMessage.error(res.msg);
            }
            //關閉對話框
            dialogVisibleAddManager.value = false;
            //刷新數據
            getDataList();
        } else if (dialogTitle.value == '編輯管理員') {
            //console.log('編輯管理員')
            const res = await editManager(managerId.value, ruleFormAddManager);
            console.log(res);
            if (res.msg && res.msg !== 'ok') {
                return ElMessage.error(res.msg);
            }
            //關閉對話框
            dialogVisibleAddManager.value = false;
            //刷新數據
            getDataList();
        }
    });
};

//刪除管理員
const delMansgerHandle = async (i) => {
    //是否刪除？
    const isdel = await ElMessageBox.confirm('是否刪除？', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
    }).catch((err) => err);
    if (isdel !== 'confirm') {
        return;
    }
    //調用api接口
    const res = await delManager(i);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    //獲取最新數據
    getDataList();
};

//編輯
const editManagerHandle = (row) => {
    console.log(row);
    dialogTitle.value = '編輯管理員';
    managerId.value = row.id;
    //初始化數據
    ruleFormAddManager.username = row.username;
    ruleFormAddManager.role_id = row.role_id;
    ruleFormAddManager.status = row.status;
    ruleFormAddManager.avatar = row.avatar;

    //打開對話框
    dialogVisibleAddManager.value = true;
};

//分頁
const handleSizeChange = (val) => {
    limit.value = val;
    getDataList();
};
const handleCurrentChange = (val) => {
    page.value = val;
    getDataList();
};
</script>

<style lang="less" scoped>
.el-card {
    margin-top: 20px;
}

.el-table {
    margin-top: 20px;
}

.avatar {
    display: flex;
    align-items: center;

    .el-avatar {
        margin-right: 15px;
    }
}

.select-width {
    width: 100%;
}
</style>
