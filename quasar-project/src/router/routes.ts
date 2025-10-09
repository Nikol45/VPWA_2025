import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [{
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('pages/AuthPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') }
    ],
  },

  {
    path: '/home/:id',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      { path: 'settings', component: () => import('pages/ProfileSettings.vue') }
    ],
  }, 
  
  {
    path: 'channel/:id', 
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Chat.vue') },
      { path: 'settings', component: () => import('pages/ChannelSettings.vue') }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
