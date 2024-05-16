<!-- 角色管理 -->
<template>
    <div>
        <el-card>
            <el-button type="primary" size="small" @click="oppenDialog">新增</el-button>
            <!-- 表格 -->
            <el-table :data="tableData" style="width: 100%" stripe border>
                <el-table-column prop="name" label="角色名稱" />
                <el-table-column prop="desc" label="角色描述" />
                <el-table-column label="狀態">
                    <template #default="scope">
                        <div>
                            <el-switch
                                :active-value="1"
                                :inactive-value="0"
                                v-model="scope.row.status"
                                @change="editStatus($event, scope.row)"
                            />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <div>
                            <el-tooltip effect="dark" content="分配權限" placement="top" :enterable="false">
                                <el-button type="primary" icon="Share" size="small" @click="oppenSetRoleDialog(scope.row)" />
                            </el-tooltip>
                            <el-button type="warning" icon="Edit" size="small" @click="editRoles(scope.row)" />
                            <el-button type="danger" icon="Delete" size="small" @click="delRolusById(scope.row.id)" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 編輯角色 -->
        <el-dialog v-model="dialogVisibleAddRole" :title="titleName" width="40%" @close="colseDialog">
            <el-form ref="ruleFormRefRoles" :model="ruleFormRoles" :rules="rulesRoles" label-width="80px" status-icon>
                <el-form-item label="角色名稱" prop="name">
                    <el-input v-model="ruleFormRoles.name" />
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="ruleFormRoles.desc" :rows="2" type="textarea" />
                </el-form-item>
                <el-form-item label="狀態">
                    <el-switch v-model="ruleFormRoles.status" :active-value="1" :inactive-value="0" @change="chahgeStatus" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddRole = false">取消</el-button>
                    <el-button type="primary" @click="addRoleOk"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 分配權限對話框 -->
        <el-dialog v-model="dialogVisibleSetRole" title="分配權限" width="30%">
            <el-tree-v2
                ref="treeRef"
                node-key="id"
                :default-expanded-keys="defaultRoles"
                show-checkbox
                :height="360"
                :props="propsSetRole"
                :data="rolesDtaList"
                @check="treeCheck"
                :check-strictly="checkStrictly"
            >
                <template #default="{node, data}">
                    <span>
                        <el-tag v-if="data.menu == 1">菜單</el-tag><el-tag type="success" v-if="data.menu == 0">權限</el-tag
                        >{{ data.name }}</span
                    >
                </template>
            </el-tree-v2>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleSetRole = false">取消</el-button>
                    <el-button type="primary" @click="setRoleOk"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {getRulesListFn} from '@/api/rules.js';
import {ElMessage, ElMessageBox} from 'element-plus';
import {getRolesListFn, addRolesFn, delRolesFn, editRolesFn, editStatusFn, setRolesFn} from '@/api/role.js';
import {ref, reactive, nextTick} from 'vue';

//對話框標題
const titleName = ref('');
//角色id
const roleId = ref(0);
//角色表格數據源
const tableData = ref([]);
//分頁頁碼
const page = ref(1);
//控制對話框顯示和隱藏
const dialogVisibleAddRole = ref(false);
//打開新增對話框
const oppenDialog = () => {
    titleName.value = '新增角色';
    ruleFormRoles.name = '';
    ruleFormRoles.desc = '';
    ruleFormRoles.status = 1;
    dialogVisibleAddRole.value = true;
};
//獲取form表單元素
const ruleFormRefRoles = ref(null);
//form數據源對象
const ruleFormRoles = reactive({
    name: '',
    desc: '',
    status: 1
});
//驗證規則對象
const rulesRoles = reactive({
    name: [{required: true, message: '請輸入角色名稱', trigger: 'blur'}],
    desc: [{required: true, message: '請輸入角色描述', trigger: 'blur'}]
});

//分配權限對話框
const dialogVisibleSetRole = ref(false);

