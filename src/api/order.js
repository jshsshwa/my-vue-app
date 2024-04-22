//订单管理
//导入axios
import request from '@/utils/request'

export const getOrderListFn = (page, params) => {
    return request({
        url: `admin/order/${page}`,
        method: 'GET',
        params

    })
}

//导出Excel订单

export const exportOrderList = (tab, starttime, endtime) => {
    return request({
        url: `admin/order/excelexport?tab=${tab}&starttime=${starttime}&endtime=${endtime}`,
        method: 'POST',
        responseType: 'blob'
    })
}

//查看物流信息
export const logisticsFn = (id) => {
    return request({
        url: `admin/order/${id}/get_ship_info`,
        method: 'GET'
    })
}

//同意退款、拒绝退款

export const refundFn = (id,data) => {
    return request({
        url:`admin/order/${id}/handle_refund`,
        method:'POST',
        data
    })

}

//发货
export const orderSenderFn=(id,data)=>{
    return request({
        url:`admin/order/${id}/ship`,
        method:'POST',
        data
    })
}


//批量删除订单
export const delOrders=(ids)=>{
    return request({
        url:'admin/order/delete_all',
        method:'POST',
        data:{
            ids
        }
    })
}
