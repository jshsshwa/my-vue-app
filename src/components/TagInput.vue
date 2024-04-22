<!-- 输入规格组件 -->
<template>
    <div>
        <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false"
            @close="handleClose(tag)">
            {{ tag }}
        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
            + 添加
        </el-button>
    </div>
</template>

<script setup>

import { nextTick, ref, defineProps } from 'vue'
import { ElInput } from 'element-plus'

//接收父组件v-model的值
const props=defineProps({
    modelValue:String
})

const emit=defineEmits(['update:modelValue'])

const inputValue = ref('')
//将接收的父组件字符串转成数组
const dynamicTags = ref(props.modelValue?props.modelValue.split(','):[])
const inputVisible = ref(false)
const InputRef = ref()

const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
   //传字符串
   emit('update:modelValue',dynamicTags.value.join(','))
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
    //传字符串
    emit('update:modelValue',dynamicTags.value.join(','))
  }
  inputVisible.value = false
  inputValue.value = ''
}


</script>

<style lang='less' scoped>
.el-tag{
    margin-right: 5px;
}
.el-input{
    width: 100px;
}
</style>