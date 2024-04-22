<!-- 角色管理 -->
<template>
    <div>
        <el-card>
            <el-button type="primary" size="small" @click="oppenDialog">新增</el-button>
            <!-- 表格 -->
            <el-table :data="tableData" style="width: 100%" stripe border>
                <el-table-column prop="name" label="角色名称" />
                <el-table-column prop="desc" label="角色描述" />
                <el-table-column label="状态">
                    <template #default="scope">
                        <div>
                            <el-switch :active-value="1" :inactive-value="0" v-model="scope.row.status"
                                @change="editStatus($event, scope.row)" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <div>
                            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                                <el-button type="primary" :icon="Share" size="small"
                                    @click="oppenSetRoleDialog(scope.row)" />
                            </el-tooltip>
                            <el-button type="warning" :icon="Edit" size="small" @click="editRoles(scope.row)" />
                            <el-button type="danger" :icon="Delete" size="small" @click="delRolusById(scope.row.id)" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog v-model="dialogVisibleAddRole" :title="titleName" width="40%" @close="colseDialog">
            <el-form ref="ruleFormRefRoles" :model="ruleFormRoles" :rules="rulesRoles" label-width="80px" status-icon>
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="ruleFormRoles.name" />
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="ruleFormRoles.desc" :rows="2" type="textarea" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="ruleFormRoles.status" :active-value="1" :inactive-value="0"
                        @change="chahgeStatus" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddRole = false">取消</el-button>
                    <el-button type="primary" @click="addRoleOk">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog v-model="dialogVisibleSetRole" title="分配权限" width="30%">
            <el-tree-v2 ref="treeRef" node-key="id" :default-expanded-keys="defaultRoles" show-checkbox :height="360"
                :props="propsSetRole" :data="rolesDtaList" @check="treeCheck" :check-strictly="checkStrictly">
                <template #default="{ node, data }">
                    <span> <el-tag v-if="data.menu == 1">菜单</el-tag><el-tag type="success"
                            v-if="data.menu == 0">权限</el-tag>{{
                                data.name }}</span>
                </template>
            </el-tree-v2>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleSetRole = false">取消</el-button>
                    <el-button type="primary" @click="setRoleOk">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { getRulesListFn } from '@/api/rules.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRolesListFn, addRolesFn, delRolesFn, editRolesFn, editStatusFn, setRolesFn } from '@/api/role.js'
import { ref, reactive, nextTick } from 'vue'
const Share = ref('Share')
const Edit = ref('Edit')
const Delete = ref('Delete')

//对话框标题
const titleName = ref('')
//角色id
const roleId = ref(0)
//角色表格数据源
const tableData = ref([])
//分页页码
const page = ref(1)
//控制对话框显示和隐藏
const dialogVisibleAddRole = ref(false)
//打开新增对话框
const oppenDialog = () => {
    titleName.value = '新增角色'
    ruleFormRoles.name = ''
    ruleFormRoles.desc = ''
    ruleFormRoles.status = 1
    dialogVisibleAddRole.value = true
}
//获取form表单元素
const ruleFormRefRoles = ref(null)
//form数据源对象
const ruleFormRoles = reactive({
    name: '',
    desc: '',
    status: 1
})
//验证规则对象
const rulesRoles = reactive({
    name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' }
    ],
    desc: [
        { required: true, message: '请输入角色描述', trigger: 'blur' }
    ]

})

//分配权限对话框
const dialogVisibleSetRole = ref(false)

//修改新增状态
const chahgeStatus = (e) => {
    ruleFormRoles.status = e
}

//确定新增
const addRoleOk = async () => {
    if (titleName.value == '新增角色') {
        const res = await addRolesFn(ruleFormRoles)
        console.log(res)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        dialogVisibleAddRole.value = false
        getRolesList()
    } else if (titleName.value == '编辑角色') {
        const res = await editRolesFn(roleId.value, ruleFormRoles)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        dialogVisibleAddRole.value = false
        getRolesList()
    }
}

//关闭对话框重置表单ruleFormRefRoles
const colseDialog = () => {
    ruleFormRefRoles.value.resetFields()
}

//删除
const delRolusById = async (id) => {
    const isDel = await ElMessageBox.confirm(
        '是否删除?',
        '删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(err => err)
    console.log(isDel)
    if (isDel !== 'confirm') {
        return
    }

    const res = await delRolesFn(id)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    ElMessage({
        message: '删除成功',
        type: 'success',
    })
    dialogVisibleAddRole.value = false
    getRolesList()
}

//打开修改角色 对话框
const editRoles = (row) => {
    console.log(row)
    titleName.value = '编辑角色'
    ruleFormRoles.name = row.name
    ruleFormRoles.desc = row.desc
    ruleFormRoles.status = row.status
    roleId.value = row.id
    dialogVisibleAddRole.value = true

}

//修改状态
const editStatus = async (e, row) => {
    console.log(row.status)
    console.log(e)

    const res = await editStatusFn(row.id, e)
    if (res.msg && res.msg !== 'ok') {
        if (row.status == 1) {
            row.status = 0
        }
        if (row.status == 0) {
            row.status = 1
        }
        ElMessage.error(res.msg)
        return
    }
    ElMessage({
        message: '状态修改成功',
        type: 'success',
    })


}

//获取角色列表
const getRolesList = async () => {
    const res = await getRolesListFn(page.value)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    tableData.value = res.data.list

}
getRolesList()



//分配权限数据源
const rolesDtaList = ref([])

//树形控件配置对象
const propsSetRole = reactive({
    value: 'id',
    label: 'name',
    children: 'child',
})

//默认展开的以为数组
const defaultRoles = ref([])
//选中的权限id
const defaultId = ref([])



//注意 分配角色的数据就是权限管理数据
getRulesListFn().then(res => {
    console.log(res)
    rolesDtaList.value = res.data.list
    //循环遍历数组，获取默认展开值
    defaultRoles.value = res.data.list.map(item => {
        //默认展开一级节点
        return item.id
    })
})


//获取属性控件DOM元素
const treeRef = ref(null)

//打开分配角色对话框
const oppenSetRoleDialog = (row) => {
    //获取数据之前设置为不关联
    checkStrictly.value = true
    //row是当前角色信息
    console.log(row)
    //当前角色ID
    roleId.value = row.id
    //获取默认选中权限ID数组
    defaultId.value = row.rules.map(item => {
        return item.id
    })
    //设置树形控件默认选中
    setTimeout(() => {
        treeRef.value.setCheckedKeys(defaultId.value)
        //设置了默认选中之后，在设置为关联状态
        checkStrictly.value = false
    }, 100)
    //打开对话框
    dialogVisibleSetRole.value = true
}

//选择
const treeCheck = (...e) => {
    console.log(e)
    const { checkedKeys, halfCheckedKeys } = e[1]
    defaultId.value = [...checkedKeys, ...halfCheckedKeys]
}

//在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
const checkStrictly = ref(false)

//确定分配角色
const setRoleOk = async () => {

    const res = await setRolesFn(roleId.value, defaultId.value)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return
    }
    dialogVisibleSetRole.value = false
    getRolesList()
}

</script>

<style lang='less' scoped>
.el-card {
    margin-top: 20px;

    .el-table {
        margin-top: 20px;
    }
}

.el-tag {
    margin-right: 10px
}

:deep(.el-dialog__body) {
    margin-top: 10px;
    padding-top: 0;
}
</style>