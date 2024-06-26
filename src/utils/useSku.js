import {ElMessage} from 'element-plus';
import {nextTick, ref, computed} from 'vue';
import {addGoodsSkuFn, editGoodsSkuFn, delGoodsSkuFn, editSkuValFn, delSkuValFn, addSkuValFn} from '@/api/goods.js';
//當前商品ID
export const goodsId = ref(0);

//規格選項列表
export const skuList = ref([]);
//表格聯動
export const skuTable = ref([]);

//初始化規格選項列表
export function initSkuList(goodsInfo) {
    skuList.value = goodsInfo.goodsSkusCard.map((item) => {
        //追加一個text屬性
        item.text = item.name;
        item.goodsSkusCardValue.map((val) => {
            val.text = val.value || '屬性值';
            return val;
        });
        return item;
    });
    //表格聯動
    skuTable.value = goodsInfo.goodsSkus;

    console.log('所有商品資訊', goodsInfo);
    console.log('goodsSkusCard_skuList 追加一個text屬性', skuList.value);
    console.log('表格聯動goodsSkus_skuTable', skuTable.value);
}

//添加商品規格
export const addSku = async () => {
    const res = await addGoodsSkuFn({
        goods_id: goodsId.value,
        name: '規格名稱',
        order: 1,
        type: 0
    });
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return;
    }
    //添加成功追加到數組列表
    skuList.value.push({
        ...res.data,
        text: res.data.name,
        goodsSkusCardValue: []
    });
};

//修改商品規格
export const editSku = async (skuInfo) => {
    console.log(skuInfo);
    const res = await editGoodsSkuFn(skuInfo.id, {
        goods_id: skuInfo.goods_id,
        name: skuInfo.text,
        order: skuInfo.order,
        type: skuInfo.type
    });
    console.log(res);
    if (res.msg && res.msg !== 'ok') {
        return (skuInfo.text = skuInfo.name);
    }
    skuInfo.name = skuInfo.text;
    //修改成功彈框提示
    ElMessage({
        message: '規格名稱修改成功',
        type: 'success'
    });
};

//刪除商品規格
export const delSku = async (skuId) => {
    const res = await delGoodsSkuFn(skuId);
    if (res.msg && res.msg !== 'ok') {
        return;
    }
    //刪除成功
    ElMessage({
        message: '規格刪除成功',
        type: 'success'
    });
    //數組查索引方法
    const i = skuList.value.findIndex((o) => o.id == skuId);
    //判斷索引是否存在
    if (i !== -1) {
        skuList.value.splice(i, 1);
    }
    //重新獲規格表格數據
    getTableData();
};

//添加規格'標籤Tag'
export function initSkuItemVal(id) {
    //獲取到規格值對象
    const item = skuList.value.find((o) => o.id == id);

    const inputValue = ref('');
    const inputVisible = ref(false);
    const InputRef = ref();

    //刪除標籤值
    const handleClose = async (tag) => {
        //console.log(tag)
        const res = await delSkuValFn(tag.id);
        console.log('刪除標籤', res);
        if (res.msg && res.msg !== 'ok') {
            return;
        }
        item.goodsSkusCardValue.splice(item.goodsSkusCardValue.indexOf(tag), 1);
        //重新獲規格表格數據
        getTableData();
    };

    const showInput = () => {
        inputVisible.value = true;
        nextTick(() => {
            InputRef.value.input.focus();
        });
    };

    //新增商品標籤選項
    const handleInputConfirm = async () => {
        // 查找是否有 value 是否已存在
        const found = item.goodsSkusCardValue.some((item) => item.value === inputValue.value);
        if (found) {
            ElMessage({
                message: '標籤重複',
                type: 'error'
            });
            return;
        }

        const res = await addSkuValFn({
            goods_skus_card_id: id,
            name: item.name,
            order: 2,
            value: inputValue.value
        });
        console.log('新增商品標籤選項', res);
        if (res.msg && res.msg !== 'ok') {
            return;
        }
        item.goodsSkusCardValue.push({...res.data, text: inputValue.value});
        inputVisible.value = false;
        inputValue.value = '';
        console.log('新增商品標籤選項結果', item.goodsSkusCardValue);
        //重新獲規格表格數據
        getTableData();
    };
    //修改規格標籤
    const editSkuVal = async (val, tag) => {
        console.log(val);
        //val是最新值
        //tag是傳遞過來的對象
        const res = await editSkuValFn(tag.id, {
            goods_skus_card_id: tag.goods_skus_card_id,
            name: tag.name,
            order: tag.order,
            value: val
        });
        console.log(res);
        if (res.msg && res.msg !== 'ok') {
            return (tag.text = tag.value);
        }
        tag.value = val;
        //重新獲規格表格數據
        getTableData();
    };

    return {
        item,
        inputValue,
        inputVisible,
        InputRef,
        handleClose,
        showInput,
        handleInputConfirm,
        editSkuVal
    };
}

