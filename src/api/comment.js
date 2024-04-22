//评论
//导入axios
import request from '@/utils/request'

//获取商品评论列表
export const getCommentListFn=(page,params)=>{
    return request({
        url:`admin/goods_comment/${page}`,
        method:'GET',
        params
    })
}

//修改商品评价状态
export const editCommentStatusFn=(id,status)=>{
    return request({
        url:`admin/goods_comment/${id}/update_status`,
        method:'POST',
        data:{
            status
        }
    })
}

//回复(修改)用户评论
export const setCommentFn=(id,data)=>{
    return request({
        url:`admin/goods_comment/review/${id}`,
        method:'POST',
        data
    })
}