//导入axios
import request from '@/utils/request'
//获取规格列表
export const getSkusFn=(page)=>{
    return request({
        url:`admin/skus/${page}`,
        method:'GET'
    })
}

//增加商品规格
export const addSkusFn=(data)=>{
    return request({
        url:'admin/skus',
        method:'POST',
        data
    })
}

//修改启用状态
export const editStatus=(id,status)=>{
    return request({
        url:`admin/skus/${id}/update_status`,
        method:'POST',
        data:{
            status
        }
    })
}

//编辑规格
export const editSkuFn=(id,data)=>{
    return request({
        url:`admin/skus/${id}`,
        method:'POST',
        data
    })
}

//批量删除规格
export const delSkuFn=(ids)=>{
    return request({
        url:'admin/skus/delete_all',
        method:'POST',
        data:{
            ids
        }
    })
}