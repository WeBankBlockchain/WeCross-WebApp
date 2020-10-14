import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/helloWorld',
    children: [
      {
        path: 'helloWorld',
        // component: () => import('@/views/dashboard/index'),
        component: () => import('@/views/HelloWorld'),
        name: 'HelloWorld',
        meta: { title: 'HelloWorld', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/accountAdmin',
    component: Layout,
    name: 'accountAdmin',
    meta: {
      title: 'Account Admin',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'accountAdmin',
        component: () => import('@/views/AccountAdmin/index'),
        name: 'accountAdmin',
        meta: { title: 'Account Admin', icon: 'el-icon-s-help' }
      }
    ]
  },
  {
    path: '/chainAdmin',
    component: Layout,
    name: 'chainAdmin',
    meta: {
      title: 'Chain Admin',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'chainAdmin',
        component: () => import('@/views/ChainAdmin/index'),
        name: 'chainAdmin',
        meta: { title: 'Chain Admin', icon: 'el-icon-s-help' }
      }
    ]
  },
  {
    path: '/resourceAdmin',
    component: Layout,
    name: 'resourceAdmin',
    meta: {
      title: 'Resource Admin',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'resourceAdmin',
        component: () => import('@/views/ResourceAdmin/index'),
        name: 'resourceAdmin',
        meta: { title: 'Resource Admin', icon: 'el-icon-s-help' }
      }
    ]
  },
  {
    path: '/transactionAdmin',
    component: Layout,
    name: 'transactionAdmin',
    meta: {
      title: 'Transaction Admin',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'transactionAdmin',
        component: () => import('@/views/TransactionAdmin/index'),
        name: 'transactionAdmin',
        meta: { title: 'Transaction Admin', icon: 'el-icon-s-help' }
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
