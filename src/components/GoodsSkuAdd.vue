<!-- 新增多規格GoodsSku.vue子組件-->
<template>
    <el-form-item label="添加規格">
        <div class="sku_mian" v-for="(item, i) in skuList" :key="i">
            <div class="sku_top">
                <span>
                    <el-button size="small" type="primary" :icon="Delete" @click="delSku(item.id)" />
                </span>
                <el-input v-model="item.text" placeholder="請輸入規格" class="inputStyle">
                    <template #append>
                        <el-button :icon="Edit" @click="editSku(item)" />
                    </template>
                </el-input>
            </div>
            <div class="sku_content">
                <!-- <span v-for="(sub, i) in item.goodsSkusCardValue" :key="i">
                            {{ sub.text }}
                        </span>               -->
                <goodsSkuVal :skuId="item.id"></goodsSkuVal>
            </div>
        </div>
        <el-button type="primary" size="small" @click="addSku">添加規格</el-button>
    </el-form-item>
</template>

<script setup>
import {skuList, addSku, editSku, delSku} from '@/utils/useSku.js';
import {Edit, Delete} from '@element-plus/icons-vue';
import goodsSkuVal from '@/components/GoodsSkuVal.vue';
</script>

<style lang="less" scoped>
.sku_mian {
    width: 100%;
    height: auto;
    border: 1px solid #dbdbdb;
    margin-bottom: 20px;

    .sku_content {
        padding: 10px;
    }

    .sku_top {
        width: 100%;
        height: 43px;
        line-height: 43px;
        border-bottom: 1px solid #dbdbdb;

        span {
            float: right;
            margin-right: 20px;
        }

        :deep(.el-input) {
            height: 24px !important;
            font-size: 13px;
        }
    }
}

.inputStyle {
    width: 150px;
    margin-top: 8px;
    margin-left: 10px;
}
</style>
