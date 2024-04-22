//公告新闻
//导入axios
import request from '@/utils/request'
//获取公告列表
export const getNewsList=(page)=>{
    return request({
        url:`admin/news/${page}`,
        method:'GET'   
    })
}
//新增
export const addNewsFn=(data)=>{
    return request({
        url:'admin/news',
        method:'POST',
        data
    })
}

//修改
export const editNewsFn=(id,data)=>{
    return request({
        url:`admin/news/${id}`,
        method:'POST',
        data
    })
}

//删除
export const delNews=(id)=>{
    return request({
        url:`admin/news/${id}/delete`,
        method:'POST'
    })
}