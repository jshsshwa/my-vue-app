//createRouter:用于创建路由
//createWebHashHistory：用于设置路由模式为哈希模式
import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import nProgress from 'nprogress'

const routes = [
    {
        path: '/login',
        component: () => import('@/views/login.vue')
    },
    {
        path: '/',
        redirect: '/home'
    },
    //后台主页路由
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
                    title: '后台首页'
                }
            },
            {
                path: '/goods/list', name: '/goods/list', component: () => import('@/views/GoodsList.vue'), meta: {
                    title: "商品管理"
                }
            },
            {
                path: '/category/list', name: '/category/list', component: () => import('@/views/cateList.vue'), meta: {
                    title: "分类管理"
                }
            },
            {
                path:'/image/list',
                name:'/image/list',
                component:()=>import('@/views/PicList.vue'),
                meta:{
                    title:'图库管理'
                }
            },
            {
                path:'/notice/list',
                name:'/notice/list',
                component:()=>import('@/views/News.vue'),
                meta:{
                    title:'公告管理'
                }
            },
            {
                path:'/manager/list',
                name:'/manager/list',
                component:()=>import('@/views/Manager.vue'),
                meta:{
                    title:'管理员管理'
                }
            },
            {
                path:'/access/list',
                name:'/access/list',
                component:()=>import('@/views/Rules.vue'),
                meta:{
                    title:'菜单权限管理'
                }
            },
            {
                path:'/role/list',
                name:'/role/list',
                component:()=>import('@/views/Role.vue'),
                meta:{
                    title:'角色管理'
                }
            },
            {
                path:'/skus/list',
                name:'/skus/list',
                component:()=>import('@/views/Skus.vue'),
                meta:{
                    title:'规格管理'
                }
            },
            {
                path:'/coupon/list',
                name:'/coupon/list',
                component:()=>import('@/views/Coupon.vue'),
                meta:{
                    title:'优惠券管理'
                }
            },
            {
                path:'/level/list',
                name:'/level/list',
                component:()=>import('@/views/Level.vue'),
                meta:{
                    title:'会员等级'
                }
            },
            {
                path:'/user/list',
                name:'/user/list',
                component:()=>import('@/views/User.vue'),
                meta:{
                    title:'用户管理'
                }
            },
            {
                path:'/comment/list',
                name:'/comment/list',
                component:()=>import('@/views/Comment.vue'),
                meta:{
                    title:'评论管理'
                }
            },
            {
                path:'/order/list',
                name:'/order/list',
                component:()=>import('@/views/Order.vue'),
                meta:{
                    title:'订单管理'
                }
            },
            {
                path:'/setting/base',
                name:'/setting/base',
                component:()=>import('@/views/SetSyetem.vue'),
                meta:{
                    title:'系统设置'
                }
            },
            {
                path:'/distribution/index',
                name:'/distribution/index',
                component:()=>import('@/views/Distribution.vue'),
                meta:{
                    title:'分销员管理'
                }
            },
            {
                path:'/distribution/setting',
                name:'/distribution/setting',
                component:()=>import('@/views/DisSetting.vue'),
                meta:{
                    title:'分销设置'
                }
            }
        ]
    },
    //捕获404路由
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/404.vue')
    }
]


//创建路由实例对象
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//getinfo请求了2次
let isgetInfo = false
//全局前置路由守卫
router.beforeEach(async (to, from, next) => {
    nProgress.start()
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    //如果未登录跳转到登录页面
    if (!tokenStr && to.path !== '/login') return next('/login')
    //如果已登录避免重复登录
    if (tokenStr && to.path == '/login') {
        return next({ path: from.path ? from.path : '/' })
    }
    let hasNewRoutes = false
    //如果用户登录成功，调用Vuex方法，存储用户信息
    if (tokenStr && !isgetInfo) {
        const res = await store.dispatch('getUserInfo')
        isgetInfo = true
        //动态添加路由
        //hasNewRoutes = addRoutes(res.data.menus)
    }
    //手动指定路由
    //如果确实有新路由加入手动指定路由，否则直接放行
    hasNewRoutes ? next(to.fullPath) : next()
    //next()
})

//全局后置路由守卫
router.afterEach((to, from,) => {
    nProgress.done()
})
//共享路由实例对象

export default router



