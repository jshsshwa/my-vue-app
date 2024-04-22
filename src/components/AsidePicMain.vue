<!-- 图库列表 -->
<template>
    <el-main>
        <div class="cateList1">
            <el-row :gutter="20">
                <el-col :span="6" v-for="item in data.picListData" :key="item.id">
                    <el-card style="margin-top: 15px;position: relative;" shadow="hover"
                        :class="{ borderColor: item.checked == true }">
                        <el-image style="width: 100%; height: 150px" :src="item.url" fit="cover"
                            :preview-src-list="[item.url]" :initial-index="0" />
                        <div class="pic_title">{{ item.name }}</div>
                        <div class="pic_edit">
                            <el-checkbox v-if="isOpen" v-model="item.checked" size="large" style="margin-right: 12px;"
                                @change="selectImgHandle(item)" />
                            <span @click="openDialogVisibleEdit(item)">重命名</span>
                            <span @click="delPic(item.id)">删除</span>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="page1">
            <el-pagination v-model:current-page="queryData.page" v-model:page-size="queryData.limit"
                :page-sizes="[8, 16, 24, 32]" :small="small" :background="background"
                layout="total, sizes, prev, pager, next, jumper" :total=data.total @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
        <el-dialog v-model="data.dialogVisibleEdit" title="图片重命名" width="30%">
            <el-form :model="formPicName">
                <el-form-item>
                    <el-input v-model="formPicName.name" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.dialogVisibleEdit = false">取消</el-button>
                    <el-button type="primary" @click="editPicNameOk">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 上传图片对话框 -->
        <el-dialog v-model="dialogVisibleUpload" title="上传图片" width="40%">
            <UploadPic :data="{ image_class_id: queryData.id }" @success="handleUploadSuccess"></UploadPic>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleUpload = false">取消</el-button>
                    <el-button type="primary" @click="dialogVisibleUpload = false">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </el-main>
</template>

<script setup>
import UploadPic from '@/components/UploadPic.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPicsList, editPicNameFn, delPicFn } from '@/api/pics.js'
import { reactive, ref, computed } from 'vue'
//图库列表数据 实现思路
//1.根据API接口定义请求方法
//2.定义接口中所需要的参数
//3.定义方法调用API接口（由于当前页面无法获取图库分类ID不能在当前组件调用方法）
//4.定义获取父组件分类id的方法（暴露给父组件）

//5.在图库分类组件中使用 defineEmits向父组件传递 数据（将图库id传递给父组件）
//6.父组件监听 defineEmits传递的方法,获取id
//7.父组件调用 第4步 暴露出来的方法

//图片上传成功
// 上传成功
const handleUploadSuccess = ()=>getPics()

//定义api查询参数
const queryData = reactive({
    //图库id
    id: 0,
    //分页页码
    page: 1,
    //显示条数
    limit: 8
})

//定义数据源
const data = reactive({
    //图片列表
    picListData: [],
    //数据条数
    total: 0,
    //修改对话框
    dialogVisibleEdit: false,
})

//分页数据源
const small = ref('small')
const background = ref('background')


//选择分页页码
const handleCurrentChange = (val) => {
    queryData.page = val
    getPics()

}
//每页显示条数
const handleSizeChange = (val) => {
    queryData.limit = val
    getPics()
}

//获取图片列表数据
const getPics = async () => {
    const res = await getPicsList(queryData.id, queryData.page, queryData.limit)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    data.total = res.data.totalCount
    data.picListData = res.data.list.map(item => {
        item.checked = false
        return item
    })
    console.log(data.picListData)
}

//获取父分类组件id,调用getPics()方法
const getDataById = (id) => {
    queryData.id = id
    //调用API接口
    getPics()
}


//图片名称
const formPicName = reactive({
    name: '',
    id: 0
})

//打开重命名对话框
const openDialogVisibleEdit = (item) => {
    console.log(item)
    //为id和name重新赋值
    formPicName.name = item.name
    formPicName.id = item.id
    data.dialogVisibleEdit = true
}

//确定修改图片名称
const editPicNameOk = async () => {
    //调用api
    const res = await editPicNameFn(formPicName.id, formPicName.name)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    //获取最新数据
    getPics()
    //关闭对话框
    data.dialogVisibleEdit = false
}

//删除图片
const delPic = async (i) => {
    const isdel = await ElMessageBox.confirm(
        '是否删除图片?',
        '删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(err => err)

    if (isdel !== 'confirm') {
        return
    }
    //调用删除api
    const res = await delPicFn([i])
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    //获取最新数据
    getPics()
}

//上传图片
const dialogVisibleUpload = ref(false)
//定义打开弹框方法
const openDialogUpload = () => {
    dialogVisibleUpload.value = true
}

const props= defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    num:{
        type:Number,
        default:1
    
    }
})

//选中图片
const emit = defineEmits('selectImgData')
const checkedImg = computed(() => {
    return data.picListData.filter(item => item.checked)
})

const selectImgHandle = (item) => {
    if (item.checked && checkedImg.value.length > props.num) {
        item.checked = false
        return ElMessage.error(`只能选择${props.num}张`)
    }
    emit('selectImgData', checkedImg.value)
}
//重置选中数据
const resetCheck = () => {
    data.picListData = data.picListData.map(item => {
        item.checked = false
        return item
    })
}
//将数据传递给父组件

//共享getDataById方法,openDialogUpload方法
defineExpose({
    getDataById,
    openDialogUpload,
    resetCheck
})







</script>

<style lang='less' scoped>
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

    .picItem {
        width: 20%;
        height: auto;

    }

}

.page1 {
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
        color: #409EFF;
        cursor: pointer;
    }
}

.borderColor {
    border: 1px solid #409EFF;

}
</style>