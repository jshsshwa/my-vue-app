<!--  -->
<template>
    <div>
        <el-card>
            <el-tabs v-model="queryData.tab" @tab-change="getOrderList">
                <el-tab-pane label="全部" name="all"></el-tab-pane>
                <el-tab-pane label="待支付" name="nopay"></el-tab-pane>
                <el-tab-pane label="待发货" name="noship"></el-tab-pane>
                <el-tab-pane label="待收货" name="shiped"></el-tab-pane>
                <el-tab-pane label="已收货" name="received"></el-tab-pane>
                <el-tab-pane label="已完成" name="finish"></el-tab-pane>
                <el-tab-pane label="已关闭" name="closed"></el-tab-pane>
                <el-tab-pane label="退款中" name="refunding"></el-tab-pane>
            </el-tabs>
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-input placeholder="请输入订单号" clearable v-model="queryData.no" @clear="getOrderList">

                        <template #append>
                            <el-button :icon="Search" @click="getOrderList" />
                        </template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top:15px">
                <el-col>
                    <el-button type="danger" size="small" @click="delOrderHandle">批量删除</el-button>
                    <el-button type="primary" size="small" @click="openDialog">导出订单</el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData" style="width: 100%;margin-bottom:20px" @selection-change="selectOrders" border
                stripe>
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品信息">
                    <template #default="scope">
                        <div class="goodsTitle">
                            <span style="color:blue;">订单号：{{ scope.row.no }}</span>
                            <span>下单时间：{{ scope.row.update_time }}</span>

                            <div v-for="(item, i) in scope.row.order_items" :key="i">
                                <el-avatar shape="square" :size="80" fit="cover"
                                    :src="item.goods_item ? item.goods_item.cover : ''" />
                                <h1>{{ item.goods_item ? item.goods_item.title : '' }}</h1>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="total_price" label="实付款" align="center" />
                <el-table-column prop="user.username" label="购买会员" align="center" />



                <el-table-column label="交易状态">
                    <template #default="{ row }">
                        <div style="margin-bottom: 15px;">
                            付款状态：
                            <el-tag v-if="row.payment_method == 'wechat'" type="success" size="small">微信支付</el-tag>
                            <el-tag v-else-if="row.payment_method == 'alipay'" size="small">支付宝支付</el-tag>
                            <el-tag v-else type="info" size="small">未支付</el-tag>
                        </div>
                        <div style="margin-bottom: 15px;">
                            发货状态：
                            <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{ row.ship_data ? '已发货' : '未发货'
                            }}</el-tag>
                        </div>
                        <div>
                            收货状态：
                            <el-tag :type="row.ship_status == 'received' ? 'success' : 'info'" size="small">{{
                                row.ship_status == 'received' ? '已收货' : '未收货' }}</el-tag>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-tag style="margin-right: 15px;cursor: pointer;" @click="openOrderDetails(row)">订单详情</el-tag>
                        <el-tag v-if="queryData.tab == 'noship'" type="warning" style="cursor: pointer;"
                            @click="orderSend(row.id)">订单发货</el-tag>
                        <el-tag type="warning" v-if="queryData.tab == 'refunding'"
                            style="cursor: pointer;margin-right: 15px;margin-top:15px"
                            @click="refundHandle(row.id, 1)">同意退款</el-tag>
                        <el-tag type="warning" v-if="queryData.tab == 'refunding'" style="cursor: pointer;margin-top:15px"
                            @click="refundHandle(row.id, 0)">拒绝退款</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 拒绝退款 -->
        <el-dialog v-model="dialogVisibleNo" title="拒绝理由" width="40%">
            <el-form :model="formRefund">
                <el-form-item>
                    <el-input v-model="formRefund.disagree_reason" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleNo = false">取消</el-button>
                    <el-button type="primary" @click="submitRefund">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 导出订单 -->
        <el-dialog v-model="dialogVisible" title="导出订单" width="40%">
            <el-form :model="formData" label-width="120px">
                <el-form-item label="订单类型">
                    <el-select v-model="formData.tab" placeholder="请选择订单状态">
                        <el-option v-for="(item, i) in orderStatus" :key="i" :label="item.name" :value="item.value" />
                    </el-select>

                </el-form-item>
                <el-form-item label="时间范围">
                    <el-date-picker v-model="formData.time" type="daterange" range-separator="To" start-placeholder="开始时间"
                        end-placeholder="结束时间" value-format="YYYY-MM-DD" />

                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitOk" :loading="loadingExport">
                        导出Excel
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 订单详情 -->
        <el-dialog v-model="dialogVisibleOrder" title="订单详情" width="40%">
            <div class="orderMian">
                <div>
                    <div class="orderTop">订单信息</div>
                    <div class="orderCon">
                        订单号：{{ orderInfo.data.no }}<br>
                        付款方式：{{ orderInfo.data.payment_method }}<br>
                        下单时间：{{ orderInfo.data.update_time }}
                    </div>
                </div>
                <div>
                    <div class="orderTop">商品信息</div>
                    <div class="orderCon">
                        <div v-for="(item, i) in orderInfo.data.order_items" :key="i" style="border-bottom: 1px dashed #dbdbdb;padding-bottom: 13px;margin-bottom: 10px;">
                            商品名称：{{ item.goods_item ? item.goods_item.title : '已删除' }}<br>
                            商品价格：{{ item.price }}<br>
                            商品数量：{{ item.num }}<br>
                            <span v-if="item.skuValue">
                                商品规格：
                                <!-- 商品规格：{{ item.skuValue }} -->
                                <el-tag v-for="(sub,index) in item.skuValue" :key="index" style="margin-right: 15px;">
                                   {{ sub }}
                                </el-tag>
                            </span>
                        </div>
                        商品总价：{{ orderInfo.data.total_price }}
                    </div>

                </div>
                <div v-if="orderInfo.data.ship_data">
                    <div class="orderTop">发货信息</div>
                    <div class="orderCon">
                        物流公司：{{ orderInfo.data.ship_data.express_company }}<br>
                        运单号： {{ orderInfo.data.ship_data.express_no }}<br>
                        <el-button type="primary" size="small" @click="openLgstc(orderInfo.data.id)">查看物流</el-button>

                    </div>
                </div>
                <div v-if="orderInfo.data.address">
                    <div class="orderTop">收货信息</div>
                    <div class="orderCon">
                        收货人：{{ orderInfo.data.address.name }}<br>
                        联系方式： {{ orderInfo.data.address.phone }}<br>
                        联系地址： {{ orderInfo.data.address.province + orderInfo.data.address.city +
                            orderInfo.data.address.district + orderInfo.data.address.address }}

                    </div>
                </div>
            </div>

        </el-dialog>
        <!-- 物流信息 -->
        <el-dialog v-model="dialogVisibleLgstc" title="物流信息" width="40%">

            <div style="line-height: 30px;">
                物流公司：{{ lgstc.typename }}<br>
                物流单号：{{ lgstc.number }}
            </div>
            <div style="margin-top:30px">
                <el-timeline>
                    <el-timeline-item v-for="(activity, index) in lgstc.list" :key="index" :timestamp="activity.time">
                        {{ activity.status }}
                    </el-timeline-item>
                </el-timeline>
            </div>

        </el-dialog>

        <!-- 发货 -->

        <el-dialog v-model="dialogVisibleSend" title="发货" width="40%">
            <el-form :model="formOrderSend">
                <el-form-item label="快递公司">
                    <el-input v-model="formOrderSend.express_company" />
                </el-form-item>
                <el-form-item label="快递单号">
                    <el-input v-model="formOrderSend.express_no" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleSend = false">取消</el-button>
                    <el-button type="primary" @click="submitOrderSendOk">
                        确定
                    </el-button>
                </span>
            </template>

        </el-dialog>


    </div>
