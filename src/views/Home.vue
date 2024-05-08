<!--  -->
<template>
    <!-- <div>{{$store.state.userInfo.username }}</div> -->
    <!-- <div>
        <el-button @click="logout">登出</el-button>
    </div> -->
    <div style="height: 100%">
        <el-container style="height: 100%">
            <el-header>
                <!-- 頭部區域 -->
                <Header></Header>
            </el-header>
            <el-container>
                <el-aside :width="$store.state.iscollapse ? '64px' : '200px'">
                    <!-- 左側菜單 -->
                    <Menu></Menu>
                </el-aside>
                <el-main>
                    <!-- 導航菜單 -->
                    <TagMenu></TagMenu>
                    <!-- 主體內容 -->
                    <router-view v-slot="{Component}">
                        <!-- v-slot="{Component}" 拿到點擊之後的動態組件 -->
                        <!-- 頁面緩存 -->
                        <!-- 如何實現動態組件的調用 使用component -->
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
import Header from '@/components/Header.vue';
import Menu from '@/components/Menu.vue';
import TagMenu from '@/components/TagMenu.vue';
</script>

<style lang="less" scoped>
.el-header {
    background: #1aa094;
}

.el-main {
    background: #f2f4f5;
    height: 100%;
}

.el-aside {
    height: 100%;
    background: #32363f;
}
</style>
