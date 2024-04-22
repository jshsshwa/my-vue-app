//导入axios
import request from '@/utils/request'

//获取用户列表
export const getUserListFn=(page,params)=>{
    return request({
        url:`admin/user/${page}`,
        method:'GET',
        params
    })
}

//增加用户
export const addUserFn=(data)=>{
    return request({
        url:`admin/user`,
        method:'POST',
        data
    })
}

//修改用户
export const editUserFn=(id,data)=>{
    return request({
        url:`admin/user/${id}`,
        method:'POST',
        data
    })
}

//删除用户
export const delUserFn=(id)=>{
    return request({
        url:`admin/user/${id}/delete`,
        method:'POST'
    })
}

//修改状态
export const editUserStatus=(id,status)=>{
    return request({
        url:`admin/user/${id}/update_status`,
        method:'POST',
        data:{
            status
        }
    })
}