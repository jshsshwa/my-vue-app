<!-- 圖庫模塊 -->
<template>
    <div>
        <el-card :style="{height: cardHeight + 'px'}">
            <el-container style="height: 100%">
                <el-header class="p_title">
                    <el-button type="primary" size="small" @click="dialogVisibleAddList">新增分類</el-button>
                    <el-button type="warning" size="small" @click="openUploadDialog">上傳圖片</el-button>
                </el-header>
                <el-container>
                    <AsidePicCate ref="picsCateRef" @edit="editCateList" @del="delCateList" @change="changeCateListId"></AsidePicCate>
                    <AsidePicMain ref="picMainRef"></AsidePicMain>
                </el-container>
            </el-container>
        </el-card>

        <!-- 新增圖庫對話框 -->
        <el-dialog v-model="dialogVisibleAddPics" :title="titleVal" width="40%" @close="closeDiaLog">
            <el-form ref="ruleFormRefAddPic" :model="ruleFormAddPic" :rules="rulesAddPic">
                <el-form-item label="分類名稱" prop="name">
                    <el-input v-model="ruleFormAddPic.name" />
                </el-form-item>
                <el-form-item label="分類排序" prop="order">
                    <!-- <el-input v-model="ruleFormAddPic.order" />
                     -->
                    <el-input-number v-model="ruleFormAddPic.order" @change="handleChangeNums" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddPics = false">取消</el-button>
                    <el-button type="primary" @click="addPicsCateListOk"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {ElMessageBox, ElMessage} from 'element-plus';
import {addPicsCateListFn, editPiscCateList, delCateListFn} from '@/api/pics.js';
import {ref, reactive} from 'vue';
import AsidePicCate from '@/components/AsidePicCate.vue';
import AsidePicMain from '@/components/AsidePicMain.vue';
const windowHeigth = window.innerHeight || document.body.clientHeight;
const cardHeight = windowHeigth - 170;
//是否顯示對話框
const dialogVisibleAddPics = ref(false);
//獲取Form表單DOM元素
const ruleFormRefAddPic = ref(null);
//Form數據源
const ruleFormAddPic = reactive({
    name: '',
    order: 10
});
//修改分類id
const id = ref(null);

//獲取picMainRef組件DOM元素
const picMainRef = ref(null);

//表單驗證規則
const rulesAddPic = reactive({
    name: [{required: true, message: '請輸入分類', trigger: 'blur'}],
    order: [{required: true, message: '請輸入排序', trigger: 'blur'}]
});
//修改排序
const handleChangeNums = (val) => {
    console.log(val);
    ruleFormAddPic.order = val;
};

//關閉對話框
const closeDiaLog = () => {
    //重置表單
    ruleFormRefAddPic.value.resetFields();
};

//獲取組件DOM實例
const picsCateRef = ref(null);

//對話框標題
const titleVal = ref('');

//打開新增對話框
const dialogVisibleAddList = () => {
    //數據初始化
    ruleFormAddPic.name = '';
    ruleFormAddPic.order = 10;
    titleVal.value = '新增圖庫分類';
    dialogVisibleAddPics.value = true;
};

//確定新增圖庫分類
const addPicsCateListOk = () => {
    //驗證規則是否通過？
    ruleFormRefAddPic.value.validate(async (isValid) => {
        if (!isValid) {
            return;
        }
        if (titleVal.value == '新增圖庫分類') {
            //調用api接口
            const res = await addPicsCateListFn(ruleFormAddPic);
            console.log(res);
            if (res.msg && res.msg !== 'ok') {
                return;
            }
            //關閉對話框
            dialogVisibleAddPics.value = false;
            //獲取最新數據(子組件方法)
            picsCateRef.value.getPicsCateData();
        } else if (titleVal.value == '修改圖庫分類') {
            const res = await editPiscCateList(id.value, ruleFormAddPic);
            console.log(res);
            if (res.msg && res.msg !== 'ok') {
                return;
            }
            //關閉對話框
            dialogVisibleAddPics.value = false;
            //獲取最新數據(子組件方法)
            picsCateRef.value.getPicsCateData();
        }
    });
};

//修改圖庫分類
const editCateList = (item) => {
    //修改對話框標題
    titleVal.value = '修改圖庫分類';
    //初始化數據源
    ruleFormAddPic.name = item.name;
    ruleFormAddPic.order = item.order;
    id.value = item.id;
    //打開對話框
    dialogVisibleAddPics.value = true;
};

//刪除圖庫分類
const delCateList = async (item) => {
    console.log(item);
    const isdel = await ElMessageBox.confirm('是否刪除圖庫分類?', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
    }).catch((err) => {
        return err;
    });
    if (isdel == 'confirm') {
        //調用刪除api
        const res = await delCateListFn(item.id);
        console.log(res);
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg);
        }
        //獲取最新數據(子組件方法)
        picsCateRef.value.getPicsCateData();
    }
};

//獲取子組件傳遞的分類id
const changeCateListId = (i) => {
    console.log(i);
    picMainRef.value.getDataById(i);
};

//打上傳圖片開對話框
const openUploadDialog = () => {
    //調用子組件方法
    picMainRef.value.openDialogUpload();
};
</script>

<style lang="less" scoped>
.el-card {
    margin-top: 20px;
    padding-top: 0px !important;
}

:deep(.el-card__body) {
    padding-top: 0px !important;
    height: 100%;
}

.p_title {
    border-bottom: 1px solid #dbdbdb;
    display: flex;
    align-items: center;
}
</style>
