//圖庫API
//導入axios
import request from '@/utils/request';

//獲取圖庫分類
export const getPicsCate = (page, limit = 10) => {
    return request({
        url: `admin/getPicsCateList/${page}`,
        method: 'GET',
        params: {
            limit
        }
    });
};

//新增圖庫分類
export const addPicsCateListFn = (data) => {
    return request({
        url: 'admin/addPicsCateList',
        method: 'POST',
        data
    });
};

//修改圖庫分類
export const editPiscCateList = (id, data) => {
    return request({
        url: `admin/editPicsList/${id}`,
        method: 'POST',
        data
    });
};

//刪除圖庫分類
export const delCateListFn = (id) => {
    return request({
        url: `admin/delPicsCateList/${id}/delete`,
        method: 'POST'
    });
};

//根據分類id獲取圖庫列表
export const getPicsList = (id, page, limit) => {
    return request({
        url: `admin/getPicList/${id}/image/${page}`,
        params: {
            limit
        }
    });
};

//圖片重命名
export const editPicNameFn = (id, name) => {
    return request({
        url: `admin/editPicName/${id}`,
        method: 'POST',
        data: {
            name
        }
    });
};
//刪除圖片
export const delPicFn = (ids) => {
    return request({
        url: 'admin/delPic/delete_all',
        method: 'POST',
        data: {
            ids
        }
    });
};

export const uploadPicAction = '/api/admin/image/upload';
