<!-- 图片上传组件 -->
<template>   
    <el-upload drag :action="uploadPicAction" multiple :headers="{
        token
    }" name="img" :data="data" :on-success="onSuccess" :on-error="onError">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
            请选择图片
        </div>
      
    </el-upload>
</template>

<script setup>
import { uploadPicAction } from '@/api/pics.js'
import { ref } from 'vue'
//接收父组件信息
defineProps({
    data:Object
})

const token = ref(window.sessionStorage.getItem('token'))

const emit = defineEmits(["success"])
//监听上传成功
const onSuccess = (response, uploadFile, uploadFiles) => {
    console.log(response)
    emit('success', {
        response, uploadFile, uploadFiles
    })

}
//监听上传失败
const onError = (error, uploadFile, uploadFiles) => {
    console.log(error.message)

}

</script>

<style lang='less' scoped>

</style>