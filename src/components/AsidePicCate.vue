<!-- 图库分类 -->
<template>
    <el-aside width="200px">
        <div class="cateList">
            <div class="cateItem" :class="{ active: item.id == isActive }" v-for="(item,i) in cateList" :key="i">
                <span @click="changeCateList(item.id)">
                    {{ item.name }}
                </span>
                <em>
                    <el-button type="primary" text @click="$emit('edit',item)">
                        <el-icon>
                            <Edit />
                        </el-icon>
                    </el-button>
                    <el-button type="primary" text @click="$emit('del',item)">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </el-button>
                </em>
            </div>

        </div>
        <div class="page">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :small="small"
                :background="background" layout=" prev,  next" :total=total @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
        
    </el-aside>


</template>

<script setup>
import { ref } from 'vue'
import { getPicsCate } from '@/api/pics.js'

const cateList = ref([])
//总条数
const total = ref(0)
//当前页
const currentPage = ref(1)
//每页几条数据
const pageSize = ref(10)
//默认选中状态
const isActive = ref(0)


const background = ref('background')
const small = ref('small')



const getPicsCateData = async () => {
    const res = await getPicsCate(currentPage.value, pageSize.value)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return
    }
    cateList.value = res.data.list
    total.value = res.data.totalCount
    //将第一条分类设置成默认选中状态
    const item = cateList.value[0]
    if (item) {
        //isActive.value = item.id
        //保证一开始有数据 进来
        changeCateList(item.id)
    }
}
getPicsCateData()

//选中图库分类id
// const isActive = ref(0)


//向父组件暴露方法
defineExpose({
    getPicsCateData
})

//修改显示条数
const handleSizeChange = (val) => {
    pageSize.value = val
    getPicsCateData()
}
//修改分页页码
const handleCurrentChange = (val) => {
    currentPage.value = val
    getPicsCateData()
}

//子组件向父组件传递数据
const emit=defineEmits(["change"])
//分类选择
const changeCateList=(i)=>{
    isActive.value=i
    emit('change',i)
}

</script>

<style lang='less' scoped>
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
    background: #F3F3F3;
}

.active {
    background: #F3F3F3;
}
</style>