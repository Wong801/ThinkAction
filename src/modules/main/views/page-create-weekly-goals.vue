<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseInput, BaseDatepicker, BaseTextarea, BaseSelect } from '@/components/index'
import { usePostStore, type WeeklyGoalsFormInterface } from '@/stores/post'
import { useUserStore } from '@/stores/user'
import type { OptionsInterface } from '@/components/base-select.vue'
import { useRouter } from 'vue-router'
import { useImageStore } from '@/stores/image'
import dayjs from 'dayjs'

const userStore = useUserStore()
const postStore = usePostStore()
const imageStore = useImageStore()
const router = useRouter()

const list = ref([
  { id: 1, label: 'Everyone', value: 'everyone' },
  { id: 2, label: 'Supporter', value: 'supporter' },
  { id: 3, label: 'Private', value: 'private' }
])

const categories = computed<OptionsInterface[]>(
  () =>
    userStore.userData?.categoryResolution.map((cr) => ({
      id: cr._id,
      label: cr.name,
      value: cr._id
    })) || []
)

const form = ref<WeeklyGoalsFormInterface>({
  caption: '',
  categoryResolutionId: '',
  dueDate: dayjs(new Date()).format('YYYY-MM-DD'),
  photo: [],
  shareWith: 'everyone',
  type: 'weeklyGoals',
  updatedDate: dayjs(new Date()).format('YYYY-MM-DD')
})

const fakepath = ref('')

const setThumbnail = (e: Event) => {
  const inputEvent = e
  const file = ((inputEvent?.target as HTMLInputElement)?.files as FileList)[0]

  form.value.photo.push(file)
  fakepath.value = URL.createObjectURL(form.value.photo[0] as File)
}

const resolution = computed(
  () =>
    userStore.userData?.categoryResolution.find((cr) => cr._id === form.value.categoryResolutionId)
      ?.resolution || ''
)

const submit = async (form: WeeklyGoalsFormInterface) => {
  if (form.photo.length && form.photo[0] instanceof File) {
    const imageKey = await imageStore.uploadImage({ image: form.photo[0] })
    form.photo[0] = imageKey
  }

  await postStore.saveWeekly(form)
  return router.push('/profile')
}
</script>

<template>
  <div class="main-content-container">
    <p class="text-lg font-semibold">Create Your Weekly Goals</p>
    <hr />

    <div>
      <p class="font-semibold text-lg text-[#3D8AF7] text-center mb-8">
        Hi {{ userStore?.userData?.username }}, you are now in week 8, let's set a goal!
      </p>

      <!-- Select Resolution's Category -->
      <span class="font-semibold text-[#3D8AF7] block mb-2">Select Category</span>
      <component
        :is="BaseSelect"
        v-model="form.categoryResolutionId"
        :list="categories"
        border="full"
        class="mb-8"
      ></component>

      <!-- Select Resolution -->
      <span class="font-semibold text-[#3D8AF7] block mb-2">Resolution</span>
      <component
        readonly
        :is="BaseInput"
        border="simple"
        :modelValue="resolution"
        class="mb-8 text-slate-400"
      ></component>

      <!-- Weekly Goals -->
      <span class="font-semibold text-[#3D8AF7] block mb-2">Weekly Goals</span>
      <component :is="BaseTextarea" v-model="form.caption" border="simple" class="mb-8"></component>

      <!-- due date input -->
      <span class="font-semibold text-[#3D8AF7] block mb-2">Due Date</span>
      <component :is="BaseDatepicker" v-model="form.dueDate" border="full" class="mb-8" />

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
      <div class="flex justify-center space-x-2 mt-8">
        <button class="btn btn-primary bg-[#3D8AF7] px-7" @click="submit(form)">SAVE</button>
        <button class="btn btn-danger" @click="router.push('/')">CANCEL</button>
      </div>
    </div>
  </div>
</template>
