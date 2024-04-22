<!-- 公告管理 -->
<template>
    <div>
        <el-card>
            <div>
                <el-button type="primary" size="small" @click="oppenAddDiaLog">新增</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="create_time" label="发布时间" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <div>
                            <el-button type="primary" :icon="Edit" size="small" @click="editNews(scope.row)" />
                            <el-button type="warning" :icon="Delete" size="small" @click="delNewsById(scope.row.id)" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 新增公告 -->
        <el-dialog v-model="dialogVisibleAddNews" :title="newsTitle" width="40%" @close="closeAdd">
            <el-form ref="ruleFormRefAddNews" :model="ruleFormAddNews" :rules="rulesAddNews">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="ruleFormAddNews.title" />
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" :rows="2" v-model="ruleFormAddNews.content" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddNews = false">取消</el-button>
                    <el-button type="primary" @click="addNewsOk">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { getNewsList, addNewsFn, editNewsFn, delNews } from '@/api/News.js'
import { ref, reactive } from 'vue'
//图标
const Edit = ref('Edit')
const Delete = ref('Delete')
//分页
const currentPage = ref(1)
//总条数
const total = ref(0)

//公告弹框
const dialogVisibleAddNews = ref(false)
//Form表单DOM
const ruleFormRefAddNews = ref(null)
//数据源对象
const ruleFormAddNews = reactive({
    title: '',
    content: ''
})
//公告id
const newsId = ref(0)
//验证规则对象
const rulesAddNews = reactive({
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' }

    ],
    content: [
        { required: true, message: '请输入内容', trigger: 'blur' }

    ]
})


const loading = ref(false)

//表格数据源
const tableData = ref([])
//调用api获取数据源
const getData = async () => {
    loading.value = true
    const res = await getNewsList(currentPage.value)
    loading.value = false
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return
    }
    tableData.value = res.data.list
    total.value = res.data.totalCount

}
getData()

//对话框标题
const newsTitle = ref('')

//新增对话框
const oppenAddDiaLog = () => {
    newsTitle.value = '新增公告'
    ruleFormAddNews.title = ''
    ruleFormAddNews.content = ''
    dialogVisibleAddNews.value = true
}

//确定新增
const addNewsOk = () => {
    //校验数据是否合法
    ruleFormRefAddNews.value.validate(async isValid => {
        if (!isValid) {
            return
        }
        if (newsTitle.value == '新增公告') {
            //调用新增api
            const res = await addNewsFn(ruleFormAddNews)
            console.log(res)
            if (res.msg && res.msg !== 'ok') {
                return
            }
            dialogVisibleAddNews.value = false
            getData()
        } else if (newsTitle.value == '编辑公告') {
            const res = await editNewsFn(newsId.value, ruleFormAddNews)
            if (res.msg && res.msg !== 'ok') {
                return
            }
            dialogVisibleAddNews.value = false
            getData()
        }
    })
}

//关闭对话框
const closeAdd = () => {
    ruleFormRefAddNews.value.resetFields()
}

//编辑
const editNews = (row) => {
    console.log(row)
    newsTitle.value = '编辑公告'
    //数据初始化
    ruleFormAddNews.title = row.title
    ruleFormAddNews.content = row.content
    newsId.value = row.id
    dialogVisibleAddNews.value = true
}

//删除
const delNewsById = async (id) => {
    const isdel = await ElMessageBox.confirm(
        '是否删除?',
        '删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(err => err)
    console.log(isdel)
    if (isdel !== 'confirm') {
        return
    }
    const res = await delNews(id)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    getData()
}


</script>

<style lang='less' scoped>
.el-card {
    margin-top: 20px;
    .el-table {
        margin-top: 10px
    }
}
</style>