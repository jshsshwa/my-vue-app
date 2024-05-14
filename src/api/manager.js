//管理員相關API
//導入axios
import request from '@/utils/request'

//獲取管理員列表
export const getManagerList=(page,limit,keyword)=>{
    return request({
        url:`admin/manager/${page}`,
        method:'GET',
        params:{
            limit,
            keyword
        }
    })
}

//修改管理員狀態
export const editState=(id,status)=>{
    return request({
        url:`admin/manager/${id}/update_status`,
        method:'POST',
        data:{
            status
        }
    })
}

//新增管理員
export const addManager=(data)=>{
    return request({
        url:`admin/manager`,
        method:'POST',
        data
    })
}

//修改管理員
export const editManager=(id,data)=>{
    return request({
        url:`admin/manager/${id}`,
        method:'POST',
        data
    })
}
//刪除管理員
export const delManager=(id)=>{
    return request({
        url:`admin/manager/${id}/delete`,
        method:'POST'        
    })
}