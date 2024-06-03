import customAxios from '@/plugins/custom-axios'
import { defineStore } from 'pinia'

export interface ImageUploadInterface {
  image: File
}

export const useImageStore = defineStore('image', () => {
  const uploadImage = async (form: ImageUploadInterface) => {
    const { data } = await customAxios.post('/images/upload', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return data.key
  }

  const getImage = async (key: string) => {
    const { data } = await customAxios.get(`/images/${key}`)

    return data.url
  }

  return { uploadImage, getImage }
})
