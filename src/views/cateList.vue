<!--  -->
<template>
    <div>
        <el-card>
            <div>
                <el-button type="primary" @click="openDialog">添加分類</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" stripe border>
                <el-table-column type="index" width="50" />
                <el-table-column prop="name" label="分類名稱" />
                <el-table-column prop="name" label="分類狀態">
                    <template #default="scope">
                        <div>
                            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeHandle(scope.row)"  />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="操作">
                    <template #default="scope">
                        <div>
                            <el-button type="primary" :icon="Edit" size="small" @click="oppenDialogEdit(scope.row)" />
                            <el-button type="danger" :icon="Delete" size="small" @click="delGoodsCate(scope.row.id)" />

                        </div>
                    </template>
                </el-table-column>


            </el-table>
        </el-card>
        <!-- 添加分類 -->
        <el-dialog v-model="dialogVisibleAddCate" :title="Tips" width="40%" @close="closeDialog">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
                <el-form-item label="商品名稱" prop="name">
                    <el-input v-model="ruleForm.name" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddCate = false">取消</el-button>
                    <el-button type="primary" @click="submitOk">
                        確定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'

import { Delete, Edit } from '@element-plus/icons-vue'

import { editGoodsCateStatus,delEditGoodsCate, editGoodsCateFn, getGoodsCateFn, addGoodsCateFn } from '@/api/goodsCate.js'
import { ref, reactive } from 'vue'

const tableData = ref([])

const goodsCateId = ref(0)

const dialogVisibleAddCate = ref(false)
const Tips = ref('')
const ruleFormRef = ref(null)
const ruleForm = reactive({
    name: ''
})
const rules = reactive({
    name: [
        { required: true, message: '請輸入商品名稱', trigger: 'blur' }

    ]
})

//重置
const closeDialog = () => {
    ruleFormRef.value.resetFields()
}

//確定
const submitOk = () => {
    ruleFormRef.value.validate(async isValid => {
        if (!isValid) return
        if (Tips.value == '新增') {
            const res = await addGoodsCateFn(ruleForm.name)
            console.log(res)
            if (res.msg && res.msg !== 'ok') {
                return
            }
            dialogVisibleAddCate.value = false
            ElMessage({
                message: '新增成功.',
                type: 'success',
            })
            getGoodsCate()
        }
        if (Tips.value == '編輯') {
            const res = await editGoodsCateFn(goodsCateId.value, ruleForm.name)
            console.log(res)
            if (res.msg && res.msg !== 'ok') {
                return ElMessage.error(res.msg)
            }
            dialogVisibleAddCate.value = false
            ElMessage({
                message: '編輯成功.',
                type: 'success',
            })
            getGoodsCate()
        }
    })

}

//刪除
const delGoodsCate = async (id) => {
    const isdel = await ElMessageBox.confirm(
        '是否刪除?',
        '刪除',
        {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(err => err)
    console.log(isdel)
    if (isdel !== 'confirm') {
        return
    }

    const res = await delEditGoodsCate(id)
    if (res.msg && res.msg !== 'ok') {
        return
    }
    ElMessage({
        message: '刪除成功.',
        type: 'success',
    })
    getGoodsCate()

}



//打開新增
const openDialog = () => {
    ruleForm.name = ''
    Tips.value = '新增'
    dialogVisibleAddCate.value = true
}


//打開編輯
const oppenDialogEdit = (row) => {
    console.log(row)
    Tips.value = '編輯'
    ruleForm.name = row.name
    goodsCateId.value = row.id

    dialogVisibleAddCate.value = true

}

//獲取商品分類
const getGoodsCate = async () => {
    const res = await getGoodsCateFn()
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    tableData.value = res.data
}
getGoodsCate()

const changeHandle=async (row)=>{
    console.log(row)
    const res= await editGoodsCateStatus(row.id,row.status)
    if(res.msg&&res.msg!=='ok'){
        if(row.status==0){
            row.status=1
        }else if(row.status==1){
            row.status=0
        }
        ElMessage.error(res.msg)
        return 
    }
    ElMessage({
        message: '狀態修改成功.',
        type: 'success',
    })


}


</script>

<style lang='less' scoped>
.el-card {
    margin-top: 20px;
    .el-table {
        margin-top: 20px
    }
}
</style>