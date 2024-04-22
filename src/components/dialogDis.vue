<!-- 推广人列表 -->
<template>
    <el-dialog v-model="dialogVisible" :title="Tips" width="60%">
        <el-form :model="formData" label-width="100px">
            <el-form-item label="时间选择">
                <el-radio-group v-model="formData.type">
                    <el-radio-button label="all">全部</el-radio-button>
                    <el-radio-button label="today">今天</el-radio-button>
                    <el-radio-button label="yesterday">昨天</el-radio-button>
                    <el-radio-button label="last7days">最近7天</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="开始日期">
                <el-date-picker v-model="formData.starttime" type="date" placeholder="开始日期" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="结束日期">
                <el-date-picker v-model="formData.endtime" type="date" placeholder="结束日期" value-format="YYYY-MM-DD" />
            </el-form-item>

            <el-form-item label="用户类型">
                <el-radio-group v-model="formData.level">
                    <el-radio-button :label="0">全部</el-radio-button>
                    <el-radio-button :label="1">一级推广</el-radio-button>
                    <el-radio-button :label="2">二级推广</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="头像">
                <template #default="{row}">
                    <div>
                        <el-avatar :size="50" :src="row.avatar"></el-avatar>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="用户信息" />
            <el-table-column prop="share_num" label="推广数量" />
            <el-table-column prop="share_order_num" label="推广订单数量" />
            <el-table-column prop="create_time" label="创建时间" />

        </el-table>
    </el-dialog>
</template>

<script setup>
import { getDisListFn,disOrderFn } from '@/api/distribution.js'
import { ref, reactive } from 'vue'

const page = ref(1)

const Tips=ref('')

const formData = reactive({
    type: 'all',
    starttime: '',
    endtime: '',
    level: 0
})

const userId=ref(0)

const getList=async ()=>{
    const res=await getDisListFn(page.value,{
        ...formData,
        user_id: userId.value

    })
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return
    }
    tableData.value = res.data.list
}



const tableData = ref([])

const dialogVisible = ref(false)
const openDialog = async (id) => {
    Tips.value='推明细列表'
    console.log(id)
    userId.value=id   
    getList()
    dialogVisible.value = true
}


defineExpose(
    {
        openDialog
 
    }
)

</script>

<style lang='less' scoped></style>