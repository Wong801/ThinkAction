import type { MiddlewareFunction } from '@/router'
import { useUserStore } from '@/stores/user'
import type { NavigationGuardNext } from 'vue-router'

const auth: MiddlewareFunction = async ({ next }) => {
  const userStore = useUserStore()

  await userStore.getUserData()

  if (!userStore.userData) {
    return (next as NavigationGuardNext)({
      path: '/login'
    })
  }

  return (next as NavigationGuardNext)()
}

export default auth
