//图库API
//导入axios
import request from '@/utils/request'

//获取图库分类
export const getPicsCate=(page,limit=10)=>{
    return request({
        url:`admin/getPicsCateList/${page}`,
        method:'GET',
        params:{
            limit
        }
    })
}

//新增图库分类
export const addPicsCateListFn=(data)=>{
    return request({
        url:'admin/addPicsCateList',
        method:'POST',
        data
    })
}

//修改图库分类
export const editPiscCateList=(id,data)=>{
    return request({
        url:`admin/editPicsList/${id}`,
        method:'POST',
        data
    })
}

//删除图库分类
export const delCateListFn=(id)=>{
    return request({
        url:`admin/delPicsCateList/${id}/delete`,
        method:'POST'
    })
}

//根据分类id获取图库列表
export const getPicsList=(id,page,limit)=>{
    return request({
        url:`admin/getPicList/${id}/image/${page}`,
        params:{
            limit
        }
    })
}

//图片重命名
export const editPicNameFn=(id,name)=>{
    return request({
        url:`admin/editPicName/${id}`,
        method:'POST',
        data:{
            name
        }
    })
}
//删除图片
export const delPicFn=(ids)=>{
    return request({
        url:'admin/delPic/delete_all',
        method:'POST',
        data:{
            ids
        }
    })
}

export const uploadPicAction='/api/admin/image/upload'