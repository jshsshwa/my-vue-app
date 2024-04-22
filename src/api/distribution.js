//分销API
//导入axios
import request from '@/utils/request'

//获取分销数据统计
export const getDisDataFn=()=>{
    return request({
        url:'admin/agent/statistics',
        method:'GET'
    })
}

//获取分销推广员列表
export const getDisListFn=(page,params)=>{
    return request({
        url:`admin/agent/${page}`,
        method:'GET',
        params
    })
}

//推广订单
export const disOrderFn=(page,params)=>{
    return request({
        url:`admin/user_bill/${page}`,
        method:'GET',
        params
    })
}


//修改分享配置
export const editDisSettingFn=(data)=>{
    return request({
        url:'admin/distribution_setting/set',
        method:'POST',
        data
    })
}

//获取分销设置
export const getDisSettingFn=()=>{
    return request({
        url:'admin/distribution_setting/get',
        method:'GET'
    })
}