//初始化表格
export function initTable() {
    //將 goodsSkusCard 規格列表中，有選項值的篩選出來（goodsSkusCardValue）
    //只有規格名稱，沒有具體選項值的pass掉
    const isSkuVal = computed(() => skuList.value.filter((item) => item.goodsSkusCardValue.length > 0));
    //獲取表頭
    const tableTitle = computed(() => {
        let isSkuValLen = isSkuVal.value.length;

        //返回表頭相關信息
        return [
            {name: '商品規格', col: isSkuValLen, row: isSkuValLen > 0 ? 1 : 2},
            {name: '市場價', row: 2},
            {name: '銷售價', row: 2},
            {name: '成本價', row: 2},
            {name: '庫存', row: 2},
            {name: '商品體積', row: 2},
            {name: '商品重量', row: 2},
            {name: '編碼', row: 2}
        ];
    });

    return {
        isSkuVal,
        tableTitle,
        skuTable
    };
}

// sku排列算法
function skuChange() {
    return Array.prototype.reduce.call(
        arguments,
        function (a, b) {
            var ret = [];
            a.forEach(function (a) {
                b.forEach(function (b) {
                    ret.push(a.concat([b]));
                });
            });
            return ret;
        },
        [[]]
    );
}

//規格設置 隨著添加規格 連動變化
function getTableData() {
    setTimeout(() => {
        if (skuList.value.length == 0) return (skuTable.value = []);

        const list = skuList.value.map((item) => item.goodsSkusCardValue);

        //如果goodsSkusCardValue沒有值
        if (list.length == 0) return (skuTable.value = []);

        console.log('skuList', skuList.value);
        console.log('做sku排列前', list);

        //做sku排列,排列之後的數據給arr
        let arr = skuChange(...list);
        console.log('做sku排列後', arr);

        console.log('原始skuTable', skuTable.value);
        // 獲取之前的規格列表skus，將規格id排序之後轉化成字符串 skusId: "1370,1378"
        let beforeSkuList = JSON.parse(JSON.stringify(skuTable.value)).map((o) => {
            if (!Array.isArray(o.skus)) {
                o.skus = Object.keys(o.skus).map((k) => o.skus[k]);
            }
            o.skusId = o.skus
                .sort((a, b) => a.id - b.id)
                .map((s) => s.id)
                .join(',');
            return o;
        });
        console.log('beforeSkuList', beforeSkuList);

        skuTable.value = [];
        skuTable.value = arr.map((skus) => {
            //在賦值之前判斷之前有沒有對象
            //先將skus進行排序，拼接id
            let o = skuCompare(JSON.parse(JSON.stringify(skus)), beforeSkuList);

            return {
                skus: skus,
                code: o?.code || '',
                cprice: o?.cprice || '0.00',
                goods_id: goodsId.value,
                image: o?.image || '',
                oprice: o?.oprice || '0.00',
                pprice: o?.pprice || '0.00',
                stock: o?.stock || 0,
                volume: o?.volume || 0,
                weight: o?.weight || 0
            };
        });
        console.log('整理後的skuTable', skuTable.value);
    }, 500);
}

//傳入新的skus（排列好之後的skus）和之前的

function skuCompare(skus, beforeSkuList) {
    //skus為新傳入的規格
    //為新skus進行排序，拼接成字符串，定義變量接收
    let skusId = skus
        .sort((a, b) => a.id - b.id)
        .map((s) => s.id)
        .join(',');
    //找到了通過return返回
    return beforeSkuList.find((o) => {
        //拿到之前數組的每個對象
        //匹配方式是誰的值多誰就包含誰
        //如果新的skus長度大於之前的skus長度
        if (skus.length > o.skus.length) {
            //看看新的有沒有包含老的
            //！==-1説明包含，匹配到了
            return skusId.indexOf(o.skusId) != -1;
        }
        //否則就是老的包含新的
        return o.skusId.indexOf(skusId) != -1;
    });
}
