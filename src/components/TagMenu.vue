<!--  -->
<template>
    <div class="tag-main">
        <el-tabs v-model="activeTable" type="card" @tab-remove="removeTab" style="max-width:1138px;flex: 1;"
            @tab-change="changeTabsHandle">
            <el-tab-pane :closable="item.path !== '/home'" v-for="item in tabsList" :key="item.path" :label="item.title"
                :name="item.path">
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
                    <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="closeAll">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router/index.js'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import {useStore} from 'vuex'
const store=useStore()
const route = useRoute()

//当前激活的菜单选项
const activeTable = ref(route.path)
//tabs菜单数据源
const tabsList = ref([
    {
        title: '后台首页',
        path: '/home'
    }
])


//初始化标签导航
//初始化标签导航列表
function initTabList() {
    let istabList = JSON.parse(window.sessionStorage.getItem("tabList"))
    if (istabList) {
        tabsList.value = istabList
    }
}
initTabList()

//添加标签导航
const addTab = (obj) => {
    //notTab 表示之前没有添加过
    const notTab = tabsList.value.findIndex(item => item.path == obj.path) == -1
    if (notTab) {
        tabsList.value.push(obj)
        //本地存储
        window.sessionStorage.setItem("tabList", JSON.stringify(tabsList.value))
    }

}

//监听当前路由发生变化
onBeforeRouteUpdate((to, from) => {
    //激活选中项
    activeTable.value = to.path
    addTab({
        title: to.meta.title,
        path: to.path
    })
})


//changeTabsHandle事件
const changeTabsHandle = (path) => {
    console.log(path)
    //path 是标签name所设定的值，也就是需要跳转的路由地址 item.path
    //设置激活选项
    activeTable.value = path
    //路由跳转
    router.push(path)
 
}

//关闭tabs标签
const removeTab = (path) => {
    //path是要移除的路由地址，从name属性获取 item.path
    console.log(path)
    //判断关闭的标签是否是激活状态，如果是激活状态则需要切换路由
    //获取当前激活的tabs标签
    let isTabs = activeTable.value
    //获取菜单数据源
    const tabs = tabsList.value
    //删除的是 激活菜单,将激活选项设为 上一个或下一个标签的 path
    if (path == isTabs) {
        tabs.forEach((item, index) => {
            if (item.path == path) {
                //找到了需要删除的菜单
                //获取上一个或下一个标签
                const nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                    isTabs = nextTab.path
                }
            }
        })
    }
    activeTable.value = isTabs
    //从tabsList数组删除选中的菜单
    //filter是过滤，生成新数组
    tabsList.value = tabsList.value.filter(item => item.path != path)
    //重新设定本地存储
    window.sessionStorage.setItem("tabList", JSON.stringify(tabsList.value))
}

//下拉菜单
const dropdownHandle = (res) => {
    console.log(res)
    if (res == 'closeOther') {
        //关闭其他
        //只保留首页和当前激活状态页
        tabsList.value = tabsList.value.filter(item => item.path == '/home' || item.path == activeTable.value)
    }
    if (res == 'closeAll') {
        //关闭所有
        //将标签切换回首页
        activeTable.value = '/home'
        //数据源只保留首页
        tabsList.value = [
            {
                title: '后台首页',
                path: '/home'
            }
        ]
    }
    //更新本地存储
    window.sessionStorage.setItem("tabList", JSON.stringify(tabsList.value))

}
</script>

<style lang='less' scoped>
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
    border: 0 !important
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
    border: none !important
}
</style>