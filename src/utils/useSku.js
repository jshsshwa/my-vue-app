import { ElMessage } from 'element-plus'
import { nextTick, ref, computed } from 'vue'
import { addGoodsSkuFn, editGoodsSkuFn, delGoodsSkuFn, editSkuValFn, delSkuValFn, addSkuValFn } from '@/api/goods.js'
//当前商品ID
export const goodsId = ref(0)

//规格选项列表
export const skuList = ref([])

export const skuTable = ref([])

//初始化规格选项列表
export function initSkuList(goodsInfo) {
    console.log(goodsInfo)
    skuList.value = goodsInfo.goodsSkusCard.map(item => {
        //追加一个text属性
        item.text = item.name
        item.goodsSkusCardValue.map(val => {
            val.text = val.value || '属性值'
            return val
        })
        return item
    })
    //表格联动
    skuTable.value = goodsInfo.goodsSkus
    console.log(skuTable.value)
}


//添加商品规格
export const addSku = async () => {
    const res = await addGoodsSkuFn({
        goods_id: goodsId.value,
        name: '规格名称',
        order: 1,
        type: 0
    })
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return
    }
    //添加成功追加到数组列表
    skuList.value.push({
        ...res.data,
        text: res.data.name,
        goodsSkusCardValue: []
    })
}

//修改商品规格
export const editSku = async (skuInfo) => {
    console.log(skuInfo)
    const res = await editGoodsSkuFn(skuInfo.id, {
        goods_id: skuInfo.goods_id,
        name: skuInfo.text,
        order: skuInfo.order,
        type: skuInfo.type
    })
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return skuInfo.text = skuInfo.name
    }
    skuInfo.name = skuInfo.text
    //修改成功弹框提示
    ElMessage({
        message: '规格名称修改成功',
        type: 'success',
    })
}

//删除商品规格
export const delSku = async (skuId) => {
    const res = await delGoodsSkuFn(skuId)
    if (res.msg && res.msg !== 'ok') {
        return
    }
    //删除成功
    ElMessage({
        message: '规格删除成功',
        type: 'success',
    })
    //数组查索引方法
    const i = skuList.value.findIndex(o => o.id == skuId)
    //判断索引是否存在
    if (i !== -1) {
        skuList.value.splice(i, 1)
    }
    //重新获规格表格数据
    getTableData()
}

//初始化规格值
export function initSkuItemVal(id) {
    //获取到规格值对象
    const item = skuList.value.find(o => o.id == id)
    //star
    const inputValue = ref('')
    const inputVisible = ref(false)
    const InputRef = ref()

    const handleClose = async (tag) => {
        //console.log(tag)        
        const res = await delSkuValFn(tag.id)
        console.log(res)
        if (res.msg && res.msg !== 'ok') {
            return
        }
        item.goodsSkusCardValue.splice(item.goodsSkusCardValue.indexOf(tag), 1)
        //重新获规格表格数据
        getTableData()
    }

    const showInput = () => {
        inputVisible.value = true
        nextTick(() => {
            InputRef.value.input.focus()
        })
    }

    const handleInputConfirm = async () => {
        const res = await addSkuValFn({
            goods_skus_card_id: id,
            name: item.name,
            order: 2,
            value: inputValue.value
        })
        console.log(res)
        if (res.msg && res.msg !== 'ok') {
            return
        }
        item.goodsSkusCardValue.push({ ...res.data, text: inputValue.value })
        inputVisible.value = false
        inputValue.value = ''
        //重新获规格表格数据
        getTableData()
    }
    //修改规格值
    const editSkuVal = async (val, tag) => {
        console.log(val)
        //val是最新值
        //tag是传递过来的对象
        const res = await editSkuValFn(tag.id, {
            goods_skus_card_id: tag.goods_skus_card_id,
            name: tag.name,
            order: tag.order,
            value: val
        })
        console.log(res)
        if (res.msg && res.msg !== 'ok') {
            return tag.text = tag.value
        }
        tag.value = val
        //重新获规格表格数据
        getTableData()
    }

    //删除规格值


    //end
    return {
        item,
        inputValue,
        inputVisible,
        InputRef,
        handleClose,
        showInput,
        handleInputConfirm,
        editSkuVal
    }
}

