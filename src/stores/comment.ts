import customAxios from '@/plugins/custom-axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface CommentInterface {
  _id: string
  userId: string
  postId: string
  message: string
  reply: CommentInterface[]
  replyCount: number
  type: 'comment' | 'reply'
  updatedDate?: Date
  createdDate: string
  isUpdating: boolean
  userInfo: {
    _id: string
    username: string
    photo: string
  }
}

export const useCommentStore = defineStore('comment', () => {
  const comments = ref<CommentInterface[]>([])

  const getComments = async (postId: string) => {
    try {
      const { data } = await customAxios.get(`/comments/${postId}`)

      comments.value = data.data.filter((c: any) => c.type === 'comment')
      return true
    } catch (error) {
      comments.value = []
      return false
    }
  }

  const addComent = async (postId: string, message: string) => {
    try {
      await customAxios.post('/comments', {
        postId,
        message
      })
      return true
    } catch (error) {
      return false
    }
  }

  const getReplies = async (commentId: string) => {
    try {
      const { data } = await customAxios.get(`/comments/${commentId}/reply`)
      return data.data
    } catch (error) {
      return []
    }
  }

  const replyComment = async (postId: string, commentId: string, message: string) => {
    try {
      await customAxios.post('/comments/reply', {
        postId,
        message,
        replyTo: commentId
      })
      return true
    } catch (error) {
      return false
    }
  }

  return { comments, getComments, addComent, getReplies, replyComment }
})
