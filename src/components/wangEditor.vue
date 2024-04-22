<!-- 富文本 -->
<template>
    <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
        <Editor style="height: 300px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
            @onCreated="handleCreated" />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'


// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

//接收父组件传递的数据
const props = defineProps({
    modelValue:String
})

// 内容 HTML
const valueHtml = ref(props.modelValue)

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }



const emit = defineEmits(["update:modelValue"])
// emit("update:modelValue", valueHtml.value)

watch(props, (newVal) => valueHtml.value = newVal.modelValue)
watch(valueHtml, (newVal) => emit("update:modelValue", newVal))

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
   
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

</script>    

<style lang='less' scoped></style>