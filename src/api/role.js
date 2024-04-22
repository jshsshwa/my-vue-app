//角色api
//导入axios
import request from '@/utils/request'
//获取角色列表
export const getRolesListFn = (page) => {
    return request({
        url: `admin/role/${page}`,
        method: 'GET'
    })
}
//新增角色
export const addRolesFn=(data)=>{
    return request({
        url:'admin/role',
        method:'POST',
        data
    })
}
//删除角色
export const delRolesFn=(id)=>{
    return request({
        url:`admin/role/${id}/delete`,
        method:'POST'
    })
}

//根据角色ID编辑角色信息
export const editRolesFn=(id,data)=>{
    return request({
        url:`admin/role/${id}`,
        method:'POST',
        data
    })
}
//修改状态
export const editStatusFn=(id,status)=>{
    return request({
        url:`admin/role/${id}/update_status`,
        method:'POST',
        data:{
            status
        }
    })
}

//分配权限
export const setRolesFn=(id,rule_ids)=>{
    return request({
        url:'admin/role/set_rules',
        method:'POST',
        data:{
            id,      
            rule_ids             
        }
    })
}