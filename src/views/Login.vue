<!--  -->
<template>
    <div style="height: 100%">
        <el-row style="height: 100%; background: #1aa094">
            <el-col :lg="16" :md="12" class="col_left">
                <h1>Vite + Vue3商城管理系統</h1>
                <span>技術支援</span>
                <el-link href="https://github.com/jshsshwa/my-vue-app" target="_blank"> GitHub1 </el-link>
            </el-col>
            <el-col :lg="8" :md="12" class="col_right">
                <h1>登入</h1>
                <el-form class="login-form" ref="ruleFormRefLogin" :model="ruleFormLogin" :rules="rulesLogin">
                    <el-form-item prop="username">
                        <el-input placeholder="帳號" v-model="ruleFormLogin.username">
                            <template #prefix>
                                <el-icon>
                                    <UserFilled />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input placeholder="密碼" v-model="ruleFormLogin.password">
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <el-icon>
                                        <Lock />
                                    </el-icon>
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="loginHandle" :loading="loading">登入</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import {ElMessage} from 'element-plus';
//結構getUserInfoFn方法
import {loginFn} from '@/api/login';
import {ref, reactive, onMounted, onBeforeMount} from 'vue';
import {useRouter} from 'vue-router';
//結構useStore方法
import {useStore} from 'vuex';

//獲取倉庫實例
const store = useStore();
const router = useRouter();

//定義loading
const loading = ref(false);

//定義用戶名和密碼數據源
const ruleFormLogin = reactive({
    username: '',
    password: ''
});
//定義用戶名和密碼的驗證規則
const rulesLogin = {
    username: [
        {required: true, message: '請輸入用戶名', trigger: 'blur'},
        {min: 5, max: 15, message: '長度應為5到15位之間', trigger: 'blur'}
    ],
    password: [
        {required: true, message: '請輸入密碼', trigger: 'blur'},
        {min: 5, max: 15, message: '長度應為5到15位之間', trigger: 'blur'}
    ]
};

//獲取el-form表單DOM元素
const ruleFormRefLogin = ref(null);
//登錄
const loginHandle = () => {
    //校驗整個form表單
    ruleFormRefLogin.value.validate(async (isValid) => {
        try {
            if (!isValid) {
                return;
            }
            //表單驗證通過，開始調用接口，將loading狀態設置為true
            loading.value = true;
            //...下一步
            const res = await loginFn(ruleFormLogin);
            console.log(res);
            if (!res.data || res.data.status !== 200) {
                //登錄失敗提示
                return ElMessage.error(res.msg);
            }

            //登錄成功提示
            ElMessage({
                message: '登錄成功',
                type: 'success'
            });
            //token本地存儲
            window.sessionStorage.setItem('token', res.data.token);
            //調用getUserInfoFn()
            // const res2 = await getUserInfoFn()
            // console.log(res2)
            // if (!res2.data || res2.data.status !== 200) {
            //     //獲取管理員信息失敗
            //     return ElMessage.error('獲取管理員信息失敗')
            // }
            // //獲取管理員信息成功
            // store.commit('setUserInfo',res2.data)
            //跳轉到後臺首頁
            router.push('/home');
        } catch (err) {
            console.log(err);
        } finally {
            loading.value = false;
        }
    });
};

//監聽回車
function onKeyUp(e) {
    //console.log(e);
    if (e.key == 'Enter') loginHandle();
}
onMounted(() => {
    //添加鍵盤監聽事件
    document.addEventListener('keyup', onKeyUp);
});
onBeforeMount(() => {
    //移除鍵盤監聽
    document.removeEventListener('keyup', onKeyUp);
});
</script>

<style lang="less" scoped>
.col_left {
    color: #fff;
    display: flex;
    // 垂直居中
    align-items: center;
    //水平居中
    justify-content: center;
    //flex方向修改成垂直方向
    flex-direction: column;
}

.col_right {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .login-form {
        width: 240px;
    }
}

.el-button {
    width: 240px;
    background: #1aa094;
}
</style>
