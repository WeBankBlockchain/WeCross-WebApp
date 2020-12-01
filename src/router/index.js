import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    name: 'Register',
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'homepage',
      component: () => import('@/views/homepage/index'),
      meta: { title: '平台首页', icon: 'el-icon-s-home' }
    }]
  },
  {
    path: '/account',
    component: Layout,
    name: 'Account',
    redirect: '/account/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/account/index'),
        meta: { title: '账户管理', icon: 'el-icon-user' }
      }
    ]
  },
  {
    path: '/router',
    component: Layout,
    name: 'router',
    redirect: '/router/routerManager',
    children: [
      {
        name: 'routerManager',
        path: 'routerManager',
        component: () => import('@/views/router/routerManager'),
        meta: { title: '路由管理', icon: 'el-icon-connection' }
      },
      {
        path: 'routerGuide',
        hidden: true,
        component: () => import('@/views/router/routerGuide'),
        meta: { title: '路由部署', icon: 'el-icon-upload' }
      }
    ]
  },
  {
    path: '/resource',
    component: Layout,
    redirect: '/resource/resourceList',
    children: [
      {
        name: 'resourceList',
        path: 'resourceList',
        component: () => import('@/views/resource/resourceManager'),
        meta: { title: '资源管理', icon: 'el-icon-files' }
      },
      {
        name: 'resourceDeployment',
        path: 'resourceDeployment',
        hidden: true,
        component: () => import('@/views/resource/resourceDeployment'),
        meta: { title: '资源部署', icon: 'el-icon-upload' }
      }
    ]
  },
  {
    path: '/transaction',
    component: Layout,
    name: 'Transaction',
    redirect: 'transaction/transactionList',
    children: [
      {
        path: 'rawTransaction',
        hidden: true,
        component: () => import('@/views/transaction/rawTransaction'),
        meta: { title: '交易发起', icon: 'el-icon-s-opportunity' }
      },
      {
        path: 'transactionList',
        component: () => import('@/views/transaction/transactionManager'),
        meta: { title: '交易管理', icon: 'el-icon-sort' }
      }
    ]
  },
  {
    path: '/xaTransaction',
    component: Layout,
    name: 'XATransaction',
    redirect: 'transaction/xaTransactionList',
    children: [
      {
        name: 'xaTransaction',
        path: 'xaTransaction',
        hidden: true,
        component: () => import('@/views/transaction/xaTransaction'),
        meta: { title: '事务交易', icon: 'el-icon-s-order' }
      },
      {
        name: 'xaTransactionList',
        path: 'xaTransactionList',
        component: () => import('@/views/transaction/xaTransactionList'),
        meta: { title: '事务管理', icon: 'el-icon-finished' }
      }
    ]
  },
  {
    path: '/documents',
    component: Layout,
    name: 'Documents',
    redirect: '/documents/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/document/index'),
        meta: { title: '参考文档', icon: 'el-icon-document' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
