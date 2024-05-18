<!--  -->
<template>
    <div>
        <el-card>
            <el-tabs v-model="queryData.tab" @tab-change="getGoodsList">
                <el-tab-pane label="全部" name="all"></el-tab-pane>
                <el-tab-pane label="審核中" name="checking"></el-tab-pane>
                <el-tab-pane label="出售中" name="saling"></el-tab-pane>
                <el-tab-pane label="已下架" name="off"></el-tab-pane>
                <el-tab-pane label="庫存預警" name="min_stock"></el-tab-pane>
                <el-tab-pane label="回收站" name="delete"></el-tab-pane>
            </el-tabs>
            <el-row :gutter="30">
                <el-col :span="10">
                    <el-input placeholder="請輸入商品名稱" clearable v-model="queryData.title" @clear="getGoodsList">
                        <template #prepend>
                            <el-select v-model="queryData.category_id" clearable placeholder="請選擇商品分類" style="width: 145px">
                                <el-option :label="item.name" :value="item.id" v-for="item in goodsCate" :key="item.id" />
                            </el-select>
                        </template>
                        <template #append>
                            <el-button :icon="Search" @click="getGoodsList" />
                        </template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px">
                <el-col>
                    <el-button type="primary" size="small" @click="oppenAddDialog">新增商品</el-button>
                    <el-button type="danger" size="small" @click="delAllHandle" v-if="queryData.tab !== 'delete'">批量刪除</el-button>
                    <el-button size="small" v-if="queryData.tab == 'delete'" type="warning" @click="resetHandle">批量恢復</el-button>
                    <el-button size="small" v-if="queryData.tab == 'delete'" type="danger" @click="delOk">徹底刪除</el-button>
                    <el-button plain size="small" @click="setGoodsStatus(1)" v-if="queryData.tab == 'all' || queryData.tab == 'off'"
                        >上架</el-button
                    >
                    <el-button plain size="small" @click="setGoodsStatus(0)" v-if="queryData.tab == 'all' || queryData.tab == 'saling'"
                        >下架</el-button
                    >
                </el-col>
            </el-row>
            <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" ref="tableRef" @selection-change="selectGoods">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品信息" width="300">
                    <template #default="scope">
                        <div class="goodsTitle">
                            <el-avatar shape="square" :size="80" fit="cover" :src="scope.row.cover" />

                            <h1>{{ scope.row.title }}</h1>
                            <span style="color: red">￥{{ scope.row.min_price }}</span>
                            <span>分類：{{ scope.row.category ? scope.row.category.name : '未分類' }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="商品狀態">
                    <template #default="scope">
                        <div>
                            <el-tag type="warning" v-if="scope.row.status == 1">銷售中</el-tag>
                            <el-tag type="info" v-else>已下架</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="審核狀態" v-if="queryData.tab !== 'delete'">
                    <template #default="scope">
                        <!-- 
                            ischeck==0表示未審核
                            1表示通過
                            2表示拒絕
                                                                                                             -->
                        <div v-if="scope.row.ischeck == 0">
                            <el-tag type="success" class="tag2">通過</el-tag>
                            <el-tag type="info">拒絕</el-tag>
                        </div>
                        <div v-else>
                            <el-tag type="success" class="tag2" v-if="scope.row.ischeck == 1">通過</el-tag>
                            <el-tag type="info" v-if="scope.row.ischeck == 2">拒絕</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="stock" label="庫存" />
                <el-table-column label="操作" width="380">
                    <template #default="scope">
                        <div v-if="queryData.tab !== 'delete'" class="editClass">
                            <el-button type="primary" :icon="Edit" size="small" @click="oppenEditDialog(scope.row)" />
                            <!-- <span class="btnClass" @click="oppenSetBanner(scope.row)" :loading="scope.row.isLoading">設置輪播圖</span> -->
                            <el-button class="btnClass" @click="oppenSetBanner(scope.row)" :loading="scope.row.isLoading"
                                >設置輪播圖</el-button
                            >
                            <el-button class="btnClass1" @click="oppenGoodsInfoDialog(scope.row)" :loading="scope.row.goodsInfoLoading"
                                >設置商品詳情</el-button
                            >

                            <el-button class="btnClass2" @click="oppenGoodsSku(scope.row)" :loading="scope.row.goodsSkuLoading"
                                >設置商品規格</el-button
                            >
                        </div>
                        <div v-else>暫無操作</div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 新增商品對話框 -->
        <el-dialog v-model="dialogVisibleAddGoods" :title="tips" width="40%" class="addDialog">
            <el-form :model="addGoodsData" label-width="110px">
                <el-form-item label="商品名稱">
                    <el-input v-model="addGoodsData.title" />
                </el-form-item>
                <el-form-item label="商品分類">
                    <el-select v-model="addGoodsData.category_id" placeholder="請選擇商品分類">
                        <el-option v-for="item in goodsCate" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="封面">
                    <selectImg v-model="addGoodsData.cover"></selectImg>
                </el-form-item>

                <el-form-item label="商品單位">
                    <el-input v-model="addGoodsData.unit" class="inputWidth" />
                </el-form-item>
                <el-form-item label="總庫存">
                    <el-input v-model="addGoodsData.stock" class="inputWidth" type="number"> </el-input>
                </el-form-item>
                <el-form-item label="庫存預警">
                    <el-input v-model="addGoodsData.min_stock" class="inputWidth" type="number"> </el-input>
                </el-form-item>

                <el-form-item label="原價格">
                    <el-input v-model="addGoodsData.min_oprice" class="inputWidth" type="number">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="活動價格">
                    <el-input v-model="addGoodsData.min_price" class="inputWidth" type="number">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="商品描述">
                    <el-input :rows="2" type="textarea" v-model="addGoodsData.desc" />
                </el-form-item>
                <el-form-item label="是否顯示庫存">
                    <el-radio-group v-model="addGoodsData.stock_display">
                        <el-radio :value="1" border>是</el-radio>
                        <el-radio :value="0" border>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否上架">
                    <el-radio-group v-model="addGoodsData.status">
                        <el-radio :value="1" border>是</el-radio>
                        <el-radio :value="0" border>否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddGoods = false">取消</el-button>
                    <el-button type="primary" @click="submitOk"> 確定 </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 輪播圖插件 -->
        <goodsBanner ref="goodsBannerRef"></goodsBanner>
        <!-- 商品詳情 -->
        <goodsInfo ref="goodsInfoRef"></goodsInfo>
        <!-- 視圖層調用商品規格組件 -->
        <goodsSku ref="goodsSkuRef"></goodsSku>
    </div>
</template>

<script setup>
import {ElMessage, ElMessageBox} from 'element-plus';
import selectImg from '@/components/SelectImg.vue';
import {getGoodsListFn, getGoodsCateFn, addGoodsFn, editGoodsFn, setGoodsStatusFn, delAllGoodsFn, delOkFn, reSetFn} from '@/api/goods.js';
import {Search, Edit} from '@element-plus/icons-vue';
import {reactive, ref} from 'vue';
import goodsBanner from '@/components/Banner.vue';
import goodsInfo from '@/components/editGoodsInfo.vue';
import goodsSku from '@/components/GoodsSku.vue';

//定義參數
//商品id
const goodsId = ref(0);

//商品分類
const goodsCate = ref([]);

//新增對話框
const dialogVisibleAddGoods = ref(false);

//對話框標題
const tips = ref('');

//table數據源（商品列表）
const tableData = ref([]);
const page = ref(1);

//商品id數組
const goodsIds = ref([]);

//table表格DOM元素
const tableRef = ref(null);
//輪播圖DOM元素
const goodsBannerRef = ref(null);
//商品詳情DOM
const goodsInfoRef = ref(null);
const goodsSkuRef = ref(null);

//查詢參數
const queryData = reactive({
    //訂單類型
    tab: 'all',
    //搜索關鍵字
    title: '',
    //分類id
    category_id: null,
    //商品個數
    limit: 5
});

//新增商品數據源
const addGoodsData = reactive({
    title: '',
    category_id: null,
    cover: '',
    unit: '件',
    stock: 100,
    min_stock: 10,
    //原價格
    min_oprice: null,
    //活動價格
    min_price: null,
    desc: '',
    //是否顯示庫存
    stock_display: 1,
    //是否上架
    status: 1
});

//獲取商品列表
const getGoodsList = async () => {
    const res = await getGoodsListFn(page.value, queryData);
    //console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    //新增屬性，為設置輪播圖按鈕綁定loading事件
    tableData.value = res.data.list.map((item) => {
        item.isLoading = false;
        item.goodsInfoLoading = false;
        item.goodsSkuLoading = false;
        return item;
    });
};
getGoodsList();

//獲取商品分類
const getGoodsCate = async () => {
    const res = await getGoodsCateFn();
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res);
    }
    goodsCate.value = res.data;
};
getGoodsCate();

