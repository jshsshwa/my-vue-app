<!--  -->
<template>
    <div>
        <el-card>
            <el-tabs v-model="queryData.tab" @tab-change="getGoodsList">
                <el-tab-pane label="全部" name="all"></el-tab-pane>
                <el-tab-pane label="审核中" name="checking"></el-tab-pane>
                <el-tab-pane label="出售中" name="saling"></el-tab-pane>
                <el-tab-pane label="已下架" name="off"></el-tab-pane>
                <el-tab-pane label="库存预警" name="min_stock"></el-tab-pane>
                <el-tab-pane label="回收站" name="delete"></el-tab-pane>
            </el-tabs>
            <el-row :gutter="30">
                <el-col :span="10">
                    <el-input placeholder="请输入商品名称" clearable v-model="queryData.title" @clear="getGoodsList">
                        <template #prepend>
                            <el-select v-model="queryData.category_id" clearable placeholder="请选择商品分类" style="width: 145px">
                                <el-option :label="item.name" :value="item.id" v-for="item in goodsCate" :key="item.id" />
                            </el-select>
                        </template>
                        <template #append>
                            <el-button :icon="Search" @click="getGoodsList" />
                        </template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top:15px">
                <el-col>
                    <el-button type="primary" size="small" @click="oppenAddDialog">新增商品</el-button>
                    <el-button type="danger" size="small" @click="delAllHandle"
                        v-if="queryData.tab !== 'delete'">批量删除</el-button>
                    <el-button size="small" v-if="queryData.tab == 'delete'" type="warning"
                        @click="resetHandle">批量恢复</el-button>
                    <el-button size="small" v-if="queryData.tab == 'delete'" type="danger" @click="delOk">彻底删除</el-button>
                    <el-button plain size="small" @click="setGoodsStatus(1)"
                        v-if="queryData.tab == 'all' || queryData.tab == 'off'">上架</el-button>
                    <el-button plain size="small" @click="setGoodsStatus(0)"
                        v-if="queryData.tab == 'all' || queryData.tab == 'saling'">下架</el-button>


                </el-col>
            </el-row>
            <el-table :data="tableData" style="width: 100%;margin-bottom:20px" ref="tableRef"
                @selection-change="selectGoods">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品信息" width="300">
                    <template #default="scope">
                        <div class="goodsTitle">
                            <el-avatar shape="square" :size="80" fit="cover" :src="scope.row.cover" />

                            <h1>{{ scope.row.title }}</h1>
                            <span style="color:red">￥{{ scope.row.min_price }}</span>
                            <span>分类：{{ scope.row.category ? scope.row.category.name : '未分类' }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="商品状态">
                    <template #default="scope">
                        <div>
                            <el-tag type="warning" v-if="scope.row.status == 1">销售中</el-tag>
                            <el-tag type="info" v-else>已下架</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" v-if="queryData.tab !== 'delete'">
                    <template #default="scope">
                    <!-- 
                            ischeck==0表示未审核
                            1表示通过
                            2表示拒绝
                                                                                                             -->
                        <div v-if="scope.row.ischeck == 0">
                            <el-tag type="success" class="tag2">通过</el-tag>
                            <el-tag type="info">拒绝</el-tag>
                        </div>
                        <div v-else>
                            <el-tag type="success" class="tag2" v-if="scope.row.ischeck == 1">通过</el-tag>
                            <el-tag type="info" v-if="scope.row.ischeck == 2">拒绝</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="stock" label="库存" />
                <el-table-column label="操作" width="380">
                    <template #default="scope">
                        <div v-if="queryData.tab !== 'delete'" class="editClass">
                            <el-button type="primary" :icon="Edit" size="small" @click="oppenEditDialog(scope.row)" />
                            <!-- <span class="btnClass" @click="oppenSetBanner(scope.row)" :loading="scope.row.isLoading">设置轮播图</span> -->
                            <el-button class="btnClass" @click="oppenSetBanner(scope.row)"
                                :loading="scope.row.isLoading">设置轮播图</el-button>
                            <el-button class="btnClass1" @click="oppenGoodsInfoDialog(scope.row)"
                                :loading="scope.row.goodsInfoLoading">设置商品详情</el-button>

                            <el-button class="btnClass2" @click="oppenGoodsSku(scope.row)" :loading="scope.row.goodsSkuLoading">设置商品规格</el-button>
                        </div>
                        <div v-else>
                            暂无操作
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 新增商品对话框 -->
        <el-dialog v-model="dialogVisibleAddGoods" :title="tips" width="40%" class="addDialog">
            <el-form :model="addGoodsData" label-width="110px">
                <el-form-item label="商品名称">
                    <el-input v-model="addGoodsData.title" />
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-select v-model="addGoodsData.category_id" placeholder="请选择商品分类">
                        <el-option v-for="item in goodsCate" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="封面">
                    <selectImg v-model="addGoodsData.cover"></selectImg>
                </el-form-item>


                <el-form-item label="商品单位">
                    <el-input v-model="addGoodsData.unit" class="inputWidth" />
                </el-form-item>
                <el-form-item label="总库存">
                    <el-input v-model="addGoodsData.stock" class="inputWidth" type="number">

                    </el-input>
                </el-form-item>
                <el-form-item label="库存预警">
                    <el-input v-model="addGoodsData.min_stock" class="inputWidth" type="number">

                    </el-input>
                </el-form-item>

                <el-form-item label="原价格">
                    <el-input v-model="addGoodsData.min_oprice" class="inputWidth" type="number">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="活动价格">
                    <el-input v-model="addGoodsData.min_price" class="inputWidth" type="number">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="商品描述">
                    <el-input :rows="2" type="textarea" v-model="addGoodsData.desc" />
                </el-form-item>
                <el-form-item label="是否显示库存">
                    <el-radio-group v-model="addGoodsData.stock_display">
                        <el-radio :label="1" border>是</el-radio>
                        <el-radio :label="0" border>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否上架">
                    <el-radio-group v-model="addGoodsData.status">
                        <el-radio :label="1" border>是</el-radio>
                        <el-radio :label="0" border>否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddGoods = false">取消</el-button>
                    <el-button type="primary" @click="submitOk">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 轮播图插件 -->
        <goodsBanner ref="goodsBannerRef"></goodsBanner>
        <!-- 商品详情 -->
        <goodsInfo ref="goodsInfoRef"></goodsInfo>
        <!-- 视图层调用商品规格组件 -->     
        <goodsSku ref="goodsSkuRef"></goodsSku>
    </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import selectImg from '@/components/SelectImg.vue'
import { getGoodsListFn, getGoodsCateFn, addGoodsFn, editGoodsFn, setGoodsStatusFn, delAllGoodsFn, delOkFn, reSetFn } from '@/api/goods.js'
import { Search, Edit } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import goodsBanner from '@/components/Banner.vue'
import goodsInfo from '@/components/editGoodsInfo.vue'
import goodsSku from '@/components/GoodsSku.vue'

//批量删除
const delAllHandle = async () => {
    const isdel = await ElMessageBox.confirm(
        '是否删除？',
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
    const res = await delAllGoodsFn(goodsIds.value)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    getGoodsList()
}

//彻底删除
const delOk = async () => {
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

    const res = await delOkFn(goodsIds.value)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    getGoodsList()
}

//批量恢复
const resetHandle = async () => {
    const res = await reSetFn(goodsIds.value)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    getGoodsList()
    ElMessage({
        message: '批量恢复成功',
        type: 'success',
    })


}

//轮播图DOM元素
const goodsBannerRef = ref(null)
//商品详情DOM
const goodsInfoRef = ref(null)
const goodsSkuRef = ref(null)

//打开商品详情
const oppenGoodsInfoDialog = (row) => {
    //调用子组件方法的同时传入了一个实参
    goodsInfoRef.value.oppenGoodsInfo(row)

}

//打开设置商品规格
const oppenGoodsSku = (row) => {
    goodsSkuRef.value.openDialog(row)
}
//打开设置对话框
const oppenSetBanner = (row) => {
    goodsBannerRef.value.openDialog(row)
}



//table数据源（商品列表）
const tableData = ref([])
const page = ref(1)

//商品id数组
const goodsIds = ref([])

//table表格DOM元素
const tableRef = ref(null)
//选择事件
const selectGoods = (e) => {
    goodsIds.value = e.map(item => item.id)
}

//上架
const setGoodsStatus = async (status) => {
    const res = await setGoodsStatusFn(goodsIds.value, status)
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }

    ElMessage({
        message: '操作成功',
        type: 'success',
    })
    getGoodsList()

}

//查询参数
const queryData = reactive({
    //订单类型
    tab: 'all',
    //搜索关键字
    title: '',
    //分类id
    category_id: null,
    //商品个数
    limit: 5
})

//商品分类
const goodsCate = ref([])

//新增对话框
const dialogVisibleAddGoods = ref(false)

//对话框标题
const tips = ref('')
//打开新增对话框
const oppenAddDialog = () => {
    tips.value = '新增'
    addGoodsData.title = ''
    addGoodsData.category_id = null
    addGoodsData.cover = ''
    addGoodsData.unit = '件'
    addGoodsData.stock = 100
    addGoodsData.min_stock = 10
    addGoodsData.min_oprice = null
    addGoodsData.min_price = null
    addGoodsData.desc = ''
    addGoodsData.stock_display = 1
    addGoodsData.status = 1
    dialogVisibleAddGoods.value = true
}

//打开编辑对话框
const oppenEditDialog = (row) => {
    tips.value = '编辑'
    goodsId.value = row.id
    addGoodsData.title = row.title
    addGoodsData.category_id = row.category_id
    addGoodsData.cover = row.cover
    addGoodsData.unit = row.unit
    addGoodsData.stock = row.stock
    addGoodsData.min_stock = row.min_stock
    addGoodsData.min_oprice = row.min_oprice
    addGoodsData.min_price = row.min_price
    addGoodsData.desc = row.desc
    addGoodsData.stock_display = row.stock_display
    addGoodsData.status = row.status

    dialogVisibleAddGoods.value = true

}

//确定新增
const submitOk = async () => {
    if (tips.value == '新增') {
        const res = await addGoodsFn(addGoodsData)
        console.log(res)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        ElMessage({
            message: '新增成功',
            type: 'success',
        })
        dialogVisibleAddGoods.value = false
        getGoodsList()
    } else if (tips.value == '编辑') {
        const res = await editGoodsFn(goodsId.value, addGoodsData)
        console.log(res)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        ElMessage({
            message: '编辑成功',
            type: 'success',
        })
        dialogVisibleAddGoods.value = false
        getGoodsList()
    }
}

//新增商品数据源
const addGoodsData = reactive({
    title: '',
    category_id: null,
    cover: '',
    unit: '件',
    stock: 100,
    min_stock: 10,
    //原价格
    min_oprice: null,
    //活动价格
    min_price: null,
    desc: '',
    //是否显示库存
    stock_display: 1,
    //是否上架
    status: 1
})

//商品id
const goodsId = ref(0)

//获取商品列表
const getGoodsList = async () => {
    const res = await getGoodsListFn(page.value, queryData)
    //console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    //新增属性，为设置轮播图按钮绑定loading事件
    tableData.value = res.data.list.map(item => {
        item.isLoading = false
        item.goodsInfoLoading = false
        item.goodsSkuLoading=false
        return item
    })
}
getGoodsList()

//获取商品分类
const getGoodsCate = async () => {
    const res = await getGoodsCateFn()
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res)
    }
    goodsCate.value = res.data

}
getGoodsCate()


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
</style>