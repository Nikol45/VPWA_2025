import { boot } from 'quasar/wrappers'
import { authManager } from 'src/services'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean,
    guestOnly?: boolean
  }
}

const loginRoute = (from: RouteLocationNormalized): RouteLocationRaw => {
  return {
    name: 'login',
    query: { redirect: from.fullPath }
  }
}

export default boot(({ router }) => {
  const auth = useAuthStore()
  authManager.onLogout(() => {
    void (async () => {
      await router.push(loginRoute(router.currentRoute.value))
    })()
  })

  router.beforeEach(async (to) => {
    if (to.meta.guestOnly) return
    const isAuthenticated = await auth.check()

    if (to.meta.requiresAuth && !isAuthenticated) {
      return loginRoute(to)
    }
    
    if (to.meta.guestOnly && isAuthenticated) {
      return { name: 'home' }
    }
  })
})