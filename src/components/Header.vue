<!--  -->
<template>
    <div class="header">
        <!-- 左列 -->
        <span class="logo">
            商城后台管理系统
        </span>
        <el-icon class="icon" @click="setAsideWidthHandle">
            <Fold />
        </el-icon>
        <!-- 右列 -->
        <div class="f_right">
            <el-tooltip class="box-item" :enterable="false" effect="dark" content="刷新" placement="bottom">
                <el-icon class="icon">
                    <Refresh @click="refreshHandle" />
                </el-icon>
            </el-tooltip>

            <el-tooltip v-if="!isFullscreen" class="box-item" :enterable="false" effect="dark" content="全屏"
                placement="bottom">
                <el-icon class="icon">
                    <FullScreen @click="toggle" />
                </el-icon>
            </el-tooltip>

            <el-tooltip v-else class="box-item" :enterable="false" effect="dark" content="退出全屏" placement="bottom">
                <el-icon class="icon">
                    <SwitchButton @click="toggle" />
                </el-icon>
            </el-tooltip>


            <el-dropdown @command="commandHandle">
                <span>
                    <el-avatar :size="30" :src="$store.state.userInfo.avatar" />
                    {{ $store.state.userInfo.username }}
                    <el-icon class="el-icon--right" style="margin-left:10px">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="editPassword">
                            修改密码
                        </el-dropdown-item>
                        <el-dropdown-item command="logoutFn">
                            退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <!-- 修改密码对话框 -->
        <el-dialog v-model="dialogEditPassword" title="修改密码" width="40%">
            <el-form ref="ruleFormRefEdit" :model="ruleFormEdit" :rules="rulesEdit" label-width="80px">
                <el-form-item label="原密码" prop="oldpassword">
                    <el-input v-model="ruleFormEdit.oldpassword" />
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input v-model="ruleFormEdit.password" />
                </el-form-item>
                <el-form-item label="确认密码" prop="repassword">
                    <el-input v-model="ruleFormEdit.repassword" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogEditPassword = false">取消</el-button>
                    <el-button type="primary" @click="editPasswordHandle">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>

</template>

<script setup>
//导入修改密码自定义模块
import { useEditPassword } from '@/utils/UseEditPassword.js'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessageBox } from 'element-plus'

//全屏方法
import { useFullscreen } from '@vueuse/core'
const { isFullscreen, toggle } = useFullscreen()

//解构修改密码属性和方法
const {
    dialogEditPassword,
    ruleFormEdit,
    rulesEdit,
    ruleFormRefEdit,
    editPasswordHandle
} = useEditPassword()

const store = useStore()
const router = useRouter()

//页面刷新方法
const refreshHandle = () => {
    location.reload()
}


//下拉菜单事件
const commandHandle = (res) => {
    if (res == 'editPassword') {
        //打开修改密码对话框
        dialogEditPassword.value = true
    }
    if (res == 'logoutFn') {
        //退出登录   
        logout()
    }
}

//退出方法
const logout = async () => {
    const res = await ElMessageBox.confirm(
        '是否退出登录?',
        '注意',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(err => {
        return err
    })
    console.log(res)
    if (res == 'confirm') {
        //用户点击了确定
        //删除本地token
        window.sessionStorage.removeItem('token')
        //删除Vuex中的用户信息
        store.commit('setUserInfo', {})
        //跳转到登录页面
        router.push({ path: "/Login" });
    }
}

//控制左侧导航菜单的展开和隐藏
const setAsideWidthHandle = () => {
    store.commit('setAsideWidth')
}



</script>

<style lang='less' scoped>
.header {
    height: 100%;
    display: flex;
    color: #fff;
    align-items: center;

    .f_right {
        margin-left: auto;
        display: flex;
        align-items: center;
        height: 100%;
        padding-right: 20px;

        .el-dropdown {
            margin-left: 20px;
            color: #fff;
            cursor: pointer;

            span {
                display: flex;
                align-items: center;

                .el-avatar {
                    margin-right: 10px;
                }
            }
        }
    }

    .logo {
        font-size: 18px;
        padding-right: 16px;
    }

    .icon {
        width: 30px;
        height: 100%;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
    }

    .icon:hover {
        background: #065327;
    }

}
</style>