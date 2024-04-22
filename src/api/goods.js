//导入axios
import request from '@/utils/request'

//获取商品列表
export const getGoodsListFn=(page,params)=>{
    return request({
        url:`admin/goods/${page}`,
        method:'GET',
        params      
    })
}
//获取商品分类
export const getGoodsCateFn=()=>{
    return request({
        url:'admin/category',
        method:'GET'
    })
}

//新增商品
export const addGoodsFn=(data)=>{
    return request({
        url:'admin/goods',
        method:'POST',
        data
    })
}
//编辑商品
export const editGoodsFn=(id,data)=>{
    return request({
        url:`admin/goods/${id}`,
        method:'POST',
        data
    })
}

//批量上架/下架
export const setGoodsStatusFn=(ids,status)=>{
    return request({
        url:'admin/goods/changestatus',
        method:'POST',
        data:{
            ids,
            status
        }
    })
}

//根据ID获取商品信息（轮播图）
export const getGoodsInfoById=(id)=>{
    return request({
        url:`admin/goods/read/${id}`,
        method:'GET'
    })
}

//设置商品轮播图
export const setGoodsBanner=(id,data)=>{
    return request({
        url:`admin/goods/banners/${id}`,
        method:'POST',
        data
    })
}

//更新商品规格
export const editStuFn=(id,data)=>{
    return request({
        url:`admin/goods/updateskus/${id}`,
        method:'POST',
        data
    })
}

//添加商品规格
export const addGoodsSkuFn=(data)=>{
    return request({
        url:'admin/goods_skus_card',
        method:'POST',
        data
    })
}

//修改商品规格
export const editGoodsSkuFn=(id,data)=>{
    return request({
        url:`admin/goods_skus_card/${id}`,
        method:'POST',
        data
    })
}

//删除商品规格
export const delGoodsSkuFn=(id)=>{
    return request({
        url:`admin/goods_skus_card/${id}/delete`,
        method:'POST',
    })
}

//修改规格 值
export const editSkuValFn=(id,data)=>{
    return request({
        url:`admin/goods_skus_card_value/${id}`,
        method:'POST',
        data
    })
}

//删除规格 值

export const delSkuValFn=(id)=>{
    return request({
        url:`admin/goods_skus_card_value/${id}/delete`,
        method:'POST'
    })
}

//添加商品规格选项值
export const addSkuValFn=(data)=>{
    return request({
        url:'admin/goods_skus_card_value',
        method:'POST',
        data
    })
}

//批量删除商品（进回收站）
export const delAllGoodsFn=(ids)=>{
    return request({
        url:'admin/goods/delete_all',
        method:'POST',
        data:{
            ids
        }
    })
}

//彻底删除商品
export const delOkFn=(ids)=>{
    return request({
        url:'admin/goods/destroy',
        method:'POST',
        data:{
            ids
        }
    })
}

//批量恢复
export const reSetFn=(ids)=>{
    return request({
        url:`admin/goods/restore`,
        method:'POST',
        data:{
            ids
        }
    })
}

