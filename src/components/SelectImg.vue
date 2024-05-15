<!-- 選擇頭像 -->
<template>
    <div class="image">
        <!-- 如果modelValue的值存在，渲染圖片 -->
        <div v-if="modelValue && isShow">
            <el-image v-if="typeof modelValue == 'string'" class="avatar" :src="modelValue" fit="cover" />
            <div v-else>
                <!-- 如果v-model的值是數組 -->
                <div class="picContainer" v-for="(item, i) in modelValue" :key="i">
                    <span @click="removeImg(item)">X</span>
                    <el-image class="avatar1" :src="item" fit="cover" />
                </div>
            </div>
        </div>

        <el-icon v-if="isShow" @click="dialogVisible = true">
            <Plus />
        </el-icon>

        <el-dialog v-model="dialogVisible" title="選擇圖庫" width="80%" top="2vh" @close="dialogClose">
            <el-card style="height: 490px; padding-top: 20px !important; padding-bottom: 20px !important">
                <el-container style="height: 100%">
                    <el-container>
                        <AsidePicCate ref="picsCateRef" @edit="editCateList" @del="delCateList" @change="changeCateListId"> </AsidePicCate>
                        <AsidePicMain :num="num" ref="picMainRef" @selectImgData="selectImgDataHandle" isOpen> </AsidePicMain>
                    </el-container>
                </el-container>
            </el-card>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitOk"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {ElMessageBox, ElMessage} from 'element-plus';
import {delCateListFn} from '@/api/pics.js';
import {ref, reactive} from 'vue';
import AsidePicCate from '@/components/AsidePicCate.vue';
import AsidePicMain from '@/components/AsidePicMain.vue';

const dialogVisible = ref(false);

// const open = () => {
//     dialogVisible.value = true
// }

const callbackFunction = ref(null);
const open = (callback = null) => {
    callbackFunction.value = callback;
    dialogVisible.value = true;
};

// ================================

//是否顯示對話框
const dialogVisibleAddPics = ref(false);

//Form數據源
const ruleFormAddPic = reactive({
    name: '',
    order: 10
});
//修改分類id
const id = ref(null);

//獲取picMainRef組件DOM元素
const picMainRef = ref(null);

//獲取組件DOM實例
const picsCateRef = ref(null);

//對話框標題
const titleVal = ref('');

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

//與父組建雙向綁定(v-model='modelValue')
const modelValue = defineModel();

//獲取子組件傳過來的值（選擇圖片）
//通過defindProps接收父組件傳遞的值
const props = defineProps({
    //modelValue: [String, Array],
    num: {
        type: Number,
        default: 1
    },
    isShow: {
        type: Boolean,
        default: true
    }
});

let urls = [];
const selectImgDataHandle = (i) => {
    //i就是選中的圖片
    console.log(i);
    urls = i.map((item) => item.url);
};

//確認選擇
const submitOk = () => {
    //多圖
    // console.log('props.num', props.num);
    // console.log('props.isShow', props.isShow);
    let value = [];
    if (props.num == 1) {
        value = urls[0];
    } else {
        //value = props.isShow ? [...props.modelValue, ...urls] : [...urls];
        value = props.isShow ? [modelValue.value, ...urls] : [...urls];
        if (value.length > props.num) {
            return ElMessage.error(`最多上傳${props.num}張圖片`);
        }
    }
    //修改父組件v-model的值
    if (value && props.isShow) {
        modelValue.value = value;
    }
    if (!props.isShow && typeof callbackFunction.value === 'function') {
        callbackFunction.value(value);
    }
    //關閉對話框
    dialogVisible.value = false;
};

//關閉
const dialogClose = () => {
    picMainRef.value.resetCheck();
};

//移除圖片
const removeImg = (url) => {
    console.log('移除圖片', url);

    modelValue.value.filter((item) => item != url);
};

defineExpose({
    open
});
</script>

<style lang="less" scoped>
.image {
    width: 100%;
    display: flex;

    .el-icon {
        font-size: 30px;
        display: block;
        border: 1px solid #dbdbdb;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 105px;
        box-sizing: border-box;
        cursor: pointer;
    }

    .avatar {
        width: 100px;
        height: 100px;
        margin-right: 15px;
    }
}

.avatar1 {
    width: 100px;
    height: 100px;
}

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

:deep(.el-dialog__body) {
    padding-top: 0px;
    padding-bottom: 7px;
}

:deep(.el-dialog__header) {
    padding-bottom: 0px;
}

.picContainer {
    width: 100px;
    height: 100px;
    margin-right: 15px;

    float: left;
    margin-bottom: 15px;
    position: relative;

    span {
        width: 22px;
        height: 22px;
        border-radius: 22px;
        display: block;
        line-height: 22px;
        text-align: center;
        right: 5px;
        top: 5px;
        position: absolute;
        cursor: pointer;
        z-index: 1;
        background: #333;
        color: #fff;
    }

    span:hover {
        opacity: 0.7;
    }
}
</style>
