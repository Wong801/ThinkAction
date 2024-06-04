import customAxios from '@/plugins/custom-axios'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export interface UserDataInterface {
  bio: string
  categoryResolution: CategoryResolutionInterface[]
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

export interface OtherUserInterface extends UserDataInterface {
  performanceReport: number
}

export interface CategoryResolutionInterface {
  createdDate?: Date
  isComplete: boolean
  name: string
  resolution: string
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

export interface UserSupporterInterface {
  _id: string
  username: string
  email: string
  fullname: string
  bio: string
  photo: string
  supporterCount: number
  supportingCount: number
  categoryResolution: CategoryResolutionInterface[]
  isPublic: boolean
  isSupporting: boolean
  isAuthenticatedUser: boolean
}

export const useUserStore = defineStore('user', () => {
  const userData: Ref<UserDataInterface | null> = ref(null)
  const otherUser = ref<OtherUserInterface>({} as OtherUserInterface)
  const userSupporter = ref<{
    results: number
    page: number
    limit: number
    data: UserSupporterInterface[]
  }>({
    results: 0,
    page: 1,
    limit: 10,
    data: []
  })
  const performanceReport = ref<number>(0)

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

  const getOtherUser = async (userId: string) => {
    try {
      const { data } = await customAxios.get(`/users/${userId}`)

      otherUser.value = data.data
      return true
    } catch (error) {
      otherUser.value = {} as OtherUserInterface
      return false
    }
  }

  const getPerformanceReport = async (userId: string) => {
    try {
      const { data } = await customAxios.get(`/posts/performance/${userId}`)

      if (userId === userData.value?._id) {
        performanceReport.value = data.data
      } else {
        otherUser.value.performanceReport = data.data
      }

      return true
    } catch (error) {
      performanceReport.value = 0
      otherUser.value.performanceReport = 0
      return false
    }
  }

  const getAllSupporter = async (userId: string) => {
    try {
      const { data } = await customAxios.get(`/users/${userId}/supporter`, {
        params: {
          limit: userSupporter.value.limit,
          page: userSupporter.value.page
        }
      })

      userSupporter.value.data = data.data
      userSupporter.value.limit = data.limit
      userSupporter.value.page = data.page
      userSupporter.value.results = data.results
    } catch (e) {
      userSupporter.value.data = []
      userSupporter.value.limit = 10
      userSupporter.value.page = 1
      userSupporter.value.results = 0
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

  return {
    userData,
    otherUser,
    userSupporter,
    performanceReport,
    register,
    login,
    getUserData,
    getOtherUser,
    getAllSupporter,
    getPerformanceReport,
    editUserData
  }
})
