<!--  -->
<template>
    <div>
        <el-card>
            <el-col :span="6">
                <el-input placeholder="請輸入商品名稱" clearable @clear="getCommentList">
                    <template #append>
                        <el-button :icon="Search" />
                    </template>
                </el-input>
            </el-col>
            <el-table :data="tableData" style="width: 100%" border stripe row-key="id">
                <el-table-column type="expand">
                    <template #default="scope">
                        <div class="setComment">
                            <el-avatar :size="50" :src="scope.row.user.avatar" fit="cover" />
                            <div>
                                <p>
                                    <span class="p1">{{ scope.row.user.username }}</span>
                                </p>
                                <p>{{ scope.row.review.data }}</p>
                                <p>
                                    <el-avatar v-for="(item, i) in scope.row.review.image" :key="i" shape="square" :size="80" :src="item" />
                                </p>
                                <p v-if="!scope.row.extra">
                                    <el-button type="primary" @click="openDialig(scope.row)">回覆</el-button>
                                </p>
                                <div v-else class="setMain" v-for="(item, i) in scope.row.extra" :key="i">
                                    <span>回覆：</span>
                                    {{ item.data }}
                                    <p>
                                        <span style="color: #409eff; cursor: pointer" @click="oppenDialogEdit(scope.row, item.data)"
                                            >修改</span
                                        >
                                    </p>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="商品">
                    <template #default="scope">
                        <div class="avatar">
                            <el-avatar shape="square" :size="50" :src="scope.row.goods_item.cover" fit="cover" />
                            <span>{{ scope.row.goods_item.title }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="評分">
                    <template #default="scope">
                        <div>
                            <p>用户：{{ scope.row.user.username }}</p>
                            <span>
                                <el-rate v-model="scope.row.rating" disabled show-score text-color="#ff9900" />
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="review_time" label="評價時間" />
                <el-table-column label="是否顯示評價">
                    <template #default="scope">
                        <div>
                            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeHandle(scope.row)" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog v-model="dialogVisible" title="回覆商品評價" width="40%">
            <el-form :model="formData">
                <el-form-item label="回覆內容">
                    <el-input v-model="formData.data" type="textarea" />
                </el-form-item>
            </el-form>
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
import {ElMessage} from 'element-plus';
import {editCommentStatusFn, getCommentListFn, setCommentFn} from '@/api/comment.js';
import {Search} from '@element-plus/icons-vue';
import {ref, reactive} from 'vue';

const tableData = ref([]);
const page = ref(1);
const queryData = reactive({
    title: ''
});
const id = ref(null);
const dialogVisible = ref(false);

const formData = reactive({
    data: ''
});

//打開新增回覆彈框
const openDialig = (row) => {
    console.log(row);
    formData.data = '';
    id.value = row.id;
    dialogVisible.value = true;
};
//打開修改回覆
const oppenDialogEdit = (row, msg) => {
    console.log(row);
    id.value = row.id;
    formData.data = msg;
    dialogVisible.value = true;
};

//回覆評價
const submitOk = async () => {
    const res = await setCommentFn(id.value, formData);
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    dialogVisible.value = false;
    ElMessage({
        message: '回覆成功',
        type: 'success'
    });
    getCommentList();
};

//獲取評論列表
const getCommentList = async () => {
    const res = await getCommentListFn(page.value, queryData.title);
    console.log('獲取評論列表', res);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    tableData.value = res.data.list;
};
getCommentList();

//修改狀態
const changeHandle = async (row) => {
    console.log(row.status);
    const res = await editCommentStatusFn(row.id, row.status);
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    ElMessage({
        message: '狀態修改成功',
        type: 'success'
    });
};
</script>

<style lang="less" scoped>
.el-card {
    margin-top: 20px;

    .el-table {
        margin-top: 20px;
    }

    .avatar {
        display: flex;
        align-items: center;

        .el-avatar {
            margin-right: 15px;
        }
    }
}

.setComment {
    display: flex;
    width: 90%;
    margin: 0 auto;

    .el-avatar {
        margin-right: 20px;
    }

    div {
        width: 100%;

        p {
            margin: 0px;
            padding: 0px;
            line-height: 30px;
        }
    }

    .p1 {
        font-weight: bold;
        padding-right: 10px;
        box-sizing: border-box;
    }

    .setMain {
        background: #dbdbdb;
        width: 100%;
        line-height: 30px;
        padding: 15px;
        box-sizing: border-box;
        margin-bottom: 15px;
        margin-top: 15px;
    }
}
</style>
