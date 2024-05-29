import customAxios from '@/plugins/custom-axios'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export interface UserDataInterface {
  _id: string
  username: string
  email: string
  photo: string
  role: string
}

export interface UserLoginInterface {
  email: string
  password: string
}

export interface UserRegisterInterface extends UserLoginInterface {
  fullname: string
  username: string
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
    } catch (e) {
      if (customAxios.isAxiosError(e)) {
        throw e.response?.data.errors
      }
      throw e
    }
  }

  return { userData, register, login, getUserData }
})
