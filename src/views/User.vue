<!-- 用户管理 -->
<template>
    <div>
        <el-card>
            <el-row>
                <el-col :span="9">
                    <el-input v-model="queryData.keyword" placeholder="请输入用户名" clearable @clear="getUserList">
                        <template #prepend>
                            <el-select v-model="queryData.user_level_id" placeholder="请选择会员等级" clearable
                                style="width: 145px">
                                <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id" />

                            </el-select>
                        </template>
                        <template #append>
                            <el-button :icon="Search" @click="getUserList" />
                        </template>
                    </el-input>
                </el-col>

            </el-row>
            <el-row style="margin-top:20px;">
                <el-col :span="4">
                    <el-button type="primary" @click="openDialog">新增用户</el-button>
                </el-col>

            </el-row>
            <el-table :data="tableData" style="width: 100%" border stripe>
                <el-table-column prop="date" label="用户">
                    <template #default="scope">
                        <div class="avatar">
                            <el-avatar :size="50" :src="scope.row.avatar" />
                            <span>{{ scope.row.username }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="user_level.name" label="会员等级" />
                <el-table-column prop="create_time" label="注册时间" />
                <el-table-column prop="date" label="状态">
                    <template #default="scope">
                        <div>
                            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                                @change="changeHandle(scope.row)" />
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

        <el-dialog v-model="dialogVisible" :title="Tips" width="40%">
            <el-form :model="formData" label-width="120px">
                <el-form-item label="用户名">
                    <el-input v-model="formData.username" />
                </el-form-item>
                <el-form-item label="密码" v-if="Tips == '新增'">
                    <el-input v-model="formData.password" />
                </el-form-item>
                <el-form-item label="会员等级">
                    <el-select v-model="formData.user_level_id" placeholder="请选择会员等级" style="width: 100%;">
                        <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="formData.nickname" />
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="formData.phone" />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="formData.email" />
                </el-form-item>
                <el-form-item label="头像">
                    <SelectImg v-model="formData.avatar"></SelectImg>
                </el-form-item>
                <el-form-item label="启用状态">
                    <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitOK">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import SelectImg from '@/components/SelectImg.vue'
import { Delete, Edit, Search } from '@element-plus/icons-vue'

import { getUserListFn, addUserFn, editUserFn, delUserFn, editUserStatus } from '@/api/user.js'
import { ref, reactive } from 'vue'
const tableData = ref([])
const page = ref(1)
const queryData = reactive({
    limit: 10,
    keyword: '',
    //会员等级ID
    user_level_id: null
})

//会员等级分类
const levelList = ref([])

//获取用户列表
const getUserList = async () => {
    const res = await getUserListFn(page.value, queryData)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    tableData.value = res.data.list
    levelList.value = res.data.user_level
}
getUserList()

const dialogVisible = ref(false)
const Tips = ref('')

const formData = reactive({
    username: '',
    password: '',
    user_level_id: null,
    nickname: '',
    phone: '',
    email: '',
    avatar: '',
    status: 1
})

//打开新增
const openDialog = () => {
    Tips.value = '新增'
    formData.username = ''
    formData.user_level_id = null
    formData.nickname = ''
    formData.phone = null
    formData.email = ''
    formData.avatar = ''
    formData.status = 1
    dialogVisible.value = true
}

const userId = ref(0)

//打开编辑
const openDialogEdit = (row) => {
    console.log(row)
    userId.value = row.id
    Tips.value = '编辑'
    formData.username = row.username
    formData.user_level_id = row.user_level_id
    formData.nickname = row.nickname
    formData.phone = row.phone
    formData.email = row.email
    formData.avatar = row.avatar
    formData.status = row.status
    dialogVisible.value = true

}

//确定新增
const submitOK = async () => {
    if (Tips.value == '新增') {
        const res = await addUserFn(formData)
        console.log(res)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        dialogVisible.value = false
        ElMessage({
            message: '新增成功',
            type: 'success',
        })
        getUserList()
    }
    if (Tips.value == '编辑') {
        const res = await editUserFn(userId.value, formData)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        dialogVisible.value = false
        ElMessage({
            message: '编辑成功',
            type: 'success',
        })
        getUserList()
    }

}

//删除
const delUser = async (id) => {
    const isdel = await ElMessageBox.confirm(
        '是否删除?',
        '删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(err => err)
    console.log(isdel)
    if (isdel !== 'confirm') {
        return
    }
    const res = await delUserFn(id)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    ElMessage({
        message: '删除成功',
        type: 'success',
    })
    getUserList()

}

const changeHandle = async (row) => {
    console.log(row)
    const res = await editUserStatus(row.id, row.status)
    if (res.msg && res.msg !== 'ok') {
        ElMessage.error(res.msg)
        if (row.status == 0) {
            row.status = 1
        } else if (row.status == 1) {
            row.status = 0
        }
        return
    }
    ElMessage({
        message: '修改状态成功',
        type: 'success',
    })

}


</script>

<style lang='less' scoped>
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