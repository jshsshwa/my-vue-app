//分銷API
//導入axios
import request from '@/utils/request';

//獲取分銷數據統計
export const getDisDataFn = () => {
    return request({
        url: 'admin/agent/statistics',
        method: 'GET'
    });
};

//獲取分銷推廣員列表
export const getDisListFn = (page, params) => {
    return request({
        url: `admin/agent/${page}`,
        method: 'GET',
        params
    });
};

//推廣訂單
export const disOrderFn = (page, params) => {
    return request({
        url: `admin/user_bill/${page}`,
        method: 'GET',
        params
    });
};

//修改分享配置
export const editDisSettingFn = (data) => {
    return request({
        url: 'admin/distribution_setting/set',
        method: 'POST',
        data
    });
};

//獲取分銷設置
export const getDisSettingFn = () => {
    return request({
        url: 'admin/distribution_setting/get',
        method: 'GET'
    });
};
