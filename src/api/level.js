//导入axios
import request from '@/utils/request'

//获取会员等级列表
export const getLevelListFn=(page)=>{
    return request({
        url:`admin/user_level/${page}`,
        method:'GET'
    })
}

//新增会员等级
export const addLevelFn=(data)=>{
    return request({
        url:'admin/user_level',
        method:'POST',
        data
    })
}

//修改会员等级
export const editLevelFn=(id,data)=>{
    return request({
        url:`admin/user_level/${id}`,
        method:'POST',
        data
    })
}

//删除会员等级
export const delLevelFn=(id)=>{
    return request({
        url:`admin/user_level/${id}/delete`,
        method:'POST'
    })
}

//修改会员等级状态
export const editLevelStatus=(id,status)=>{
    return request({
        url:`admin/user_level/${id}/update_status`,
        method:'POST',
        data:{
            status
        }
    })
}