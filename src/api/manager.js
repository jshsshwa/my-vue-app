//管理员相关API
//导入axios
import request from '@/utils/request'

//获取管理员列表
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

//修改管理员状态
export const editState=(id,status)=>{
    return request({
        url:`admin/manager/${id}/update_status`,
        method:'POST',
        data:{
            status
        }
    })
}

//新增管理员
export const addManager=(data)=>{
    return request({
        url:`admin/manager`,
        method:'POST',
        data
    })
}

//修改管理员
export const editManager=(id,data)=>{
    return request({
        url:`admin/manager/${id}`,
        method:'POST',
        data
    })
}
//删除管理员
export const delManager=(id)=>{
    return request({
        url:`admin/manager/${id}/delete`,
        method:'POST'        
    })
}