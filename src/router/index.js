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
    component: () => import('@/views/register/register'),
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
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/accountAdmin',
    component: Layout,
    name: 'AccountAdmin',
    redirect: '/accountAdmin/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/accountAdmin/index'),
        meta: { title: '账户管理', icon: 'el-icon-s-promotion' }
      }
    ]
  },
  {
    path: '/routerAdmin',
    component: Layout,
    name: 'routerAdmin',
    redirect: '/routerAdmin/routerManage',
    children: [
      {
        name: 'routerManage',
        path: 'routerManage',
        component: () => import('@/views/routerAdmin/routerManage'),
        meta: { title: '路由管理', icon: 'el-icon-connection' }
      },
      {
        path: 'routerGuide',
        hidden: true,
        component: () => import('@/views/routerAdmin/routerGuide'),
        meta: { title: '路由部署', icon: 'el-icon-upload' }
      }
    ]
  },
  {
    path: '/resourceAdmin',
    component: Layout,
    redirect: '/resourceAdmin/resourceList',
    children: [
      {
        name: 'resourceList',
        path: 'resourceList',
        component: () => import('@/views/resourceAdmin/explorer'),
        meta: { title: '资源管理', icon: 'el-icon-s-grid' }
      },
      {
        name: 'resourceDeploy',
        path: 'resourceDeploy',
        hidden: true,
        component: () => import('@/views/resourceAdmin/resourceDeploy'),
        meta: { title: '资源部署', icon: 'el-icon-upload' }
      }
    ]
  },
  {
    path: '/transactionAdmin',
    component: Layout,
    name: 'TransactionAdmin',
    redirect: 'transactionAdmin/transactionList',
    children: [
      {
        path: 'transaction',
        hidden: true,
        component: () => import('@/views/transactionAdmin/transaction'),
        meta: { title: '交易发起', icon: 'el-icon-s-opportunity' }
      },
      {
        path: 'transactionList',
        component: () => import('@/views/transactionAdmin/explorer'),
        meta: { title: '交易管理', icon: 'el-icon-notebook-2' }
      }
    ]
  },
  {
    path: '/xaTransactionAdmin',
    component: Layout,
    name: 'XATransactionAdmin',
    redirect: 'transactionAdmin/xaTransactionList',
    children: [
      {
        name: 'xaTransaction',
        path: 'xaTransaction',
        hidden: true,
        component: () => import('@/views/transactionAdmin/xaTransaction'),
        meta: { title: '事务交易', icon: 'el-icon-s-order' }
      },
      {
        name: 'xaTransactionList',
        path: 'xaTransactionList',
        component: () => import('@/views/transactionAdmin/xaTransactionList'),
        meta: { title: '事务管理', icon: 'el-icon-tickets' }
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
        component: () => import('@/views/documentView/index'),
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
