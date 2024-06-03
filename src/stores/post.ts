import customAxios from '@/plugins/custom-axios'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export interface GetPostQuery {
  limit: number
  page: number
  userId?: string
}

export interface CategoryResolutionInterface {
  _id: string
  name: string
  resolution: string
  isComplete: boolean
  createdDate: string
}

export interface UserInfoInterface {
  _id: string
  username: string
  fullname: string
  photo: string
  categoryResolution: CategoryResolutionInterface[]
}

export interface ResolutionInterface {
  _id: string
  userId: string
  categoryResolutionId: string
  categoryResolution: string
  type: string
  caption: string
  photo: string[]
  likeCount: number
  commentCount: number
  dueDate: string
  updatedDate: string | null
  shareWith: string
  isComplete: boolean
  createdDate: string
  userInfo: UserInfoInterface
  likedByCurrent: string
}

export const usePostStore = defineStore('post', () => {
  const currentPage: Ref<number> = ref(1)
  const posts: Ref<ResolutionInterface[]> = ref([])

  const getUserPost = async (
    params: GetPostQuery = {
      limit: 10,
      page: 10
    }
  ) => {
    const { data } = await customAxios.get('/posts', {
      params
    })
    posts.value = data.data.data
    currentPage.value = data.data.page
  }

  return { currentPage, posts, getUserPost }
})
