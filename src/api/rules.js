//菜单权限
//导入axios
import request from '@/utils/request'

//获取菜单权限列表
export const getRulesListFn=()=>{
    return request({
        url:'admin/rule/1',
        method:'GET'
    })
}

//新增菜单权限
export const addRulesFn=(data)=>{
    return request({
        url:'admin/rule',
        method:'POST',
        data
    })
} 

//编辑API
export const editRulesFn=(id,data)=>{
    return request({
        url:`admin/rule/${id}`,
        method:'POST',
        data
    })
}

//修改是否启用状态
export const editStatusFn=(id,status)=>{
    return request({
        url:`admin/rule/${id}/update_status`,
        method:'POST',
        data:{
            status
        }
    })
}

//删除权限
export const delRulesFn=(id)=>{
    return request({
        url:`admin/rule/${id}/delete`,
        method:'POST'
    })
}