import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type Router
} from 'vue-router'

import { routes as authRoutes } from '@/modules/auth/routes'
import { routes as mainRoutes } from '@/modules/main/routes'
import { routes as templateRoutes } from '@/modules/template/routes'

interface RouteContext {
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  next: NavigationGuardNext
  router: Router
}

interface NextFactoryFunction {
  (context: RouteContext, middleware: Array<MiddlewareFunction>, index: number):
    | MiddlewareFunction
    | NavigationGuardNext
}

interface MiddlewareParams {
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  next: MiddlewareFunction | NavigationGuardNext
  router: Router
}

export interface MiddlewareFunction {
  (params: MiddlewareParams): any
}

const routes = [
  authRoutes,
  mainRoutes,
  templateRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../modules/main/views/page-not-found.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const nextFactory: NextFactoryFunction = (context, middleware, index) => {
  const nextMiddleware = middleware[index]

  if (!nextMiddleware) {
    return context.next
  }

  return nextMiddleware({ ...context, next: nextFactory(context, middleware, index + 1) })
}

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next()
  }

  const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware]
  const context: RouteContext = {
    to,
    from,
    next,
    router
  }

  return middleware[0]({ ...context, next: nextFactory(context, middleware, 1) })
})

export default router
