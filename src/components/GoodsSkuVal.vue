<!-- 规格值
     GoodsSkuAdd的子组件
-->
<template>
    <div>
        <!-- <span v-for="(sub, i) in item.goodsSkusCardValue" :key="i">
                        {{ sub.text }}
                    </span> -->
        <el-tag v-for="(tag, i) in item.goodsSkusCardValue" :key="i" closable :disable-transitions="false"
            @close="handleClose(tag)">
            <el-input v-model="tag.text" class="inputStyle" @change="editSkuVal($event, tag)"></el-input>

        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="inputStyle" size="small"
            @keyup.enter="handleInputConfirm()" @blur="handleInputConfirm()" />
        <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
            + New Tag
        </el-button>

    </div>
</template>

<script setup>
import { initSkuItemVal } from '@/utils/useSku.js'






//接收父组件传递的id
const props = defineProps({
    skuId: [Number, String]
})
const { item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm, 
    editSkuVal } = initSkuItemVal(props.skuId)

</script>

<style lang='less' scoped>
.el-tag {
    margin-right: 10px;
}

.inputStyle {
    width: 70px;
    height: 18px;
    font-size: 12px;
}</style>