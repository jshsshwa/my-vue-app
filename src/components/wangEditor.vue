<!-- 富文本 -->
<template>
    <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
        <Editor
            style="height: 300px; overflow-y: hidden"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
        />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import {onBeforeUnmount, ref, shallowRef, watch} from 'vue';
import {Editor, Toolbar} from '@wangeditor/editor-for-vue';

//v-bind父組件傳遞的數據
const valueHtml = defineModel();

// 編輯器實例，必須用 shallowRef
const editorRef = shallowRef();
const mode = 'default';
const toolbarConfig = {};
const editorConfig = {placeholder: '請輸入內容...'};

// 組件銷燬時，也及時銷燬編輯器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

const handleCreated = (editor) => {
    editorRef.value = editor; // 記錄 editor 實例，重要！
};
</script>

<style lang="less" scoped></style>
