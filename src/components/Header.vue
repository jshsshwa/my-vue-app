<!--  -->
<template>
    <div class="header">
        <!-- 左列 -->
        <span class="logo"> 商城後臺管理系統 </span>
        <el-icon class="icon" @click="setAsideWidthHandle">
            <Fold />
        </el-icon>
        <!-- 右列 -->
        <div class="f_right">
            <el-tooltip class="box-item" :enterable="false" effect="dark" content="刷新" placement="bottom" style="font-size: 30px">
                <el-icon class="icon">
                    <Refresh @click="refreshHandle" />
                </el-icon>
            </el-tooltip>

            <el-tooltip v-if="!isFullscreen" class="box-item" :enterable="false" effect="dark" content="全屏" placement="bottom">
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
                    <el-icon class="el-icon--right" style="margin-left: 10px">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="editPassword"> 修改密碼 </el-dropdown-item>
                        <el-dropdown-item command="logoutFn"> 登出 </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <!-- 修改密碼對話框 -->
        <el-dialog v-model="dialogEditPassword" title="修改密碼" width="40%">
            <el-form ref="ruleFormRefEdit" :model="ruleFormEdit" :rules="rulesEdit" label-width="80px">
                <el-form-item label="原密碼" prop="oldpassword">
                    <el-input v-model="ruleFormEdit.oldpassword" />
                </el-form-item>
                <el-form-item label="新密碼" prop="password">
                    <el-input v-model="ruleFormEdit.password" />
                </el-form-item>
                <el-form-item label="確認密碼" prop="repassword">
                    <el-input v-model="ruleFormEdit.repassword" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogEditPassword = false">取消</el-button>
                    <el-button type="primary" @click="editPasswordHandle"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
//導入修改密碼自定義模塊
import {useEditPassword} from '@/utils/UseEditPassword.js';

import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {ElMessageBox} from 'element-plus';

//全屏方法
import {useFullscreen} from '@vueuse/core';
const {isFullscreen, toggle} = useFullscreen();

//解構修改密碼屬性和方法
const {dialogEditPassword, ruleFormEdit, rulesEdit, ruleFormRefEdit, editPasswordHandle} = useEditPassword();

const store = useStore();
const router = useRouter();

//頁面刷新方法
const refreshHandle = () => {
    location.reload();
};

//下拉菜單事件
const commandHandle = (res) => {
    if (res == 'editPassword') {
        //打開修改密碼對話框
        dialogEditPassword.value = true;
    }
    if (res == 'logoutFn') {
        //登出
        logout();
    }
};

//退出方法
const logout = async () => {
    const res = await ElMessageBox.confirm('是否登出?', '注意', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
    }).catch((err) => {
        return err;
    });
    console.log(res);
    if (res == 'confirm') {
        //用戶點擊了確定
        //刪除本地token
        window.sessionStorage.removeItem('token');
        //刪除Vuex中的用戶信息
        store.commit('setUserInfo', {});
        //跳轉到登入頁面
        router.push({path: '/Login'});
    }
};

//控制左側導航菜單的展開和隱藏
const setAsideWidthHandle = () => {
    store.commit('setAsideWidth');
};
</script>

<style lang="less" scoped>
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
