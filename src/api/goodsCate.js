//導入axios
import request from '@/utils/request';

//獲取商品分類列表
export const getGoodsCateFn = () => {
    return request({
        url: 'admin/category',
        method: 'GET'
    });
};

//新增商品分類
export const addGoodsCateFn = (name) => {
    return request({
        url: 'admin/category',
        method: 'POST',
        data: {
            name
        }
    });
};

//編輯商品分類
export const editGoodsCateFn = (id, name) => {
    return request({
        url: `admin/category/${id}`,
        method: 'POST',
        data: {
            name
        }
    });
};

//編輯商品分類狀態
export const editGoodsCateStatus = (id, status) => {
    return request({
        url: `admin/category/${id}/update_status`,
        method: 'POST',
        data: {
            status
        }
    });
};

//刪除商品分類
export const delEditGoodsCate = (id) => {
    return request({
        url: `admin/category/${id}/delete`,
        method: 'POST'
    });
};
