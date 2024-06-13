import customAxios from '@/plugins/custom-axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CommentInterface } from './comment'

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
  likedByCurrent: boolean
}

export interface ResolutionDetailInterface extends ResolutionInterface {
  comments: CommentInterface[]
}

export interface WeeklyGoalsFormInterface {
  categoryResolutionId: string
  type: 'weeklyGoals'
  caption: string
  photo: Array<string | File>
  dueDate: string
  updatedDate: string
  shareWith: 'everyone' | 'supporter' | 'private'
}

export interface ResolutionFormInterface {
  categoryName: string
  type: 'resolutions'
  caption: string
  photo: Array<string | File>
  dueDate: string
  shareWith: 'everyone' | 'supporter' | 'private'
}

export const usePostStore = defineStore('post', () => {
  const posts = ref<{
    limit: number
    page: number
    data: ResolutionInterface[]
  }>({
    limit: 10,
    page: 1,
    data: []
  })

  const post = ref<ResolutionDetailInterface>({} as ResolutionDetailInterface)

  const getAllPosts = async (
    params: GetPostQuery = {
      limit: 10,
      page: 1
    }
  ) => {
    try {
      const { data } = await customAxios.get('/posts', {
        params
      })
      posts.value.data = data.data.data
      posts.value.page = data.data.page
      return true
    } catch (error) {
      posts.value.data = []
      posts.value.page = 1
      return false
    }
  }

  const getOnePost = async (postId: string) => {
    try {
      const { data } = await customAxios.get(`/posts/${postId}`)

      post.value = data.data
    } catch (error) {
      post.value = {} as ResolutionDetailInterface
      return false
    }
  }

  const saveResolution = async (form: ResolutionFormInterface) => {
    try {
      await customAxios.post('/posts/resolutions', form)
      return true
    } catch (error) {
      return false
    }
  }

  const saveWeekly = async (form: WeeklyGoalsFormInterface) => {
    try {
      await customAxios.post('/posts/weeklyGoals', form)
      return true
    } catch (error) {
      return false
    }
  }

  const likePost = async (postId: string) => {
    try {
      await customAxios.post('/posts/like', { postId })

      return true
    } catch (error) {
      return false
    }
  }

  const unlikePost = async (postId: string) => {
    try {
      await customAxios.post('/posts/unlike', { postId })

      return true
    } catch (error) {
      return false
    }
  }

  return { posts, post, getAllPosts, getOnePost, saveResolution, saveWeekly, likePost, unlikePost }
})
