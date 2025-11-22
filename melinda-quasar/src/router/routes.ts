import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { name: 'login', path: '', meta: { guestOnly: true }, component: () => import('pages/AuthPage.vue') },
      { name: 'register', path: 'register', meta: { guestOnly: true }, component: () => import('pages/RegisterPage.vue') }
    ]
  },

  {
    path: '/home',
    meta: { requiresAuth: true },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/HomePage.vue') }
    ]
  },

  {
    path: '/home/settings',
    meta: { requiresAuth: true },
    component: () => import('layouts/SettingsLayout.vue'),
    children: [
      { name: 'profile-settings', path: '', component: () => import('pages/ProfileSettings.vue') }
    ]
  },

  {
    path: '/channel/:id',
    meta: { requiresAuth: true },
    component: () => import('layouts/MainLayout.vue'),
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
