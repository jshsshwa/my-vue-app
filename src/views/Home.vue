<!--  -->
<template>
    <!-- <div>{{$store.state.userInfo.username }}</div> -->
    <!-- <div>
        <el-button @click="logout">退出登录</el-button>
    </div> -->
    <div style="height:100%">
        <el-container style="height:100%">
            <el-header>
                <!-- 头部区域 -->
                <Header></Header>
            </el-header>
            <el-container>
                <el-aside :width="$store.state.iscollapse ? '64px' : '200px'">
                    <!-- 左侧菜单 -->
                    <Menu></Menu>
                </el-aside>
                <el-main>
                    <!-- 导航菜单 -->
                    <TagMenu></TagMenu>
                    <!-- 主体内容 -->
                    <router-view v-slot="{Component}">
                        <!-- v-slot="{Component}" 拿到点击之后的动态组件 -->
                        <!-- 页面缓存 -->
                         <!-- 如何实现动态组件的调用 使用component -->
                        <keep-alive :max="8">                           
                            <component :is="Component"></component>
                        </keep-alive>
                    </router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'
import TagMenu from '@/components/TagMenu.vue'

</script>


<style lang='less' scoped>
.el-header {
    background: #1AA094;
}

.el-main {
    background: #F2F4F5;
    height: 100%;
}

.el-aside {
    height: 100%;
    background: #32363f;

}
</style>