<!-- 公告管理 -->
<template>
    <div>
        <el-card>
            <div>
                <el-button type="primary" size="small" @click="oppenAddDiaLog">新增</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
                <el-table-column prop="title" label="標題" />
                <el-table-column prop="create_time" label="發佈時間" />
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
                <el-form-item label="標題" prop="title">
                    <el-input v-model="ruleFormAddNews.title" />
                </el-form-item>
                <el-form-item label="內容" prop="content">
                    <el-input type="textarea" :rows="2" v-model="ruleFormAddNews.content" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddNews = false">取消</el-button>
                    <el-button type="primary" @click="addNewsOk"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {ElMessage, ElMessageBox} from 'element-plus';
import {getNewsList, addNewsFn, editNewsFn, delNews} from '@/api/News.js';
import {ref, reactive} from 'vue';
//圖標
const Edit = ref('Edit');
const Delete = ref('Delete');
//分頁
const currentPage = ref(1);
//總條數
const total = ref(0);

//公告彈框
const dialogVisibleAddNews = ref(false);
//Form表單DOM
const ruleFormRefAddNews = ref(null);
//數據源對象
const ruleFormAddNews = reactive({
    title: '',
    content: ''
});
//公告id
const newsId = ref(0);
//驗證規則對象
const rulesAddNews = reactive({
    title: [{required: true, message: '請輸入標題', trigger: 'blur'}],
    content: [{required: true, message: '請輸入內容', trigger: 'blur'}]
});

const loading = ref(false);

//表格數據源
const tableData = ref([]);
//調用api獲取數據源
const getData = async () => {
    loading.value = true;
    const res = await getNewsList(currentPage.value);
    loading.value = false;
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return;
    }
    tableData.value = res.data.list;
    total.value = res.data.totalCount;
};
getData();

//對話框標題
const newsTitle = ref('');

//新增對話框
const oppenAddDiaLog = () => {
    newsTitle.value = '新增公告';
    ruleFormAddNews.title = '';
    ruleFormAddNews.content = '';
    dialogVisibleAddNews.value = true;
};

//確定新增
const addNewsOk = () => {
    //校驗數據是否合法
    ruleFormRefAddNews.value.validate(async (isValid) => {
        if (!isValid) {
            return;
        }
        if (newsTitle.value == '新增公告') {
            //調用新增api
            const res = await addNewsFn(ruleFormAddNews);
            console.log(res);
            if (res.msg && res.msg !== 'ok') {
                return;
            }
            dialogVisibleAddNews.value = false;
            getData();
        } else if (newsTitle.value == '編輯公告') {
            const res = await editNewsFn(newsId.value, ruleFormAddNews);
            if (res.msg && res.msg !== 'ok') {
                return;
            }
            dialogVisibleAddNews.value = false;
            getData();
        }
    });
};

//關閉對話框
const closeAdd = () => {
    ruleFormRefAddNews.value.resetFields();
};

//編輯
const editNews = (row) => {
    console.log(row);
    newsTitle.value = '編輯公告';
    //數據初始化
    ruleFormAddNews.title = row.title;
    ruleFormAddNews.content = row.content;
    newsId.value = row.id;
    dialogVisibleAddNews.value = true;
};

//刪除
const delNewsById = async (id) => {
    const isdel = await ElMessageBox.confirm('是否刪除?', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
    }).catch((err) => err);
    console.log(isdel);
    if (isdel !== 'confirm') {
        return;
    }
    const res = await delNews(id);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    getData();
};
</script>

<style lang="less" scoped>
.el-card {
    margin-top: 20px;
    .el-table {
        margin-top: 10px;
    }
}
</style>
