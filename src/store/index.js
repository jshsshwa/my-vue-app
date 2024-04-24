//引入createStore方法
import {createStore} from 'vuex'
import { getUserInfoFn } from '@/api/login'
//创建仓库实例
const store = createStore({
    state () {
      return {   
        //定义管理员信息
        userInfo:{},
        menus:[],
        //设置侧边栏默认为打开状态
        iscollapse:false,              
      }
    },
    mutations: {   
        //修改管理员信息
        setUserInfo(state,userInfo){
            state.userInfo=userInfo
        },
        //修改导航菜单
        setMenus(state,menus){
          state.menus=menus
        },
        //修改侧边栏状态
        setAsideWidth(state){
          state.iscollapse=!state.iscollapse
        }       

    },
    actions:{
      //获取登录用户信息
      getUserInfo(context){
        //actions里面的方法是异步操作
        //异步操作就使用promise
        return new Promise((resolve,reject)=>{
          getUserInfoFn().then(res=>{
            console.log("儲存用戶資訊",res);
            
            context.commit('setUserInfo',res.data) 
            context.commit('setMenus',res.data.menus) 
            resolve(res)
          }).catch(err=>reject(err))
        })        
      }
    }
  })
  export default store