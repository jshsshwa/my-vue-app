<!-- 用戶管理 -->
<template>
    <div>
        <el-card>
            <el-row>
                <el-col :span="9">
                    <el-input v-model="queryData.keyword" placeholder="請輸入用戶名" clearable @clear="getUserList">
                        <template #prepend>
                            <el-select v-model="queryData.user_level_id" placeholder="請選擇會員等級" clearable style="width: 145px">
                                <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id" />
                            </el-select>
                        </template>
                        <template #append>
                            <el-button :icon="Search" @click="getUserList" />
                        </template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
                <el-col :span="4">
                    <el-button type="primary" @click="openDialogCreate">新增用戶</el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData" style="width: 100%" border stripe>
                <el-table-column prop="date" label="用戶">
                    <template #default="scope">
                        <div class="avatar">
                            <el-avatar :size="50" :src="scope.row.avatar" />
                            <span>{{ scope.row.username }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="user_level.name" label="會員等級" />
                <el-table-column prop="create_time" label="註冊時間" />
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
                            <el-button type="primary" :icon="Delete" size="small" @click="delUser(scope.row.id)" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="dialogVisible" :title="Tips" width="40%" @close="colsedDialog">
            <el-form ref="formDataRef" :model="formData" :rules="formDataRules" label-width="120px">
                <el-form-item label="用戶名" prop="username">
                    <el-input v-model="formData.username" />
                </el-form-item>
                <el-form-item label="密碼" v-if="Tips == '新增'" prop="password">
                    <el-input v-model="formData.password" />
                </el-form-item>
                <el-form-item label="會員等級" prop="user_level_id">
                    <el-select v-model="formData.user_level_id" placeholder="請選擇會員等級" style="width: 100%">
                        <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="暱稱">
                    <el-input v-model="formData.nickname" />
                </el-form-item>
                <el-form-item label="電話" prop="phone">
                    <el-input v-model="formData.phone" />
                </el-form-item>
                <el-form-item label="郵箱">
                    <el-input v-model="formData.email" />
                </el-form-item>
                <el-form-item label="頭像">
                    <SelectImg v-model="formData.avatar"></SelectImg>
                </el-form-item>
                <el-form-item label="啟用狀態">
                    <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitOK"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {ElMessage, ElMessageBox} from 'element-plus';
import SelectImg from '@/components/SelectImg.vue';
import {Delete, Edit, Search} from '@element-plus/icons-vue';
import {getUserListFn, addUserFn, editUserFn, delUserFn, editUserStatus} from '@/api/user.js';
import {ref, reactive} from 'vue';

//用戶列表
const tableData = ref([]);
//會員等級分類
const levelList = ref([]);
const dialogVisible = ref(false);
const Tips = ref('');
const userId = ref(0);
//表單DOM元素
const formDataRef = ref(null);
const queryData = reactive({
    limit: 10,
    keyword: '',
    //會員等級ID
    user_level_id: null
});

const formData = reactive({
    username: '',
    password: '',
    user_level_id: null,
    nickname: '',
    phone: '',
    email: '',
    avatar: '',
    status: 1
});
//表單驗證規則
const formDataRules = reactive({
    username: [
        {required: true, message: '請輸入用戶名', trigger: 'blur'},
        {min: 4, max: 25, message: '使用者名稱長度介於 4 ~ 25', trigger: 'blur'}
    ],
    password: [
        {required: true, message: '請輸入密碼', trigger: 'blur'},
        {min: 5, max: 15, message: '長度應為5到15位之間', trigger: 'blur'}
    ],
    user_level_id: [{required: true, message: '請選擇會員等級', trigger: 'blur'}],
    phone: [{required: true, message: '電話不可空白', trigger: 'blur'}]
});

//獲取用戶列表
const getUserList = async () => {
    const page = ref(1);
    const res = await getUserListFn(page.value, queryData);
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    tableData.value = res.data.list;
    levelList.value = res.data.user_level;
};
getUserList();

//打開新增
const openDialogCreate = () => {
    Tips.value = '新增';
    formData.username = '';
    formData.user_level_id = null;
    (formData.password = ''), (formData.nickname = '');
    formData.phone = null;
    formData.email = '';
    formData.avatar = '';
    formData.status = 1;
    dialogVisible.value = true;
    colsedDialog();
};

//打開編輯
const openDialogEdit = (row) => {
    console.log(row);
    userId.value = row.id;
    Tips.value = '編輯';
    formData.username = row.username;
    formData.user_level_id = row.user_level_id;
    formData.nickname = row.nickname;
    formData.phone = row.phone;
    formData.email = row.email;
    formData.avatar = row.avatar;
    formData.status = row.status;
    dialogVisible.value = true;
};

//關閉對話框重置數據
const colsedDialog = () => {
    formDataRef.value.resetFields();
};

//確定新增
const submitOK = () => {
    formDataRef.value.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;

        if (Tips.value == '新增') {
            const res = await addUserFn(formData);
            console.log(res);
            if (res.msg && res.msg !== 'ok') {
                return ElMessage.error(res.msg);
            }
            dialogVisible.value = false;
            ElMessage({
                message: '新增成功',
                type: 'success'
            });
            getUserList();
        }
        if (Tips.value == '編輯') {
            const res = await editUserFn(userId.value, formData);
            if (res.msg && res.msg !== 'ok') {
                return ElMessage.error(res.msg);
            }
            dialogVisible.value = false;
            ElMessage({
                message: '編輯成功',
                type: 'success'
            });
            getUserList();
        }
    });
};

//刪除
const delUser = async (id) => {
    const isDel = await ElMessageBox.confirm('是否刪除?', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
    }).catch((err) => err);
    console.log(isDel);
    if (isDel !== 'confirm') return;

    const res = await delUserFn(id);
    if (res.msg && res.msg !== 'ok') ElMessage.error(res.msg);

    ElMessage({
        message: '刪除成功',
        type: 'success'
    });
    getUserList();
};

//修改狀態
const changeHandle = async (row) => {
    console.log(row);
    const res = await editUserStatus(row.id, row.status);
    if (res.msg && res.msg !== 'ok') {
        ElMessage.error(res.msg);
        if (row.status == 0) {
            row.status = 1;
        } else if (row.status == 1) {
            row.status = 0;
        }
        return;
    }
    ElMessage({
        message: '修改狀態成功',
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

    .avatar {
        display: flex;
        align-items: center;

        .el-avatar {
            margin-right: 15px;
        }
    }
}
</style>
