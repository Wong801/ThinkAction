import customAxios from '@/plugins/custom-axios'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export interface UserDataInterface {
  bio: string
  categoryResolution: Array<any>
  email: string
  fullname: string
  isAuthenticatedUser: boolean
  isPublic: boolean
  notificationCount: number
  photo: string
  requestCount: number
  supporterCount: number
  supportingCount: number
  username: string
  isSupporting: boolean
  goalsPerformance: any
  isPrivate: boolean
  _id: string
}

export interface UserLoginInterface {
  email: string
  password: string
}

export interface UserRegisterInterface extends UserLoginInterface {
  fullname: string
  username: string
}

export interface UserUpdateProfileInterface {
  fullname: string
  username: string
  bio: string
  photo: string | File
  isPublic: boolean
}

export const useUserStore = defineStore('user', () => {
  const userData: Ref<UserDataInterface | null> = ref(null)

  const register = async (form: UserRegisterInterface) => {
    try {
      await customAxios.post('/users/register', form)
      return true
    } catch (e) {
      if (customAxios.isAxiosError(e)) {
        throw e.response?.data.errors
      }
      throw e
    }
  }

  const login = async (form: UserLoginInterface) => {
    try {
      await customAxios.post('/users/login', form)
      return true
    } catch (e) {
      if (customAxios.isAxiosError(e)) {
        throw e.response?.data.errors
      }
      throw e
    }
  }

  const getUserData = async () => {
    try {
      const { data } = await customAxios.get('/users/get')

      userData.value = data

      const detail = await customAxios.get(`/users/${userData.value?._id}`)

      userData.value = detail.data.data

      return true
    } catch (e) {
      userData.value = null
      return false
    }
  }

  const editUserData = async (form: UserUpdateProfileInterface) => {
    try {
      await customAxios.patch('/users', form)

      await getUserData()

      return true
    } catch (error) {
      return false
    }
  }

  return { userData, register, login, getUserData, editUserData }
})
