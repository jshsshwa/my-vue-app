<!-- 圖庫分類 -->
<template>
    <el-aside width="200px">
        <div class="cateList">
            <div class="cateItem" :class="{active: item.id == isActive}" v-for="(item, i) in cateList" :key="i">
                <span @click="changeCateList(item.id)">
                    {{ item.name }}
                </span>
                <em>
                    <el-button type="primary" text @click="$emit('edit', item)">
                        <el-icon>
                            <Edit />
                        </el-icon>
                    </el-button>
                    <el-button type="primary" text @click="$emit('del', item)">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </el-button>
                </em>
            </div>
        </div>
        <div class="page">
            <el-pagination
                :current-page="currentPage"
                :page-size="pageSize"
                :small="small"
                :background="background"
                layout=" prev, pager,  next"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </el-aside>
</template>

<script setup>
import {ref} from 'vue';
import {getPicsCate} from '@/api/pics.js';
//子組件向父組件傳遞數據
const emit = defineEmits(['change', 'edit', 'del']);

const cateList = ref([]);
//總條數
const total = ref(0);
//當前頁
const currentPage = ref(1);
//每頁幾條數據
const pageSize = ref(10);
//默認選中狀態
const isActive = ref(0);

const background = ref('background');
const small = ref('small');

const getPicsCateData = async () => {
    const res = await getPicsCate(currentPage.value, pageSize.value);
    console.log(res);
    if (res.msg && res.msg !== 'ok') return;

    cateList.value = res.data.list;
    total.value = res.data.totalCount;
    //將第一條分類設置成默認選中狀態
    const item = cateList.value[0];
    if (item) {
        //isActive.value = item.id
        //保證一開始有數據 進來
        changeCateList(item.id);
    }
};
getPicsCateData();

//選中圖庫分類id
// const isActive = ref(0)

//向父組件暴露方法
defineExpose({
    getPicsCateData
});

//修改顯示條數
const handleSizeChange = (val) => {
    pageSize.value = val;
    getPicsCateData();
};
//修改分頁頁碼
const handleCurrentChange = (val) => {
    currentPage.value = val;
    getPicsCateData();
};

//分類選擇
const changeCateList = (i) => {
    isActive.value = i;
    emit('change', i);
};
</script>

<style lang="less" scoped>
.el-aside {
    height: 100%;
    border-right: 1px solid #dbdbdb;
    position: relative;
}

.cateList {
    position: absolute;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 50px;
    overflow-y: auto;
}

.page {
    position: absolute;
    right: 0px;
    left: 0px;
    bottom: 0px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cateItem {
    display: flex;
    height: 43px;

    align-items: center;
    cursor: pointer;

    em {
        margin-left: auto;

        .el-button {
            margin: 0px;
            width: 30px;
        }

        padding-right: 5px;
    }

    span {
        padding-left: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100px;
    }
}

.cateItem:hover {
    background: #f3f3f3;
}

.active {
    background: #f3f3f3;
}
</style>
