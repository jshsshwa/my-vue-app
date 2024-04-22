<!-- 选择图标组件 -->
<template>
    <div class="selectIco">       

        <el-select :modelValue="modelValue" placeholder="请选择ICO图标" @change="changeHandle" filterable>

            <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                <el-icon>
                    <component :is="item"></component>
                </el-icon>
                {{ item }}
            </el-option>
        </el-select>

        <el-icon size=20 v-if="modelValue">
            <component :is="modelValue"></component>
        </el-icon>
</div>
</template>

<script setup>
//element图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {ref} from 'vue'

defineProps({
    modelValue:String
})

//将选择的数据传递给父组件
const emit=defineEmits(["update:modelValue"])


const icons=ref(Object.keys(ElementPlusIconsVue))
//获取所有图片name
console.log(Object.keys(ElementPlusIconsVue))

//select变化
const changeHandle=(e)=>{
    console.log(e)
    emit("update:modelValue",e)
}

</script>

<style lang='less' scoped>
.selectIco{
    display: flex;
    align-items: center;
    height: 35px;
    width:100%;
    .el-select{
        margin-right: 10px;
    }
  
}
</style>