<script setup lang="ts">
import { ref } from 'vue'
import { BaseInput, BaseDatepicker, BaseTextarea, BaseSelect } from '@/components/index'
import dayjs from 'dayjs'
import { usePostStore, type ResolutionFormInterface } from '@/stores/post'
import { useImageStore } from '@/stores/image'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const postStore = usePostStore()
const router = useRouter()
const imageStore = useImageStore()
const userStore = useUserStore()

const list = ref([
  { id: 1, label: 'Everyone', value: 'everyone' },
  { id: 2, label: 'Supporter', value: 'supporter' },
  { id: 3, label: 'Private', value: 'private' }
])

const form = ref<ResolutionFormInterface>({
  caption: '',
  categoryName: '',
  photo: [],
  dueDate: dayjs(new Date()).format('YYYY/MM/DD'),
  shareWith: 'everyone',
  type: 'resolutions'
})

const fakepath = ref('')

const setThumbnail = (e: Event) => {
  const inputEvent = e
  const file = ((inputEvent?.target as HTMLInputElement)?.files as FileList)[0]

  form.value.photo.push(file)
  fakepath.value = URL.createObjectURL(form.value.photo[0] as File)
}

const submit = async (form: ResolutionFormInterface) => {
  if (form.photo.length && form.photo[0] instanceof File) {
    const imageKey = await imageStore.uploadImage({ image: form.photo[0] })
    form.photo[0] = imageKey
  }

  await postStore.saveResolution(form)
  return router.push('/profile')
}
</script>

<template>
  <div class="main-content-container">
    <p class="text-lg font-semibold">Create Your Resolution</p>
    <hr />

    <div>
      <p class="font-semibold text-lg text-[#3D8AF7] text-center mb-5">
        Hi {{ userStore?.userData?.username }}, let's start by setting up your resolutions!
      </p>

      <!-- category input -->
      <span class="font-semibold text-[#3D8AF7] block mb-2">Category</span>
      <component
        :is="BaseInput"
        v-model="form.categoryName"
        placeholder="Finance"
        border="full"
        class="mb-8"
      ></component>

      <!-- due date input -->
      <span class="font-semibold text-[#3D8AF7] block mb-2">Due Date</span>
      <component :is="BaseDatepicker" v-model="form.dueDate" border="full" class="mb-8" />

      <!-- resolution input -->
      <span class="font-semibold text-[#3D8AF7] block mb-2">Resolution</span>
      <component :is="BaseTextarea" v-model="form.caption" border="simple" class="mb-8"></component>

      <!-- upload photo -->
      <span class="font-semibold text-[#3D8AF7] block mb-2"
        >Share the photo of your vision here</span
      >
      <div class="my-5 h-[8rem] w-[8rem] overflow-hidden">
        <img :src="fakepath || (form.photo[0] as string)" alt="user photo" class="w-full" />
      </div>
      <label class="btn btn-primary bg-[#3D8AF7] mb-8">
        <input @change="setThumbnail" type="file" class="pointer-events-none absolute opacity-0" />
        <div class="flex items-center space-x-2">
          <!-- <i class="block i-far-arrow-up-from-bracket"></i> -->
          <span>Choose File</span>
        </div>
      </label>

      <!-- share with -->
      <span class="font-semibold text-[#3D8AF7] block mb-2">Share With</span>
      <component :is="BaseSelect" v-model="form.shareWith" :list="list" border="full"></component>

      <!-- button -->
      <div @click="submit(form)" class="flex justify-center space-x-2 mt-8">
        <button class="btn btn-primary bg-[#3D8AF7] px-7">SAVE</button>
        <button class="btn btn-danger">CANCEL</button>
      </div>
    </div>
  </div>
</template>
