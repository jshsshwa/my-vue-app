<!-- 首页分类组件 -->
<template>
    <div style="margin-top:20px">
        <el-row :gutter="20">
            <el-col :span="3" v-for="(item, i) in NavCateList" :key="i" @click="$router.push(item.path)">
                <el-card shadow="hover">
                    <el-icon>
                        <component :is="item.icon" />
                    </el-icon>
                   <br>
                    <span>{{ item.title }}</span>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>

const NavCateList = [
{
        icon: "picture",      
        title: "图库管理",
        path: "/image/list"
    },
    {
        icon: "user",      
        title: "管理员管理",
        path: "/manager/list"
    },
   
    {
        icon: "shopping-cart",        
        title: "商品管理",
        path: "/goods/list"
    },
    {
        icon: "tickets",       
        title: "订单管理",
        path: "/order/list"
    },
    {
        icon: "Star",      
        title: "评价管理",
        path: "/comment/list"
    },
    
    {
        icon: "Edit",
        color: "text-green-500",
        title: "公告管理",
        path: "/notice/list"
    },
   
    {
        icon: "Present",       
        title: "优惠券管理",
        path: "/coupon/list"
    },
    {
        icon: "Setting",      
        title: "分销设置",
        path: "/setting/base"
    },
    
]
</script>

<style lang='less' scoped>
.el-card {
    cursor: pointer;
    display: flex;
    text-align: center;
    /*水平居中*/
    justify-content: center;
    font-size: 14px;
    .el-icon{
        font-size: 20px;
        padding-bottom: 10px;
    }
}
</style>