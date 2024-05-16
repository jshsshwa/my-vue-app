//createRouter:用於創建路由
//createWebHashHistory：用於設置路由模式為哈希模式
import {createRouter, createWebHashHistory} from 'vue-router';
import store from '@/store';
import nProgress from 'nprogress';

const routes = [
    {
        path: '/Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/',
        redirect: '/home'
    },
    //後臺主頁路由
    {
        path: '/home',
        name: 'admin',
        component: () => import('@/views/Home.vue'),
        children: [
            {
                path: '/home',
                name: '/home',
                component: () => import('@/views/HomeIndex.vue'),
                meta: {
                    title: '後臺首頁'
                }
            },
            {
                path: '/goods/list',
                name: '/goods/list',
                component: () => import('@/views/GoodsList.vue'),
                meta: {
                    title: '商品管理'
                }
            },
            {
                path: '/category/list',
                name: '/category/list',
                component: () => import('@/views/cateList.vue'),
                meta: {
                    title: '分類管理'
                }
            },
            {
                path: '/image/list',
                name: '/image/list',
                component: () => import('@/views/PicList.vue'),
                meta: {
                    title: '圖庫管理'
                }
            },
            {
                path: '/notice/list',
                name: '/notice/list',
                component: () => import('@/views/News.vue'),
                meta: {
                    title: '公告管理'
                }
            },
            {
                path: '/manager/list',
                name: '/manager/list',
                component: () => import('@/views/Manager.vue'),
                meta: {
                    title: '管理員管理'
                }
            },
            {
                path: '/access/list',
                name: '/access/list',
                component: () => import('@/views/Rules.vue'),
                meta: {
                    title: '選單權限管理'
                }
            },
            {
                path: '/role/list',
                name: '/role/list',
                component: () => import('@/views/Role.vue'),
                meta: {
                    title: '角色管理'
                }
            },
            {
                path: '/skus/list',
                name: '/skus/list',
                component: () => import('@/views/Skus.vue'),
                meta: {
                    title: '規格管理'
                }
            },
            {
                path: '/coupon/list',
                name: '/coupon/list',
                component: () => import('@/views/Coupon.vue'),
                meta: {
                    title: '優惠券管理'
                }
            },
            {
                path: '/level/list',
                name: '/level/list',
                component: () => import('@/views/Level.vue'),
                meta: {
                    title: '會員等級'
                }
            },
            {
                path: '/user/list',
                name: '/user/list',
                component: () => import('@/views/User.vue'),
                meta: {
                    title: '用戶管理'
                }
            },
            {
                path: '/comment/list',
                name: '/comment/list',
                component: () => import('@/views/Comment.vue'),
                meta: {
                    title: '評論管理'
                }
            },
            {
                path: '/order/list',
                name: '/order/list',
                component: () => import('@/views/Order.vue'),
                meta: {
                    title: '訂單管理'
                }
            },
            {
                path: '/setting/base',
                name: '/setting/base',
                component: () => import('@/views/SetSyetem.vue'),
                meta: {
                    title: '系統設置'
                }
            },
            {
                path: '/distribution/index',
                name: '/distribution/index',
                component: () => import('@/views/Distribution.vue'),
                meta: {
                    title: '分銷員管理'
                }
            },
            {
                path: '/distribution/setting',
                name: '/distribution/setting',
                component: () => import('@/views/DisSetting.vue'),
                meta: {
                    title: '分銷設置'
                }
            }
        ]
    },
    //捕獲404路由
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/404.vue')
    }
];

//創建路由實例對象
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

//getinfo請求了2次
let isgetInfo = false;
//全局前置路由守衛
router.beforeEach(async (to, from, next) => {
    nProgress.start();
    //獲取token
    const tokenStr = window.sessionStorage.getItem('token');
    //如果未登入跳轉到登入頁面
    if (!tokenStr && to.path !== '/Login') return next('/Login');
    //如果已登入避免重複登入
    if (tokenStr && to.path == '/Login') {
        return next({path: from.path ? from.path : '/'});
    }
    let hasNewRoutes = false;
    //如果用戶登入成功，調用Vuex方法，存儲用戶信息
    if (tokenStr && !isgetInfo) {
        const res = await store.dispatch('getUserInfo');
        isgetInfo = true;
        //動態添加路由
        //hasNewRoutes = addRoutes(res.data.menus)
    }
    //手動指定路由
    //如果確實有新路由加入手動指定路由，否則直接放行
    hasNewRoutes ? next(to.fullPath) : next();
    //next()
});

//全局後置路由守衛
router.afterEach((to, from) => {
    nProgress.done();
});
//共享路由實例對象

export default router;
