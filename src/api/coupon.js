//优惠券API
//导入axios
import request from '@/utils/request'

//获取优惠券列表
export const getCouponListFn=(page)=>{
    return request({
        url:`admin/coupon/${page}`,
        method:'GET'
    })
}
//新增优惠券
export const addCouponFn=(data)=>{
    return request({
        url:'admin/coupon',
        method:'POST',
        data
    })
}
//编辑
export const editCouponFn=(id,data)=>{
    return request({
        url:`admin/coupon/${id}`,
        method:'POST',
        data
    })
}

//删除 
export const delCouponFn=(id)=>{
    return request({
        url:`admin/coupon/${id}/delete`,
        method:'POST'
    })
}

//优惠券失效
export const endCouponFn=(id)=>{
    return request({
        url:`admin/coupon/${id}/update_status`,
        method:'POST',
        data:{
            status:0
        }
    })
}