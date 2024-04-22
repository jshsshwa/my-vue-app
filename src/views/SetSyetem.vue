<!-- 系统设置 -->
<template>
    <div>
        <el-card>
            <el-form :model="formData" label-width="130px">
                <el-tabs v-model="activeName" @tab-click="handleClickTabs">
                    <el-tab-pane label="注册设置" name="1">
                        <el-form-item label="是否允许注册会员">
                            <el-radio-group v-model="formData.open_reg" size="small">
                                <el-radio :label="1" border>是</el-radio>
                                <el-radio :label="0" border>否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="注册类型">
                            <el-radio-group v-model="formData.reg_method" size="small">
                                <el-radio label="username" border>普通注册</el-radio>
                                <el-radio label="phone" border>手机注册</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="密码最小长度">
                            <el-input v-model="formData.password_min" type="number" />
                        </el-form-item>
                        <!-- 0数字、1小写字母、2大写字母、3符号 -->
                        <!-- 注意：加上：0表示数字，去掉冒号0表示字符串 -->
                        <el-form-item label="密码强度">
                            <el-checkbox-group v-model="formData.password_encrypt" size="small">
                                <el-checkbox label="0" border>
                                    数字
                                </el-checkbox>
                                <el-checkbox label="1" border>
                                    小写字母
                                </el-checkbox>
                                <el-checkbox label="2" border>
                                    大写字母
                                </el-checkbox>
                                <el-checkbox label="3" border>
                                    特殊字符
                                </el-checkbox>

                            </el-checkbox-group>
                        </el-form-item>

                    </el-tab-pane>
                    <el-tab-pane label="上传设置" name="2">
                        <el-form-item label="上传方式">
                            <el-radio-group v-model="formData.upload_method" size="small">
                                <el-radio label="oss" border>阿里oss</el-radio>
                                <el-radio label="local" border>本地上传</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="Bucket">
                            <el-input v-model="formData.upload_config.Bucket" />
                        </el-form-item>
                        <el-form-item label="ACCESS_KEY">
                            <el-input v-model="formData.upload_config.ACCESS_KEY" />
                        </el-form-item>
                        <el-form-item label="SECRET_KEY">
                            <el-input v-model="formData.upload_config.SECRET_KEY" />
                        </el-form-item>
                        <el-form-item label="域名">
                            <el-input v-model="formData.upload_config.http" />
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="API设置" name="3">
                        <el-form-item label="是否开启API安全">
                            <el-radio-group v-model="formData.api_safe" size="small">
                                <el-radio :label="1" border>是</el-radio>
                                <el-radio :label="0" border>否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="秘钥">
                            <el-input v-model="formData.api_secret" />
                        </el-form-item>
                    </el-tab-pane>

                </el-tabs>
                <el-button type="primary" @click="submitOk">保存</el-button>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { getSystemConfigFn, editSystemConfigFn } from '@/api/system.js'
import { ref, reactive } from 'vue'

//参数
const formData = reactive({
    "open_reg": 1, //开启注册，0关闭1开启
    "reg_method": "username", //注册方式，username普通phone手机
    "password_min": 5, //密码最小长度
    //注意由于checkbox绑定的是数组，默认修改成数组，最后转成字符串
    "password_encrypt": [0, 1], //密码复杂度，0数字、1小写字母、2大写字母、3符号；例如0,1,2
    "upload_method": "oss", //上传方式，local本地，oss对象存储
    "upload_config": {
        "Bucket": "",
        "ACCESS_KEY": "",
        "SECRET_KEY": "",
        "http": ""
    }, //上传配置 { Bucket:"", ACCESS_KEY:"", SECRET_KEY:"", http:""}
    "api_safe": 1, //api安全，0关闭1开启
    "api_secret": "", //秘钥
})


//获取系统设置
const getSystem = async () => {
    const res = await getSystemConfigFn()
    console.log(res)
    //res包含很多没有用的属性，使用for in 提取所需要的
    //因为要给formData重新赋值，所以 in formData
    for (const key in formData) {
        formData[key] = res.data[key]
    }
    formData.password_encrypt = formData.password_encrypt.split(',')

}

getSystem()

const activeName = ref('1')

//tabs事件
const handleClickTabs = (tab) => {
    console.log(tab.paneName)
    activeName.value = tab.paneName
}

//修改系统设置
const submitOk = async () => {
    //注意formData 多选要修改成字符串
    const res = await editSystemConfigFn({
        ...formData,
        password_encrypt:formData.password_encrypt.join(',')

    })
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    ElMessage({
        message: '设置成功',
        type: 'success',
    })
}



</script>

<style lang='less' scoped>
.el-card {
    margin-top: 20px;

    .el-tab-pane {

        width: 545px;
    }

}
</style>