<!-- 优惠券模块 -->
<template>
    <div>
        <el-card>
            <div>
                <el-button type="primary" size="small" @click="oppenDialog">新增</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" stripe>
                <el-table-column label="优惠券名称" width="330">
                    <template #default="scope">
                        <div :class="scope.row.statusVal == '领取中' ? 'coupon' : 'coupon1'">
                            <h1>{{ scope.row.name }}</h1>
                            <span>{{ scope.row.start_time }}~~{{ scope.row.end_time }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="statusVal" label="状态" />
                <el-table-column prop="min_price" label="优惠">
                    <template #default="scope">
                        <div>
                            <span v-if="scope.row.type == 0">满减 ￥{{ scope.row.value }}</span>
                            <span v-if="scope.row.type == 1">折扣 {{ scope.row.value }}折</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="发放数量" />
                <el-table-column prop="used" label="已使用" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <div>
                        <!--     删除按钮：未开始、已失效、已结束
                                 编辑按钮：未开始
                                 失效按钮：领取中
                                     -->
                            <el-button v-if="scope.row.statusVal=='未开始'"  type="primary" :icon="Edit" @click="oppenEdit(scope.row)" size="small" />
                            <el-button v-if="scope.row.statusVal!=='领取中'" type="danger" :icon="Delete" @click="delCoupon(scope.row.id)" size="small" />
                            <el-button v-if="scope.row.statusVal=='领取中'" type="warning" size="small" @click="couponEnd(scope.row.id)">失效</el-button>

                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog v-model="dialogVisible" :title="TipsTitle" width="40%">
            <el-form :model="formData" label-width="120px">
                <el-form-item label="优惠券名称">
                    <el-input v-model="formData.name" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="formData.type">
                        <el-radio :label="0" border>满减</el-radio>
                        <el-radio :label="1" border>折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="面值">
                    <el-input v-model="formData.value" class="valueStyle" type="number" :min="0">
                        <template #append>{{ formData.type == 0 ? '元' : '折' }}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input-number v-model="formData.total" :min="1" :max="1000" />

                </el-form-item>
                <el-form-item label="最低使用价格">
                    <el-input v-model="formData.min_price" class="valueStyle" type="number" :min="0">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="描述">                    
                    <el-input v-model="formData.desc" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-date-picker v-model="dataTime" format="YYYY-MM-DD HH:mm:ss" type="datetimerange"
                        range-separator="To" start-placeholder="开始时间" end-placeholder="结束时间" :editable="false" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="formData.order" :min="1" :max="1000" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addCouponOk">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>



    </div>
</template>

<script setup>

import { Delete, Edit } from '@element-plus/icons-vue'

import { ElMessage, ElMessageBox } from 'element-plus'
import { getCouponListFn, addCouponFn, editCouponFn, delCouponFn ,endCouponFn} from '@/api/coupon.js'
import { ref, reactive, computed } from 'vue'
//优惠券列表数据源
const tableData = ref([])

//获取数据源
const getCouponList = async () => {
    const res = await getCouponListFn(1)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    tableData.value = res.data.list.map(item => {
        //为服务器返回的数组追加一个statusVal状态属性
        item.statusVal = couPonStatus(item)
        return item
    })

}
getCouponList()

//对话框标题
const TipsTitle = ref('')
//对话框显示和隐藏
const dialogVisible = ref(false)
//新增Form表单数据源
const formData = reactive({
    name: '',
    type: 0,
    value: 0,
    total: 100,
    min_price: 1,
    start_time: null,
    end_time: null,
    desc: '',
    order: 1
})
//优惠券id
const id = ref(0)

// //radio选择
// const radioChange = (e) => {
//     formData.type = e
// }
// //优惠券数量选择
// const handleChangeTotal = (e) => {
//     formData.total = e
// }
// //排序
// const handleChangeOrder=(e)=>{
//     formData.order = e
// }

//打开新增对话框
const oppenDialog = () => {
    TipsTitle.value = '新增'
    formData.name = ''
    formData.type = 0
    formData.value = 0
    formData.total = 100
    formData.min_price = 1
    formData.start_time = null
    formData.end_time = null
    formData.desc = ''
    formData.order = 1
    dialogVisible.value = true
}

//确定新增
const addCouponOk = async () => {
    beforeSubmit(formData)
    if (TipsTitle.value == '新增') {
        const res = await addCouponFn(formData)
        console.log(res)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        dialogVisible.value = false
        getCouponList()
    } else if (TipsTitle.value == '编辑') {
        const res = await editCouponFn(id.value, formData)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        dialogVisible.value = false
        getCouponList()
    }
}

//打开编辑对话框
const oppenEdit = (row) => {
    TipsTitle.value = '编辑'
    id.value = row.id
    console.log(row)
    formData.name = row.name
    formData.type = row.type
    formData.value = row.value
    formData.total = row.total
    formData.min_price = row.min_price
    formData.start_time = row.start_time
    formData.end_time = row.end_time
    formData.desc = row.desc
    formData.order = row.order

    dialogVisible.value = true

}

//删除
const delCoupon = async (id) => {
    //是否删除？
    const isdel = await ElMessageBox.confirm(
        '是否删除?',
        '删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(err => err)
    console.log(isdel)
    if (isdel !== 'confirm') {
        return
    }
    const res = await delCouponFn(id)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    ElMessage({
        message: '删除成功',
        type: 'success',
    })
    getCouponList()



}



//判断优惠券状态
function couPonStatus(row) {
    let state = "领取中"
    let start_time = (new Date(row.start_time)).getTime()
    let now = (new Date()).getTime()
    let end_time = (new Date(row.end_time)).getTime()
    if (start_time > now) {
        state = "未开始"
    } else if (end_time < now) {
        state = "已结束"
    } else if (row.status == 0) {
        state = "已失效"
    }
    return state
}

//选择时间
const dataTime = computed({
    get() {
        return formData.start_time && formData.end_time ? [formData.start_time, formData.end_time] : []
    },
    set(val) {
        formData.start_time = val[0]
        formData.end_time = val[1]
    }
})

//提交之前转成时间戳
const beforeSubmit = (data) => {
    data.start_time = (new Date(data.start_time)).getTime()
    data.end_time = (new Date(data.end_time)).getTime()
    return data
}

//优惠券失效
const couponEnd = async (id) => {
    const isdel = await ElMessageBox.confirm(
        '是否停止该优惠券？',
        '失效',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(err => err)
    console.log(isdel)
    if(isdel!=='confirm'){
        return
    }
    //调用失效api
    const res=await endCouponFn(id)
    if(res.msg&&res.msg!=='ok'){
        return ElMessage.error(res.msg)
    }
    ElMessage({
        message: '该优惠券已失效',
        type: 'success',
    })
    getCouponList()

}



</script>

<style lang='less' scoped>
.el-card {
    margin-top: 20px;

    .el-table {
        margin-top: 10px
    }
}

.coupon {
    width: 300px;
    height: 65px;
    background: #ecf5ff;
    border: 1px solid #61aeff;
    border-radius: 5px;
    padding-top: 8px;
    padding-left: 10px;
    box-sizing: border-box;
    color: #61aeff;

    h1 {
        font-size: 15px;
        font-weight: bold;
        margin: 0;
        padding: 0;
    }
}

.coupon1 {
    width: 300px;
    height: 65px;
    background: #f4f4f5;
    border: 1px solid #cdced1;
    border-radius: 5px;
    padding-top: 5px;
    padding-left: 10px;
    box-sizing: border-box;
    color: #cdced1;

    h1 {
        font-size: 15px;
        font-weight: bold;
        margin: 0;
        padding: 0;
    }
}

.valueStyle {
    width: 182px;
}
</style>