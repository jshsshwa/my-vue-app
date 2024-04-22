<!-- 管理员管理 -->
<template>
    <div>
        <el-card>
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-input v-model="keyword" placeholder="请输入管理员" clearable @clear="getDataList">
                        <template #append>
                            <el-button :icon="Search" @click="getDataList" />
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="addManagerHandle">新增管理员</el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData" style="width: 100%;margin-bottom:20px">
                <el-table-column label="管理员">
                    <template #default="scope">
                        <div class="avatar">
                            <el-avatar :size="50" :src="scope.row.avatar" />
                            {{ scope.row.username }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="所属管理员">
                    <template #default="scope">
                        <div>
                            <!-- {{  scope.row.role? scope.row.role.name:'-'}} -->
                            {{ scope.row.role.name }}

                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template #default="scope">
                        <div>
                            <!-- active-value switch 打开状态的值
                                inactive-value switch 关闭状态的值                            
                            -->
                            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                                @change="changeState($event, scope.row)" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <div>
                            <el-button type="primary" :icon="Edit" size="small" @click="editManagerHandle(scope.row)" />
                            <el-button type="warning" :icon="Delete" size="small"
                                @click="delMansgerHandle(scope.row.id)" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="page" v-model:page-size="limit" :page-sizes="[5, 10, 15, 20]"
            :small="small" :background="background" layout="total, sizes, prev, pager, next, jumper" :total=total
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-card>
        <!-- 新增对话框 -->
        <el-dialog v-model="dialogVisibleAddManager" :title="dialogTitle" width="40%" @close="colseAddDialogHandle">
            <el-form ref="ruleFormRefAddManager" :model="ruleFormAddManager" :rules="rulesAddManager"
                label-width="105px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="ruleFormAddManager.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="dialogTitle == '新增管理员'">
                    <el-input v-model="ruleFormAddManager.password" />
                </el-form-item>
                <el-form-item label="所属角色" prop="role_id">
                    <el-select v-model="ruleFormAddManager.role_id" placeholder="请选择角色" class="select-width"
                        @change="selectChange">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <SelectImg v-model="ruleFormAddManager.avatar"></SelectImg>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="ruleFormAddManager.status" :active-value="1" :inactive-value="0"
                        @change="chageStateHandle($event)" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddManager = false">取消</el-button>
                    <el-button type="primary" @click="addManagerOkHandle">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        
    </div>
</template> 

<script setup>
import SelectImg from '@/components/SelectImg.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getManagerList, editState, addManager, editManager, delManager } from '@/api/manager.js'
import { ref, reactive } from 'vue'
const Search = ref('Search')
const Edit = ref('Edit')
const Delete = ref('Delete')
const small = ref('small')
const background = ref('background')


//分页页码
const page = ref(1)
//分页条数
const limit = ref(5)
//搜索关键字
const keyword = ref('')
const tableData = ref([])
//条数
const total = ref(0)
//角色列表
const rolesList = ref([])


//新增管理员数参数str
const ruleFormAddManager = reactive({
    username: '',
    password: '',
    //所属角色就是获取管理员列表中的  roles属性
    role_id: null,
    status: 1,
    avatar: ''
})
//验证规则
const rulesAddManager = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    role_id: [
        { required: true, message: '请选择所属管理员', trigger: 'blur' }
    ]
})
//新增对话框
const dialogVisibleAddManager = ref(false)
//表单DOM元素
const ruleFormRefAddManager = ref(null)

//对话框标题
const dialogTitle = ref('')

//编辑id 
const managerId = ref(null)

//end

//select 
const selectChange = (val) => {
    console.log(val)
    ruleFormAddManager.role_id = val

}


//获取管理员数据
const getDataList = async () => {
    const res = await getManagerList(page.value, limit.value, keyword.value)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return
    }
    tableData.value = res.data.list
    total.value = res.data.totalCount
    rolesList.value = res.data.roles
}
getDataList()

//修改状态
const changeState = async (e, row) => {
    console.log(row)
    //调用api
    const res = await editState(row.id, e)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        if (row.status == 0) {
            row.status = 1

        } else if (row.status == 1) {
            row.status = 0
        }
        ElMessage.error(res.msg)
        return
    }
    //提示成功
    ElMessage({
        message: '状态修改成功',
        type: 'success',
    })
}

//修改管理员状态
const chageStateHandle = (e) => {
    console.log(e)
    ruleFormAddManager.status = e
}

//打开新增管理员对话框
const addManagerHandle = () => {
    ruleFormAddManager.username = ''
    ruleFormAddManager.role_id = null
    ruleFormAddManager.status = 1
    ruleFormAddManager.avatar = ''
    dialogTitle.value = '新增管理员'
    dialogVisibleAddManager.value = true
}
//关闭对话框重置数据
const colseAddDialogHandle = () => {
    ruleFormRefAddManager.value.resetFields()
}
//确定新增管理员
const addManagerOkHandle = () => {
    //校验表单数据
    ruleFormRefAddManager.value.validate(async isValid => {
        if (!isValid) {
            return
        }
        if (dialogTitle.value == '新增管理员') {
            //校验通过调用api接口
            const res = await addManager(ruleFormAddManager)
            console.log(res)
            if (res.msg && res.msg !== 'ok') {
                return ElMessage.error(res.msg)
            }
            //关闭对话框
            dialogVisibleAddManager.value = false
            //刷新数据
            getDataList()
        } else if (dialogTitle.value == '编辑管理员') {
            //console.log('编辑管理员')
            const res = await editManager(managerId.value, ruleFormAddManager)
            console.log(res)
            if (res.msg && res.msg !== 'ok') {
                return ElMessage.error(res.msg)
            }
            //关闭对话框
            dialogVisibleAddManager.value = false
            //刷新数据
            getDataList()



        }
    })
}

//删除管理员
const delMansgerHandle = async (i) => {

    //是否删除？
    const isdel = await ElMessageBox.confirm(
        '是否删除？',
        '删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(err => err)
    if (isdel !== 'confirm') {
        return
    }
    //调用api接口
    const res = await delManager(i)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    //获取最新数据
    getDataList()
}

//编辑
const editManagerHandle = (row) => {
    console.log(row)
    dialogTitle.value = '编辑管理员'
    managerId.value = row.id
    //初始化数据
    ruleFormAddManager.username = row.username
    ruleFormAddManager.role_id = row.role_id
    ruleFormAddManager.status = row.status
    ruleFormAddManager.avatar = row.avatar

    //打开对话框
    dialogVisibleAddManager.value = true
}

//分页
const handleSizeChange = (val) => {
    limit.value = val
    getDataList()

}
const handleCurrentChange = (val) => {
    page.value = val
    getDataList()

}


</script>

<style lang='less' scoped>
.el-card {
    margin-top: 20px
}

.el-table {
    margin-top: 20px
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