<!--  -->
<template>
    <div class="tag-main">
        <el-tabs
            v-model="activeTable"
            type="card"
            @tab-remove="removeTab"
            style="max-width: 1138px; flex: 1"
            @tab-change="changeTabsHandle"
        >
            <el-tab-pane :closable="item.path !== '/home'" v-for="item in tabsList" :key="item.path" :label="item.title" :name="item.path">
            </el-tab-pane>
        </el-tabs>
        <el-dropdown @command="dropdownHandle">
            <span class="el-dropdown-link">
                <el-icon>
                    <arrow-down />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="closeOther">關閉其他</el-dropdown-item>
                    <el-dropdown-item command="closeAll">關閉所有</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import router from '@/router/index.js';
import {useRoute, onBeforeRouteUpdate} from 'vue-router';
import {useStore} from 'vuex';
const store = useStore();
const route = useRoute();

//當前激活的菜單選項
const activeTable = ref(route.path);
//tabs菜單數據源
const tabsList = ref([
    {
        title: '後臺首頁',
        path: '/home'
    }
]);

//初始化標籤導航
//初始化標籤導航列表
function initTabList() {
    let istabList = JSON.parse(window.sessionStorage.getItem('tabList'));
    if (istabList) {
        tabsList.value = istabList;
    }
}
initTabList();

//添加標籤導航
const addTab = (obj) => {
    //notTab 表示之前沒有添加過
    const notTab = tabsList.value.findIndex((item) => item.path == obj.path) == -1;
    if (notTab) {
        tabsList.value.push(obj);
        //本地存儲
        window.sessionStorage.setItem('tabList', JSON.stringify(tabsList.value));
    }
};

//監聽當前路由發生變化
onBeforeRouteUpdate((to, from) => {
    //激活選中項
    activeTable.value = to.path;
    addTab({
        title: to.meta.title,
        path: to.path
    });
});

//關閉tabs標籤
//path是要移除的路由地址，從name屬性獲取 item.path
const removeTab = (path) => {
    console.log('刪除標籤', path);

    //判斷關閉的標籤是否是激活狀態，如果是激活狀態則需要切換路由
    if (path == activeTable.value) {
        //找到了需要刪除的菜單
        const idx = tabsList.value.findIndex((item) => item.path == path);
        //獲取上一個或下一個標籤
        const nextTab = tabsList.value[idx + 1] || tabsList.value[idx - 1];
        if (nextTab) {
            activeTable.value = nextTab.path;
        }
    }

    //從tabsList數組刪除選中的菜單
    //filter是過濾，生成新數組
    tabsList.value = tabsList.value.filter((item) => item.path != path);
    //重新設定本地存儲
    window.sessionStorage.setItem('tabList', JSON.stringify(tabsList.value));

    //路由跳轉
    router.push(activeTable.value);
};

//changeTabsHandle事件
const changeTabsHandle = (path) => {
    console.log('改變標籤', path);
    //path 是標籤name所設定的值，也就是需要跳轉的路由地址 item.path
    //設置激活選項
    activeTable.value = path;
    //路由跳轉
    router.push(path);
};

//下拉菜單
const dropdownHandle = (res) => {
    console.log(res);
    if (res == 'closeOther') {
        //關閉其他
        //只保留首頁和當前激活狀態頁
        tabsList.value = tabsList.value.filter((item) => item.path == '/home' || item.path == activeTable.value);
    }
    if (res == 'closeAll') {
        //關閉所有
        //將標籤切換回首頁
        activeTable.value = '/home';
        //數據源只保留首頁
        tabsList.value = [
            {
                title: '後臺首頁',
                path: '/home'
            }
        ];
    }
    //更新本地存儲
    window.sessionStorage.setItem('tabList', JSON.stringify(tabsList.value));
    //路由跳轉
    router.push(activeTable.value);
};
</script>

<style lang="less" scoped>
.tag-main {
    display: flex;
    background: #dbdbdb;
    overflow: hidden;
    padding-top: 7px;
    padding-bottom: 2px;
}

.el-dropdown {
    background: #fff;
    width: 30px;
    height: 34px;
    border-radius: 4px;
    margin-left: auto;
    display: flex;
    margin-right: 10px;
    // 水平方向居中
    justify-content: center;
    line-height: 43px;
}

:deep(.el-tabs__header) {
    margin: 0px;
}

:deep(.el-tabs__nav) {
    border: 0 !important;
}

:deep(.el-tabs__item) {
    border: 0 !important;
    background: #fff;
    margin-left: 10px;
    height: 34px;
    line-height: 34px !important;
    border-radius: 4px;
}

:deep(.el-tabs__header) {
    border: none !important;
}
</style>
