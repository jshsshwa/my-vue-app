<!-- 輸入規格組件 -->
<template>
    <div>
        <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
            {{ tag }}
        </el-tag>
        <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput"> + 新增 </el-button>
    </div>
</template>

<script setup>
import {nextTick, ref} from 'vue';

//接收父組件v-model的值
const model = defineModel();

//將接收的父組件字符串轉成數組
const dynamicTags = ref(model.value ? model.value.split(',') : []);

const inputValue = ref('');

const inputVisible = ref(false);
const InputRef = ref();

const handleClose = (tag) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
    //傳字符串
    model.value = dynamicTags.value.join(',');
};

const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
        InputRef.value.input.focus();
    });
};

const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value);
        // console.log('dynamicTags.value',dynamicTags.value);
        // console.log('dynamicTags.value.join(',')',dynamicTags.value.join(','));
        //傳字符串
        model.value = dynamicTags.value.join(',');
    }
    inputVisible.value = false;
    inputValue.value = '';
};
</script>

<style lang="less" scoped>
.el-tag {
    margin-right: 5px;
}
.el-input {
    width: 100px;
}
</style>
