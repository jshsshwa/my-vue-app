<!-- 选择头像 -->
<template>
    <div class="image">
        <!-- 如果modelValue的值存在，渲染图片 -->
        <div v-if="modelValue && isShow">
            <el-image v-if="typeof modelValue == 'string'" class="avatar" :src="modelValue" fit="cover" />
            <div v-else>
                <!-- 如果v-model的值是数组 -->
                <div class="picContainer" v-for="(item, i) in modelValue" :key="i">
                    <span @click="removeImg(item)">X</span>
                    <el-image class="avatar1" :src="item" fit="cover" />
                </div>
            </div>
        </div>

        <el-icon v-if="isShow" @click="dialogVisible = true">
            <Plus />
        </el-icon>

        <el-dialog v-model="dialogVisible" title="选择图库" width="80%" top="2vh" @close="dialogClose">
            <el-card style="height: 490px;padding-top:20px !important;padding-bottom: 20px !important;">
                <el-container style="height: 100%;">
                    <el-container>
                        <AsidePicCate ref="picsCateRef" @edit="editCateList" @del="delCateList" @change="changeCateListId">
                        </AsidePicCate>
                        <AsidePicMain :num="num" ref="picMainRef" @selectImgData="selectImgDataHandle" isOpen>
                        </AsidePicMain>
                    </el-container>
                </el-container>
            </el-card>


            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitOk">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { delCateListFn } from '@/api/pics.js'
import { ref, reactive } from 'vue'
import AsidePicCate from '@/components/AsidePicCate.vue'
import AsidePicMain from '@/components/AsidePicMain.vue'


const dialogVisible = ref(false)

// const open = () => {
//     dialogVisible.value = true
// }

const callbackFunction = ref(null)
const open = (callback = null)=>{
    callbackFunction.value = callback
    dialogVisible.value = true
}

// ================================

//是否显示对话框
const dialogVisibleAddPics = ref(false)

//Form数据源
const ruleFormAddPic = reactive({
    name: '',
    order: 10
})
//修改分类id
const id = ref(null)

//获取picMainRef组件DOM元素
const picMainRef = ref(null)

//获取组件DOM实例
const picsCateRef = ref(null)

//对话框标题
const titleVal = ref('')





//修改图库分类
const editCateList = (item) => {
    //修改对话框标题
    titleVal.value = '修改图库分类'
    //初始化数据源
    ruleFormAddPic.name = item.name
    ruleFormAddPic.order = item.order
    id.value = item.id
    //打开对话框
    dialogVisibleAddPics.value = true
}

//删除图库分类
const delCateList = async (item) => {
    console.log(item)
    const isdel = await ElMessageBox.confirm(
        '是否删除图库分类?',
        '删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(err => {
        return err
    })
    if (isdel == 'confirm') {
        //调用删除api
        const res = await delCateListFn(item.id)
        console.log(res)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        //获取最新数据(子组件方法)
        picsCateRef.value.getPicsCateData()
    }
}

//获取子组件传递的分类id
const changeCateListId = (i) => {
    console.log(i)
    picMainRef.value.getDataById(i)
}



//获取子组件传过来的值（选择图片）
//通过defindProps接收父组件传递的值
const props = defineProps({
    modelValue: [String, Array],
    num: {
        type: Number,
        default: 1
    },
    isShow: {
        type: Boolean,
        default: true
    }
})
//作为子组件向Mansger.vue组件传值
//这样就可以实现v-model功能？
const emit = defineEmits(["update:modelValue"])

let urls = []
const selectImgDataHandle = (i) => {
    //i就是选中的图片
    console.log(i)
    urls = i.map(item => item.url)
}

//确认选择
const submitOk = () => {
    //多图
    let value = []
    if (props.num == 1) {
        value = urls[0]
    } else {
        value = props.isShow ? [...props.modelValue, ...urls] : [...urls]
        if (value.length > props.num) {
            return ElMessage.error(`最多上传${props.num}张图片`)
        }
    }
    //修改父组件v-model的值
    if (value&&props.isShow) {
        emit("update:modelValue", value)
    }
    if(!props.isShow && typeof callbackFunction.value === "function"){
        callbackFunction.value(value)
    }
    //关闭对话框
    dialogVisible.value = false
}

//关闭
const dialogClose = () => {
    picMainRef.value.resetCheck()
}

//移除图片
const removeImg = (url) => {
    console.log(url)
    // props.modelValue.filter(item=>item!=url)
    emit("update:modelValue", props.modelValue.filter(item => item != url))

}

defineExpose({
    open
})

</script>

<style lang='less' scoped>
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