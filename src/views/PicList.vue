<!-- 图库模块 -->
<template>
    <div>
        <el-card :style="{ height: cardHeight + 'px' }">
            <el-container style="height: 100%;">
                <el-header class="p_title">
                    <el-button type="primary" size="small" @click="dialogVisibleAddList">新增分类</el-button>
                    <el-button type="warning" size="small" @click="openUploadDialog">上传图片</el-button>
                </el-header>
                <el-container>
                    <AsidePicCate ref="picsCateRef" @edit="editCateList" @del="delCateList" @change="changeCateListId"></AsidePicCate>
                    <AsidePicMain ref="picMainRef"></AsidePicMain>
                </el-container>
            </el-container>
        </el-card>

        <!-- 新增图库对话框 -->
        <el-dialog v-model="dialogVisibleAddPics" :title="titleVal" width="40%" @close="closeDiaLog">
            <el-form ref="ruleFormRefAddPic" :model="ruleFormAddPic" :rules="rulesAddPic">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="ruleFormAddPic.name" />
                </el-form-item>
                <el-form-item label="分类排序" prop="order">
                    <!-- <el-input v-model="ruleFormAddPic.order" />
                     -->
                    <el-input-number v-model="ruleFormAddPic.order" @change="handleChangeNums" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddPics = false">取消</el-button>
                    <el-button type="primary" @click="addPicsCateListOk">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>


    </div>
</template>

<script setup>
import { ElMessageBox ,ElMessage } from 'element-plus'
import { addPicsCateListFn, editPiscCateList, delCateListFn } from '@/api/pics.js'
import { ref, reactive } from 'vue'
import AsidePicCate from '@/components/AsidePicCate.vue'
import AsidePicMain from '@/components/AsidePicMain.vue'
const windowHeigth = window.innerHeight || document.body.clientHeight
const cardHeight = windowHeigth - 170
//是否显示对话框
const dialogVisibleAddPics = ref(false)
//获取Form表单DOM元素
const ruleFormRefAddPic = ref(null)
//Form数据源
const ruleFormAddPic = reactive({
    name: '',
    order: 10
})
//修改分类id
const id = ref(null)

//获取picMainRef组件DOM元素
const picMainRef=ref(null)

//表单验证规则
const rulesAddPic = reactive({
    name: [
        { required: true, message: '请输入分类', trigger: 'blur' }

    ],
    order: [
        { required: true, message: '请输入排序', trigger: 'blur' }

    ]
})
//修改排序
const handleChangeNums = (val) => {
    console.log(val)
    ruleFormAddPic.order = val
}

//关闭对话框
const closeDiaLog = () => {
    //重置表单
    ruleFormRefAddPic.value.resetFields()
}

//获取组件DOM实例
const picsCateRef = ref(null)

//对话框标题
const titleVal = ref('')

//打开新增对话框
const dialogVisibleAddList = () => {
    //数据初始化
    ruleFormAddPic.name = ""
    ruleFormAddPic.order = 10
    titleVal.value = '新增图库分类'
    dialogVisibleAddPics.value = true
}

//确定新增图库分类
const addPicsCateListOk = () => {
    //验证规则是否通过？
    ruleFormRefAddPic.value.validate(async isValid => {
        if (!isValid) {
            return
        }
        if (titleVal.value == '新增图库分类') {
            //调用api接口
            const res = await addPicsCateListFn(ruleFormAddPic)
            console.log(res)
            if (res.msg && res.msg !== 'ok') {
                return
            }
            //关闭对话框
            dialogVisibleAddPics.value = false
            //获取最新数据(子组件方法)
            picsCateRef.value.getPicsCateData()
        } else if (titleVal.value == '修改图库分类') {            
            const res = await editPiscCateList(id.value, ruleFormAddPic)
            console.log(res)
            if (res.msg && res.msg !== 'ok') {
                return
            }
            //关闭对话框
            dialogVisibleAddPics.value = false
            //获取最新数据(子组件方法)
            picsCateRef.value.getPicsCateData()
        }
    })
}

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
            return  ElMessage.error(res.msg)
        }
        //获取最新数据(子组件方法)
        picsCateRef.value.getPicsCateData()
    }
}

//获取子组件传递的分类id
const changeCateListId=(i)=>{
    console.log(i)
    picMainRef.value.getDataById(i)
}

//打上传图片开对话框
const openUploadDialog=()=>{
    //调用子组件方法
    picMainRef.value.openDialogUpload()
}



</script>

<style lang='less' scoped>
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