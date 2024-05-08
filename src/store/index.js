//引入createStore方法
import {createStore} from 'vuex';
import {getUserInfoFn} from '@/api/login';
//創建倉庫實例
const store = createStore({
    state() {
        return {
            //定義管理員信息
            userInfo: {},
            menus: [],
            //設置側邊欄默認為打開狀態
            iscollapse: false
        };
    },
    mutations: {
        //修改管理員信息
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        //修改導航菜單
        setMenus(state, menus) {
            state.menus = menus;
        },
        //修改側邊欄狀態
        setAsideWidth(state) {
            state.iscollapse = !state.iscollapse;
        }
    },
    actions: {
        //獲取登錄用戶信息
        getUserInfo(context) {
            //actions裡面的方法是異步操作
            //異步操作就使用promise
            return new Promise((resolve, reject) => {
                getUserInfoFn()
                    .then((res) => {
                        console.log('儲存用戶資訊', res);

                        context.commit('setUserInfo', res.data);
                        context.commit('setMenus', res.data.menus);
                        resolve(res);
                    })
                    .catch((err) => reject(err));
            });
        }
    }
});
export default store;
