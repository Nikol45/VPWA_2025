import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { name: 'login', path: '', component: () => import('pages/AuthPage.vue') },
      { name: 'register', path: 'register', component: () => import('pages/RegisterPage.vue') }
    ]
  },

  {
    path: '/home',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/HomePage.vue') },
      { name: 'profile-settings', path: 'settings', component: () => import('pages/ProfileSettings.vue') }
    ]
  },

  {
    path: '/channel/:id',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      { name: 'channel', path: '', component: () => import('pages/ChannelChat.vue') },
      { name: 'channel-settings', path: 'settings', component: () => import('pages/ChannelSettings.vue') }
    ]
  },

  // fallback
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
