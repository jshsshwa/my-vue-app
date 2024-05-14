<!-- 圖庫列表 -->
<template>
    <el-main>
        <div class="cateList1">
            <el-row :gutter="20">
                <el-col :span="6" v-for="item in data.picListData" :key="item.id">
                    <el-card style="margin-top: 15px; position: relative" shadow="hover" :class="{borderColor: item.checked == true}">
                        <el-image
                            style="width: 100%; height: 150px"
                            :src="item.url"
                            fit="cover"
                            :preview-src-list="[item.url]"
                            :initial-index="0"
                        />
                        <div class="pic_title">{{ item.name }}</div>
                        <div class="pic_edit">
                            <el-checkbox
                                v-if="isOpen"
                                v-model="item.checked"
                                size="large"
                                style="margin-right: 12px"
                                @change="selectImgHandle(item)"
                            />
                            <span @click="openDialogVisibleEdit(item)">重命名</span>
                            <span @click="delPic(item.id)">刪除</span>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="pager">
            <el-pagination
                v-model:current-page="queryData.page"
                v-model:page-size="queryData.limit"
                :page-sizes="[8, 16, 24, 32]"
                :small="small"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="data.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
        <el-dialog v-model="data.dialogVisibleEdit" title="圖片重命名" width="30%">
            <el-form :model="formPicName">
                <el-form-item>
                    <el-input v-model="formPicName.name" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.dialogVisibleEdit = false">取消</el-button>
                    <el-button type="primary" @click="editPicNameOk"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 上傳圖片對話框 -->
        <el-dialog v-model="dialogVisibleUpload" title="上傳圖片" width="40%">
            <UploadPic :data="{image_class_id: queryData.id}" @success="handleUploadSuccess"></UploadPic>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleUpload = false">取消</el-button>
                    <el-button type="primary" @click="dialogVisibleUpload = false"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>
    </el-main>
</template>

<script setup>
import UploadPic from '@/components/UploadPic.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {getPicsList, editPicNameFn, delPicFn} from '@/api/pics.js';
import {reactive, ref, computed} from 'vue';
//圖庫列表數據 實現思路
//1.根據API接口定義請求方法
//2.定義接口中所需要的參數
//3.定義方法調用API接口（由於當前頁面無法獲取圖庫分類ID不能在當前組件調用方法）
//4.定義獲取父組件分類id的方法（暴露給父組件）

//5.在圖庫分類組件中使用 defineEmits向父組件傳遞 數據（將圖庫id傳遞給父組件）
//6.父組件監聽 defineEmits傳遞的方法,獲取id
//7.父組件調用 第4步 暴露出來的方法

//圖片上傳成功
// 上傳成功
const handleUploadSuccess = () => getPics();

//定義api查詢參數
const queryData = reactive({
    //圖庫id
    id: 0,
    //分頁頁碼
    page: 1,
    //顯示條數
    limit: 8
});

//定義數據源
const data = reactive({
    //圖片列表
    picListData: [],
    //數據條數
    total: 0,
    //修改對話框
    dialogVisibleEdit: false
});

//分頁數據源
const small = ref('small');
const background = ref('background');

//選擇分頁頁碼
const handleCurrentChange = (val) => {
    queryData.page = val;
    getPics();
};
//每頁顯示條數
const handleSizeChange = (val) => {
    queryData.limit = val;
    getPics();
};

//獲取圖片列表數據
const getPics = async () => {
    const res = await getPicsList(queryData.id, queryData.page, queryData.limit);
    console.log('圖片列表數據', res);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    data.total = res.data.totalCount;
    data.picListData = res.data.list.map((item) => {
        item.checked = false;
        return item;
    });
    //console.log(data.picListData);
};

//獲取父分類組件id,調用getPics()方法
const getDataById = (id) => {
    queryData.id = id;
    //調用API接口
    getPics();
};

//圖片名稱
const formPicName = reactive({
    name: '',
    id: 0
});

//打開重命名對話框
const openDialogVisibleEdit = (item) => {
    console.log('重命名對話框', item);
    //為id和name重新賦值
    formPicName.name = item.name;
    formPicName.id = item.id;
    data.dialogVisibleEdit = true;
};

//確定修改圖片名稱
const editPicNameOk = async () => {
    //調用api
    const res = await editPicNameFn(formPicName.id, formPicName.name);
    console.log('修改圖片名稱結果', res);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    //獲取最新數據
    getPics();
    //關閉對話框
    data.dialogVisibleEdit = false;
};

//刪除圖片
const delPic = async (i) => {
    const isdel = await ElMessageBox.confirm('是否刪除圖片?', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
    }).catch((err) => err);

    if (isdel !== 'confirm') {
        return;
    }
    //調用刪除api
    const res = await delPicFn([i]);
    console.log('刪除圖片結果', res);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    //獲取最新數據
    getPics();
};

//上傳圖片
const dialogVisibleUpload = ref(false);
//定義打開彈框方法
const openDialogUpload = () => {
    dialogVisibleUpload.value = true;
};

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    num: {
        type: Number,
        default: 1
    }
});

//選中圖片
const emit = defineEmits(['selectImgData']);
const checkedImg = computed(() => data.picListData.filter((item) => item.checked));

const selectImgHandle = (item) => {
    if (item.checked && checkedImg.value.length > props.num) {
        item.checked = false;
        return ElMessage.error(`只能選擇${props.num}張`);
    }
    emit('selectImgData', checkedImg.value);
};
//重置選中數據
const resetCheck = () => {
    data.picListData = data.picListData.map((item) => {
        item.checked = false;
        return item;
    });
};

//將數據傳遞給父組件
//共享getDataById方法,openDialogUpload方法
defineExpose({
    getDataById,
    openDialogUpload,
    resetCheck
});
</script>

<style lang="less" scoped>
.el-main {
    height: 100%;
    position: relative;
}

.cateList1 {
    position: absolute;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 50px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 15px;
    padding-top: 0px;
    box-sizing: border-box;

    // .picItem {
    //     width: 20%;
    //     height: auto;
    // }
}

.pager {
    position: absolute;
    right: 0px;
    left: 0px;
    bottom: 0px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.el-card__body) {
    padding: 0px !important;
}

.pic_title {
    text-align: center;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #000;
    color: #fff;
    position: absolute;
    bottom: 38px;
    opacity: 0.7;
    overflow: hidden;
}

.pic_edit {
    text-align: center;
    height: 30px;
    line-height: 30px;
    padding-bottom: 5px;

    span {
        padding-right: 15px;
        color: #409eff;
        cursor: pointer;
    }
}

.borderColor {
    border: 1px solid #409eff;
}
</style>
