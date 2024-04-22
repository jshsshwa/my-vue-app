<!-- 商品编辑 -->
<template>
    <el-dialog v-model="dialogVisible" title="商品详情" width="50%" destroy-on-close>
        <el-form :model="formData">
            <el-form-item>
                <!-- <Edit v-model="formData.content"></Edit> -->              
                <wangEditor v-model="formData.content"></wangEditor>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitOk">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import wangEditor from '@/components/wangEditor.vue'
import { ElMessage } from 'element-plus'
import {getGoodsInfoById,editGoodsFn} from '@/api/goods.js'
// import Edit from '@/components/Editor.vue'
import { ref,reactive } from 'vue'
const dialogVisible = ref(false)



const formData=reactive({
    content:''
})
const goodsId=ref(0)
const oppenGoodsInfo =async (row) => {
    goodsId.value=row.id
    console.log(row.id)
    row.goodsInfoLoading=true
    //根据id 获取当前商品
    const res = await getGoodsInfoById(goodsId.value)
    row.goodsInfoLoading=false
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    formData.content = res.data.content
    dialogVisible.value = true
}

//确定修改
const submitOk=async ()=>{
    const res=await editGoodsFn(goodsId.value,formData)
    console.log(res)
    if(res.msg&&res.msg!=='ok'){
        return ElMessage.error(res.msg)
    }

    ElMessage({
            message: '设置商品详情成功',
            type: 'success',
        })

    dialogVisible.value = false


}




//导出方法
defineExpose({
    oppenGoodsInfo
})



</script>

<style lang='less' scoped></style>