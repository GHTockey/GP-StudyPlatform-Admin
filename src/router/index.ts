import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      redirect: '/home',
      component: () => import('@/views/layout/layoutPage.vue'),
      children: [
        { path: '/home', name: 'home', component: HomeView },
        {
          path: '/role', name: '角色管理', children: [
            { path: 'list', name: '角色列表', component: () => import('@/views/role/List.vue') },
          ]
        },
        {
          path: '/perm', name: '权限管理', children: [
            { path: 'list', name: '权限列表', component: () => import('@/views/permission/List.vue') }
          ]
        },
        {
          path: '/user', name: '用户管理', children: [
            { path: 'list', name: '用户列表', component: () => import('@/views/user/List.vue') }
          ]
        }
      ]
    },
    { path: '/login', name: '用户登录', component: () => import('@/views/user/login.vue') }
  ]
})

export default router
