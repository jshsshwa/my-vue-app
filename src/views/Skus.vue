<!--  -->
<template>
    <div>
        <el-card>
            <el-button type="primary" size="small" @click="oppenDialog">新增</el-button>
            <el-button type="danger" size="small" @click="delSkuAll">批量删除</el-button>
            <!-- 表格 -->
            <el-table :data="skusList" style="width: 100%" stripe border @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="规格名称" />
                <el-table-column prop="default" label="规格数据" />
                <el-table-column prop="order" label="排序" />
                <el-table-column label="状态">
                    <template #default="scope">
                        <div>
                            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                                @change="editStatus1(scope.row)" />
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
                <el-form-item label="规格名称" prop="name">
                  
                    <el-input v-model="ruleFormAddSku.name" />
                </el-form-item>

                <el-form-item label="规格数据" prop="default">
                    <tagInput v-model="ruleFormAddSku.default"></tagInput>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="ruleFormAddSku.order" :min="1" :max="1000" @change="handleChangeOrder" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="ruleFormAddSku.status" :active-value="1" :inactive-value="0" @change="isStatus" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddSku = false">取消</el-button>
                    <el-button type="primary" @click="addSkuOk">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import tagInput from '@/components/TagInput.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive } from 'vue'
import { getSkusFn, addSkusFn, editStatus, editSkuFn, delSkuFn } from '@/api/skus.js'

import { Delete, Edit } from '@element-plus/icons-vue'

//sku列表
const skusList = ref([])
const getSkusList = async () => {
    const res = await getSkusFn(2)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return
    }
    skusList.value = res.data.list

}
getSkusList()

//对话框标题
const TipsTitle = ref('')

//新增/编辑 对话框
const dialogVisibleAddSku = ref(false)
//from表单DOM元素
const ruleFormRefAddSku = ref(null)
//表单数据源
const ruleFormAddSku = reactive({
    name: '',
    default: '',
    order: 0,
    status: 1
})
//规格id
const skuId = ref(0)
//批量删除规格id
const skuIds=ref([])
//表单验证规则
const rulesAddSku = reactive({
    name: [
        { required: true, message: '请输入规格名称', trigger: 'blur' }
    ],
    default: [
        { required: true, message: '请输入规格数据', trigger: 'blur' }
    ]
})

//排序
const handleChangeOrder = (e) => {
    ruleFormAddSku.order = e
}

//修改状态
const isStatus = (e) => {
    ruleFormAddSku.status = e
}

//打开新增
const oppenDialog = () => {
    TipsTitle.value = '新增'
    ruleFormAddSku.name = ''
    ruleFormAddSku.default = ''
    ruleFormAddSku.order = 1
    ruleFormAddSku.status = 1
    dialogVisibleAddSku.value = true
}

//确定新增/编辑
const addSkuOk = async () => {
    if (TipsTitle.value == '新增') {
        const res = await addSkusFn(ruleFormAddSku)
        console.log(res)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        dialogVisibleAddSku.value = false
        getSkusList()
    } else if (TipsTitle.value == '编辑') {
        const res = await editSkuFn(skuId.value, ruleFormAddSku)
        console.log(res)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        dialogVisibleAddSku.value = false
        getSkusList()
    }
}

//修改状态
const editStatus1 = async (row) => {
    const res = await editStatus(row.id, row.status)
    if (res.msg && res.msg !== 'ok') {
        if (row.status == 1) {
            row.status = 0
        }
        if (row.status == 0) {
            row.status = 1
        }
        return
    }
    ElMessage({
        message: '状态修改成功',
        type: 'success',
    })
}

//打开编辑对话框，并初始化数据
const editSku = (row) => {
    TipsTitle.value = '编辑'
    skuId.value = row.id

    ruleFormAddSku.name = row.name
    ruleFormAddSku.default = row.default
    ruleFormAddSku.order = row.order
    ruleFormAddSku.status = row.status

    dialogVisibleAddSku.value = true
}

//删除
const delSku = async (id) => {

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
    const res = await delSkuFn([id])
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return
    }
    ElMessage({
        message: '删除成功',
        type: 'success',
    })
    getSkusList()
}

//关闭对话框事件
const colseDialog = () => {
    //重置
    ruleFormRefAddSku.value.resetFields()
}

//监听批量选中数据
const handleSelectionChange=(val)=>{
    console.log(val.map(item=>item.id))
    skuIds.value=val.map(item=>item.id)

}

//批量删除
const delSkuAll = async () => {
    const isdel = await ElMessageBox.confirm(
        '是否删除选中项?',
        '批量删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(err=>err)
    console.log(isdel)
    if(isdel!=='confirm'){
        return
    }
    //执行批量删除
    const res=await delSkuFn(skuIds.value)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    getSkusList()
    ElMessage({
        message: '批量删除成功',
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
}
</style>