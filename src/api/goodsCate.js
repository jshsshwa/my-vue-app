//导入axios
import request from '@/utils/request'

//获取商品分类列表
export const getGoodsCateFn=()=>{
    return request({
        url:'admin/category',
        method:'GET'
    })
}


//新增商品分类
export const addGoodsCateFn=(name)=>{
    return request({
        url:'admin/category',
        method:'POST',
        data:{
            name
        }
    })
}

//编辑商品分类
export const editGoodsCateFn=(id,name)=>{
    return request({
        url:`admin/category/${id}`,
        method:'POST',
        data:{
            name
        }
    })
}

//编辑商品分类状态
export const editGoodsCateStatus=(id,status)=>{
    return request({
        url:`admin/category/${id}/update_status`,
        method:'POST',
        data:{
            status
        }
    })
}

//删除商品分类
export const delEditGoodsCate=(id)=>{
    return request({
        url:`admin/category/${id}/delete`,
        method:'POST'
    })
}