//初始化表格
export function initTable() {
    //将 goodsSkusCard 规格列表中，有选项值的筛选出来（goodsSkusCardValue）
    //只有规格名称，没有具体选项值的pass掉
    const isSkuVal = computed(() => skuList.value.filter(item => item.goodsSkusCardValue.length > 0))
    //获取表头
    const tableTitle = computed(() => {
        let isSkuValLen = isSkuVal.value.length

        //返回表头相关信息
        return [
            { name: '商品规格', col: isSkuValLen, row: isSkuValLen > 0 ? 1 : 2 },
            { name: '市场价', row: 2 },
            { name: '销售价', row: 2 },
            { name: '成本价', row: 2 },
            { name: '库存', row: 2 },
            { name: '商品体积', row: 2 },
            { name: '商品重量', row: 2 },
            { name: '编码', row: 2 }
        ]
    })

    return {
        isSkuVal,
        tableTitle,
        skuTable
    }
}


// sku排列算法
function skuChange() {
    return Array.prototype.reduce.call(arguments, function (a, b) {
        var ret = [];
        a.forEach(function (a) {
            b.forEach(function (b) {
                ret.push(a.concat([b]));
            });
        });
        return ret;
    }, [
        []
    ]);
}


//获取 规格表格数据
function getTableData() {
    setTimeout(() => {
        if (skuList.value.length == 0) return skuTable.value = []
        let list = []
        skuList.value.forEach(o => {
            if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
                list.push(o.goodsSkusCardValue)
            }
        })
        //如果goodsSkusCardValue没有值
        if (list.length == 0) {
            return skuTable.value = []
        }
        // let arr = cartesianProductOf(...list)

        //做sku排列,排列之后的数据给arr
        let arr = skuChange(...list)
        console.log(arr)
        //把转化之后的值赋值给 skuTable
        //skuTable.value=
        //o是数组

        // //获取之前的规格列表,将规格ID排序之后转化成字符串
        // let beforeSkuList=JSON.parse(JSON.stringify(skuTable.value)).map(o=>{
        //     //为goodsSkus数组中每一项添加skusId属性
        //     //skusId属性值是skus数组中的id
        //     //o.skusId=
        //     if(!Array.isArray(o.skus)){
        //         //如果o.skus不是数组（默认不是）
        //         //转成数组
        //         //Object.keys是拿到对象里面的key（0,1）并组成数组[0,1]
        //         o.skus = Object.keys(o.skus).map(k=>o.skus[k])
        //         //转成数组之后，调用数组sort方法为skus进行排序
        //         //排好序之后调用map方法获取id [290,280]
        //         //将数组转成字符串拼接格式调用join
        //         //最后追加skusId属性并返回
        //         //此时每个对象中都包含skusId  值就是 skus对象中的id
        //         o.skusId = o.skus.sort((a,b)=>a.id - b.id).map(s=>s.id).join(",")
        //         return o
        //     }
        // })

        // 获取之前的规格列表，将规格ID排序之后转化成字符串
        let beforeSkuList = JSON.parse(JSON.stringify(skuTable.value)).map(o => {
            if (!Array.isArray(o.skus)) {
                o.skus = Object.keys(o.skus).map(k => o.skus[k])
            }
            o.skusId = o.skus.sort((a, b) => a.id - b.id).map(s => s.id).join(",")
            return o
        })

        skuTable.value = []
        skuTable.value = arr.map(skus => {

            //在赋值之前判断之前有没有对象
            //先将skus进行排序，拼接id
            let o = skuCompare(JSON.parse(JSON.stringify(skus)), beforeSkuList)

            return {
                skus: skus,
                code: o?.code || "",
                cprice: o?.cprice || "0.00",
                goods_id: goodsId.value,
                image: o?.image || "",
                oprice: o?.oprice || "0.00",
                pprice: o?.pprice || "0.00",
                stock: o?.stock || 0,
                volume: o?.volume || 0,
                weight: o?.weight || 0
            }
        })
    }, 500);
}

//传入新的skus（排列好之后的skus）和之前的

function skuCompare(skus, beforeSkuList) {
    //skus为新传入的规格
    //为新skus进行排序，拼接成字符串，定义变量接收
    let skusId = skus.sort((a, b) => a.id - b.id).map(s => s.id).join(",")
    //找到了通过return返回
    return beforeSkuList.find(o => {
        //拿到之前数组的每个对象
        //匹配方式是谁的值多谁就包含谁
        //如果新的skus长度大于之前的skus长度
        if (skus.length > o.skus.length) {
            //看看新的有没有包含老的
            //！==-1说明包含，匹配到了
            return skusId.indexOf(o.skusId) != -1
        }
        //否则就是老的包含新的
        return o.skusId.indexOf(skusId) != -1
    })
}