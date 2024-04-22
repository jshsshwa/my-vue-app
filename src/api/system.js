//系统设置
//导入axios
import request from '@/utils/request'

//获取系统设置
export const getSystemConfigFn = () => {
    return request({
        url: 'admin/sysconfig',
        method: 'GET'
    })
}

//修改系统设置
export const editSystemConfigFn = (data) => {
    return request({
        url:'admin/sysconfig',
        method:'POST',
        data
    })

}