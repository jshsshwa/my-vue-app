<!--  -->
<template>
    <div>
        <!-- <h1 style="color:#fff">{{ $store.state.activePath }}</h1> -->
        <el-menu active-text-color="#409EFF" background-color="#32363f" text-color="#fff" unique-opened
            :collapse-transition='false' router :default-active="defaultActive" :collapse='$store.state.iscollapse'>
            <!-- 一级菜单 -->
            <el-sub-menu :index="item.id + ''" v-for="item in menus" :key="item.id">
                <!-- 一级菜单内容 -->
                <template #title>
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="subItem.frontpath" v-for="subItem in item.child" :key="subItem.id" @click="saveNav(subItem.frontpath)">
                    <!-- 二级菜单内容 -->
                    <template #title>
                        <el-icon>
                            <component :is="subItem.icon"></component>
                        </el-icon>
                        <span>{{ subItem.name }}</span>
                    </template>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref ,onMounted} from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
const store = useStore()
//定义默认展开
let defaultActive = ref('/home')
//定义常量接收仓库中的导航数据
const menus = computed(() => {       
    return store.state.menus
})

onMounted(()=>{
    const isdefaultActive=window.sessionStorage.getItem('activePath') 
    if(isdefaultActive){
        defaultActive.value=window.sessionStorage.getItem('activePath')        
    }     
})

//监听当前路由发生变化
onBeforeRouteUpdate((to, from) => {
    //设置高亮菜单
    defaultActive.value = to.path    
    window.sessionStorage.setItem('activePath',to.path)
})


//获取点击菜单的路由地址
const saveNav=(path)=>{
    defaultActive.value=path
    window.sessionStorage.setItem('activePath',path)
}
</script>

<style lang='less' scoped>

</style>