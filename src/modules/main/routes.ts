import type { RouteRecordRaw } from 'vue-router'
import auth from './middlewares/auth.middleware'

export const routes: RouteRecordRaw = {
  path: '/',
  component: () => import('@/layouts/app/app-index.vue'),
  children: [
    {
      path: '',
      component: () => import('./views/page-index.vue')
    },
    {
      path: 'find',
      component: () => import('./views/page-find-user.vue')
    },
    {
      path: 'user/:id',
      component: () => import('./views/page-detail-user.vue')
    },
    {
      path: 'supporters',
      component: () => import('./views/page-supporter.vue')
    },
    {
      path: 'supporting',
      component: () => import('./views/page-supporting.vue')
    },
    {
      path: 'create-resolution',
      component: () => import('./views/page-create-resolution.vue')
    },
    {
      path: 'edit-goal',
      component: () => import('./views/page-edit-goal.vue')
    },
    {
      path: 'create-weekly-goals',
      component: () => import('./views/page-create-weekly-goals.vue')
    },
    {
      path: 'complete-goals',
      component: () => import('./views/page-complete-goals.vue')
    },
    {
      path: 'notification',
      component: () => import('./views/page-notification.vue')
    },
    {
      path: 'profile',
      component: () => import('./views/page-profile.vue')
    },
    {
      path: 'profile/edit',
      component: () => import('./views/page-edit-profile.vue')
    },
    {
      path: 'profile/edit-password',
      component: () => import('./views/page-edit-password.vue')
    },
    {
      path: 'monthly-report',
      component: () => import('./views/page-monthly-report.vue')
    },
    {
      path: 'yearly-report',
      component: () => import('./views/page-yearly-report.vue')
    },
    {
      path: 'post/:id',
      component: () => import('./views/page-detail-post.vue')
    },
    {
      path: 'post/:id/cheers',
      component: () => import('./views/page-detail-cheers.vue')
    },
    {
      path: 'nested',
      children: [
        {
          path: 'page-nested-1',
          component: () => import('./views/nested/page-nested-1.vue')
        },
        {
          path: 'page-nested-2',
          component: () => import('./views/nested/page-nested-2.vue')
        }
      ]
    }
  ],
  meta: {
    middleware: [auth]
  }
}