//批量刪除
const delAllHandle = async () => {
    const isdel = await ElMessageBox.confirm('是否刪除？', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
    }).catch((err) => err);
    console.log(isdel);
    if (isdel !== 'confirm') {
        return;
    }
    const res = await delAllGoodsFn(goodsIds.value);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    getGoodsList();
};

//徹底刪除
const delOk = async () => {
    const isdel = await ElMessageBox.confirm('是否刪除?', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
    }).catch((err) => err);
    console.log(isdel);
    if (isdel !== 'confirm') {
        return;
    }

    const res = await delOkFn(goodsIds.value);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    getGoodsList();
};

//批量恢復
const resetHandle = async () => {
    const res = await reSetFn(goodsIds.value);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }
    getGoodsList();
    ElMessage({
        message: '批量恢復成功',
        type: 'success'
    });
};

//打開商品詳情
const oppenGoodsInfoDialog = (row) => {
    //調用子組件方法的同時傳入了一個實參
    goodsInfoRef.value.oppenGoodsInfo(row);
};

//打開設置商品規格
const oppenGoodsSku = (row) => {
    goodsSkuRef.value.openDialog(row);
};
//打開設置對話框
const oppenSetBanner = (row) => {
    goodsBannerRef.value.openDialog(row);
};

//選擇事件
const selectGoods = (e) => {
    goodsIds.value = e.map((item) => item.id);
};

