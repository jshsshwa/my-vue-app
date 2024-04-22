//导入axios
import request from '@/utils/request'
//获取后台统计面板
export const getAdminInfo=()=>{
    return request({
        url:'admin/orderState',
        method:'GET'
    })
}

//获取echarts图表数据
export const getEchartsData=(type)=>{
    return request({
        url:'admin/echartsData',
        method:'GET',
        params:{
            type
        }
    })
}

//店铺提示数据
export const getGoodsState=()=>{
    return request({
        url:'admin/goodsState',
        method:'GET'
    })
}