<!-- 修改轮播图 -->
<template>
    <el-dialog v-model="dialogVisible" title="设置轮播图" width="40%" destroy-on-close>
        <el-form :model="formData">
            <el-form-item label="轮播图">
                <selectImg :num="5" v-model="formData.banners"></selectImg>
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
import { ElMessage } from 'element-plus'
import { getGoodsInfoById, setGoodsBanner } from '@/api/goods.js'
import selectImg from '@/components/SelectImg.vue'
import { ref, reactive } from 'vue'
const dialogVisible = ref(false)
const formData = reactive({
    banners: []
})



const goodsId = ref(null)

//暴露方法打开对话框
const openDialog = async (row) => {
    //获取父组件传递的id
    goodsId.value = row.id
    row.isLoading=true
    //根据商品Id获取商品信息
    const res = await getGoodsInfoById(goodsId.value)
    row.isLoading=false
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    formData.banners = res.data.goodsBanner.map(item => item.url)
    dialogVisible.value = true
    console.log(formData.banners)
}

//确定设置轮播图
const submitOk = async () => {
    const res = await setGoodsBanner(goodsId.value, formData)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    ElMessage({
        message: '轮播图设置成功',
        type: 'success',
    })

    dialogVisible.value = false

}


defineExpose({
    openDialog
})

</script>

<style lang='less' scoped></style>