</template>

<script setup>
import { getOrderListFn, exportOrderList, logisticsFn, refundFn, orderSenderFn, delOrders } from '@/api/order.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
//打开导出订单弹框
const openDialog = () => {
    dialogVisible.value = true

}

//订单类型
const orderStatus = [{
    value: "all",
    name: "全部"
}, {
    value: "nopay",
    name: "待支付"
}, {
    value: "noship",
    name: "待发货"
}, {
    value: "shiped",
    name: "待收货"
}, {
    value: "received",
    name: "已收货"
}, {
    value: "finish",
    name: "已完成"
}, {
    value: "closed",
    name: "已关闭"
}, {
    value: "refunding",
    name: "退款中"
}]


//导出订单数据源
const formData = reactive({
    tab: 'all',
    time: ''
})

const loadingExport = ref(false)

//导出excel
const submitOk = async () => {
    console.log(formData.time)
    let starttime = null
    let endtime = null
    if (formData.time && Array.isArray(formData.time)) {
        //表示选择了时间段
        starttime = formData.time[0]
        endtime = formData.time[1]
    }
    //调用接口方法
    const res = await exportOrderList(formData.tab, starttime, endtime)
    console.log(res)
    //如何将res变成文件下载下来？
    //url是下载地址？
    let url = window.URL.createObjectURL(new Blob([res]))
    //创建A标签
    let link = document.createElement("a")
    //隐藏A标签
    link.style.display = "none"
    //设置A标签href属性
    link.href = url
    //设置文件名
    let filename = (new Date()).getTime() + ".xlsx"
    //设置A标签属性
    link.setAttribute("download", filename)
    //将A标签追加到body标签之下
    document.body.appendChild(link)
    //点击A标签
    link.click()
    dialogVisible.value = false
}


//table数据源（商品列表）
const tableData = ref([])
const page = ref(1)

