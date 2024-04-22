//导入axios
import request from '@/utils/request'
//共享登录方法
export const loginFn=(data)=>{
    return request({
        url:'admin/login',
        method:'POST',
        data    
    })
} 
//共享根据token获取管理员信息方法
export const getUserInfoFn=()=>{
    return request({
        url:'admin/getUserInfo',
        method:'POST'        
    })
}
//共享修改管理员方法
export const editPasswordFn=(data)=>{
    return request({
        url:'/admin/editPassword',
        method:'POST',
        data
    })
}