//修改新增狀態
const chahgeStatus = (e) => {
    ruleFormRoles.status = e;
};

//確定新增
const addRoleOk = async () => {
    if (titleName.value == '新增角色') {
        const res = await addRolesFn(ruleFormRoles);
        console.log(res);
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg);
        }
        dialogVisibleAddRole.value = false;
        getRolesList();
    } else if (titleName.value == '編輯角色') {
        const res = await editRolesFn(roleId.value, ruleFormRoles);
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg);
        }
        dialogVisibleAddRole.value = false;
        getRolesList();
    }
};

//關閉對話框重置表單ruleFormRefRoles
const colseDialog = () => {
    ruleFormRefRoles.value.resetFields();
};

//刪除
const delRolusById = async (id) => {
    const isDel = await ElMessageBox.confirm('是否刪除?', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
    }).catch((err) => err);
    console.log(isDel);
    if (isDel !== 'confirm') {
        return;
    }

    const res = await delRolesFn(id);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    ElMessage({
        message: '刪除成功',
        type: 'success'
    });
    dialogVisibleAddRole.value = false;
    getRolesList();
};

//打開修改角色 對話框
const editRoles = (row) => {
    console.log(row);
    titleName.value = '編輯角色';
    ruleFormRoles.name = row.name;
    ruleFormRoles.desc = row.desc;
    ruleFormRoles.status = row.status;
    roleId.value = row.id;
    dialogVisibleAddRole.value = true;
};

//修改狀態
const editStatus = async (e, row) => {
    console.log(row.status);
    console.log(e);

    const res = await editStatusFn(row.id, e);
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

//獲取角色列表
const getRolesList = async () => {
    const res = await getRolesListFn(page.value);
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    tableData.value = res.data.list;
};
getRolesList();

//分配權限數據源
const rolesDtaList = ref([]);

//樹形控件配置對象
const propsSetRole = reactive({
    value: 'id',
    label: 'name',
    children: 'child'
});

//默認展開的以為數組
const defaultRoles = ref([]);
//選中的權限id
const defaultId = ref([]);

//注意 分配角色的數據就是權限管理數據
getRulesListFn().then((res) => {
    console.log(res);
    rolesDtaList.value = res.data.list;
    //循環遍歷數組，獲取默認展開值
    defaultRoles.value = res.data.list.map((item) => {
        //默認展開一級節點
        return item.id;
    });
});

//獲取屬性控件DOM元素
const treeRef = ref(null);

//打開分配角色對話框
const oppenSetRoleDialog = (row) => {
    //獲取數據之前設置為不關聯
    checkStrictly.value = true;
    //row是當前角色信息
    console.log(row);
    //當前角色ID
    roleId.value = row.id;
    //獲取默認選中權限ID數組
    defaultId.value = row.rules.map((item) => {
        return item.id;
    });
    //設置樹形控件默認選中
    setTimeout(() => {
        treeRef.value.setCheckedKeys(defaultId.value);
        //設置了默認選中之後，在設置為關聯狀態
        checkStrictly.value = false;
    }, 100);
    //打開對話框
    dialogVisibleSetRole.value = true;
};

//選擇
const treeCheck = (...e) => {
    console.log(e);
    const {checkedKeys, halfCheckedKeys} = e[1];
    defaultId.value = [...checkedKeys, ...halfCheckedKeys];
};

//在顯示覆選框的情況下，是否嚴格的遵循父子不互相關聯的做法，默認為 false
const checkStrictly = ref(false);

//確定分配角色
const setRoleOk = async () => {
    const res = await setRolesFn(roleId.value, defaultId.value);
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return;
    }
    dialogVisibleSetRole.value = false;
    getRolesList();
};
</script>

<style lang="less" scoped>
.el-card {
    margin-top: 20px;

    .el-table {
        margin-top: 20px;
    }
}

.el-tag {
    margin-right: 10px;
}

:deep(.el-dialog__body) {
    margin-top: 10px;
    padding-top: 0;
}
</style>