//查询参数
const queryData = reactive({
    //订单类型
    tab: 'all',
    //订单号
    no: ''
})

//获取订单列表
const getOrderList = async () => {
    const res = await getOrderListFn(page.value, queryData)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    tableData.value = res.data.list

}

getOrderList()

const delParams = ref([])

//批量选择
const selectOrders = (val) => {
    //console.log(val.map(item=>item.id))
    delParams.value = val.map(item => item.id)

}
//批量删除
const delOrderHandle = async () => {
    const res = await delOrders(delParams.value)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    getOrderList()
}

const dialogVisibleOrder = ref(false)

//订单详情信息
const orderInfo = reactive({
    data: {}
})

//打开订单详情
const openOrderDetails = (row) => {
    console.log(row)
    row.order_items = row.order_items.map(item => {
        if (item.skus_type == 1 && item.goods_skus) {
            let arr = []
            //多规格
            //重点是 循环遍历对象 ，获取每个对象的value值，并追加到数组
            for (const key in item.goods_skus.skus) {
                //主要获取每个对象的value值 注意：key是 0 1                
                arr.push(item.goods_skus.skus[key].value)
            }
            //转成字符串  ==没必要转成字符串
            // item.skuValue = arr.join(',')
            item.skuValue=arr
        }
        return item
    })
    orderInfo.data = row
    dialogVisibleOrder.value = true
}

const lgstc = ref({})

//物流信息
const dialogVisibleLgstc = ref(false)
//弹出物流信息
const openLgstc = async (id) => {
    const res = await logisticsFn(id)
    console.log(res)
    if (res.data && res.data.msg !== 'ok') {
        return ElMessage.error(res.data.msg)
    }
    lgstc.value = res.data.result
    dialogVisibleLgstc.value = true
}


//拒绝退款
const dialogVisibleNo = ref(false)

const formRefund = reactive({
    disagree_reason: '',
    agree: 0
})


const refundId = ref(0)



//同意退款
const refundHandle = async (id, agree) => {
    console.log(id)
    if (agree == 1) {
        const isdel = await ElMessageBox.confirm(
            '是否同意?',
            '退款',
            {
                confirmButtonText: '同意',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).catch(err => err)
        console.log(isdel)
        if (isdel !== 'confirm') {
            return
        }
        const res = await refundFn(id, {
            agree: 1
        })
        console.log(res)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        getOrderList()
    } else if (agree == 0) {
        refundId.value = id
        dialogVisibleNo.value = true
    }

}

//确认拒绝
const submitRefund = async () => {
    const res = await refundFn(refundId.value, formRefund)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    dialogVisibleNo.value = false
    getOrderList()
}

const dialogVisibleSend = ref(false)

const formOrderSend = reactive({
    express_company: '',
    express_no: ''
})

//订单发货
const orderSend = (id) => {
    console.log(id)
    refundId.value = id
    dialogVisibleSend.value = true

}

//确定发货
const submitOrderSendOk = async () => {
    const res = await orderSenderFn(refundId.value, formOrderSend)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    dialogVisibleSend.value = false
    getOrderList()
}

</script>

<style lang='less' scoped>
.el-card {
    margin-top: 20px
}

.el-table {
    margin-top: 20px  
}

.tag2 {
    margin-right: 10px;
}

.goodsTitle {

    .el-avatar {
        margin-right: 10px;
        float: left;

    }

    h1 {
        font-size: 14px;

        margin: 0;
        padding: 0px
    }

    span {
        display: block;

    }

    div {
        display: flex;
        widows: 100%;
        overflow: hidden;
        clear: both;
        margin-top: 15px;
        margin-bottom: 15px;
        align-items: center;
    }
}

.inputWidth {
    width: 40%;
}

:deep(.addDialog) {
    height: 460px !important;
    overflow-y: auto;
}

.editClass {
    display: flex;
}

.btnClass {
    background: orange;
    color: white;
    display: block;
    width: 120px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 3px;
    margin-left: 10px;
    cursor: pointer;
    padding: 0px;
    border: none
}

.btnClass1 {
    background: #67c23a;
    color: white;
    display: block;
    width: 120px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 3px;
    margin-left: 10px;
    cursor: pointer;
    padding: 0px;
    border: none
}

.btnClass2 {
    background: #f4f4f5;
    color: #91949a;
    display: block;
    width: 120px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 3px;
    margin-left: 10px;
    cursor: pointer;
    padding: 0px;
    border: none
}

.orderMian {
    border: 1px solid #dbdbdb;
    line-height: 35px;
    padding: 10px;
    box-sizing: border-box;

    .orderTop {
        font-weight: bold;
    }

    .orderCon {
        border-bottom: 1px solid #dbdbdb;
        padding-bottom: 10px;
        margin-bottom: 10px;
        box-sizing: border-box;
    }
}
</style>