//上架
const setGoodsStatus = async (status) => {
    const res = await setGoodsStatusFn(goodsIds.value, status);
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg);
    }

    ElMessage({
        message: '操作成功',
        type: 'success'
    });
    getGoodsList();
};

//打開新增對話框
const oppenAddDialog = () => {
    tips.value = '新增';
    addGoodsData.title = '';
    addGoodsData.category_id = null;
    addGoodsData.cover = '';
    addGoodsData.unit = '件';
    addGoodsData.stock = 100;
    addGoodsData.min_stock = 10;
    addGoodsData.min_oprice = null;
    addGoodsData.min_price = null;
    addGoodsData.desc = '';
    addGoodsData.stock_display = 1;
    addGoodsData.status = 1;
    dialogVisibleAddGoods.value = true;
};

//打開編輯對話框
const oppenEditDialog = (row) => {
    tips.value = '編輯';
    goodsId.value = row.id;
    addGoodsData.title = row.title;
    addGoodsData.category_id = row.category_id;
    addGoodsData.cover = row.cover;
    addGoodsData.unit = row.unit;
    addGoodsData.stock = row.stock;
    addGoodsData.min_stock = row.min_stock;
    addGoodsData.min_oprice = row.min_oprice;
    addGoodsData.min_price = row.min_price;
    addGoodsData.desc = row.desc;
    addGoodsData.stock_display = row.stock_display;
    addGoodsData.status = row.status;

    dialogVisibleAddGoods.value = true;
};

//確定新增
const submitOk = async () => {
    if (tips.value == '新增') {
        const res = await addGoodsFn(addGoodsData);
        console.log(res);
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg);
        }
        ElMessage({
            message: '新增成功',
            type: 'success'
        });
        dialogVisibleAddGoods.value = false;
        getGoodsList();
    } else if (tips.value == '編輯') {
        const res = await editGoodsFn(goodsId.value, addGoodsData);
        console.log(res);
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg);
        }
        ElMessage({
            message: '編輯成功',
            type: 'success'
        });
        dialogVisibleAddGoods.value = false;
        getGoodsList();
    }
};

</script>

<style lang="less" scoped>
.el-card {
    margin-top: 20px;
}

.el-table {
    margin-top: 20px;
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
        padding: 0px;
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
    border: none;
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
    border: none;
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
    border: none;
}
</style>
