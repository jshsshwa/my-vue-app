<!-- 選擇圖標組件 -->
<template>
    <div class="selectIco">
        <el-select v-model="model" placeholder="請選擇Icon圖標" filterable>
            <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                <el-icon>
                    <component :is="item"></component>
                </el-icon>
                {{ item }}
            </el-option>
        </el-select>

        <el-icon size="20" v-if="model">
            <component :is="model"></component>
        </el-icon>
    </div>
</template>

<script setup>
//element圖標
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import {ref} from 'vue';

const model = defineModel();
//獲取所有圖片name
const icons = ref(Object.keys(ElementPlusIconsVue));
//console.log('獲取所有圖片name', icons);

</script>

<style lang="less" scoped>
.selectIco {
    display: flex;
    align-items: center;
    height: 35px;
    width: 100%;
    .el-select {
        margin-right: 10px;
    }
}
</style>
