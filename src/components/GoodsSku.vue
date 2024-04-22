<!--  -->
<template>
  <el-dialog v-model="dialogVisible" title="设置商品规格" width="60%" destroy-on-close>
    <el-form :model="formData" label-width="120px">
      <el-form-item label="规格类型">
        <el-radio-group v-model="formData.sku_type">
          <el-radio :label="0" border>单规格</el-radio>
          <el-radio :label="1" border>多规格</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="formData.sku_type == 0">
        <el-form-item label="市场价">
          <el-input v-model="formData.sku_value.oprice">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价">
          <el-input v-model="formData.sku_value.pprice">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本价">
          <el-input v-model="formData.sku_value.cprice">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="重量">
          <el-input v-model="formData.sku_value.weight">
            <template #append>公斤</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input v-model="formData.sku_value.volume">
            <template #append>立方米</template>
          </el-input>
        </el-form-item>
      </template>
      <template v-if="formData.sku_type == 1">
        <!-- 新增多规格组件 -->
        <goodsSkuAdd></goodsSkuAdd>
        <!-- 多规格表格数据 -->
        <skuTableList></skuTableList>
      </template>
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
import skuTableList from '@/components/skuTable.vue'
import { initSkuList, goodsId ,skuTable} from '@/utils/useSku.js'
import goodsSkuAdd from '@/components/GoodsSkuAdd.vue'
import { ElMessage } from 'element-plus'
import { editStuFn, getGoodsInfoById } from '@/api/goods.js'
import { ref, reactive } from 'vue'
const dialogVisible = ref(false)

//表单数据源
const formData = reactive({
  sku_type: 0,
  sku_value: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0
  }
})


const openDialog = async (row) => {
  //console.log(row)
  goodsId.value = row.id
  //初始化商品规格
  //根据商品Id获取商品信息
  row.goodsSkuLoading=true
  const res = await getGoodsInfoById(goodsId.value)
  row.goodsSkuLoading=false
  console.log(res)
  if (res.msg && res.msg !== 'ok') {
    return ElMessage.error(res.msg)
  }
  formData.sku_type = res.data.sku_type
  formData.sku_value = res.data.sku_value || {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0
  }
  //获取到多规格列表
  initSkuList(res.data)

  dialogVisible.value = true
}
//确定设置商品规格
const submitOk = async () => {
  let data={
    sku_type:formData.sku_type,
    sku_value:formData.sku_value
  }
  if(data.sku_type==1){
    data.goodsSkus=skuTable.value
  }
  const res = await editStuFn(goodsId.value, data)
  console.log(res)
  if (res.msg && res.msg !== 'ok') {
    return ElMessage.error(res.msg)
  }
  ElMessage({
    message: '设置规格成功',
    type: 'success',
  })
  dialogVisible.value = false

}

//共享方法
defineExpose({
  openDialog
})

</script>

<style lang='less' scoped></style>