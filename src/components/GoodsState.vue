<!-- 首页店铺及商品提示 -->
<template>
    <div>
        <el-card>
            <div class="e_title">
                {{ gtitle }}
                <span>
                    <el-tag>{{ desc }}</el-tag>
                </span>
            </div>
            <el-row :gutter="20">
                <el-col :span="6" v-for="(item,i) in gData" :key="i">

                    <el-card shadow="hover" class="g_main">
                       <span> {{ item.value }}</span>
                        {{ item.label }}                        
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup>

const props = defineProps({
    gtitle: String,
    desc: String,
    gData:Array  

})

</script>

<style lang='less' scoped>
.e_title {
    display: flex;
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 15px;
    line-height: 30px;

    span {
        margin-left: auto;

        .el-check-tag {
            margin-left: 10px;
        }
    }
}

.g_main {
    display: flex;
    justify-content: center;
    margin-top:20px;
    line-height: 26px;
    text-align: center;
    cursor: pointer;
    span{
        display: block;
        font-weight: bold;
        font-size: 18px;
    }
}
</style>