<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { BaseInput, BaseSelect } from '@/components/index'
import {
  useUserStore,
  type UserDataInterface,
  type UserUpdateProfileInterface
} from '@/stores/user'
import { useImageStore } from '@/stores/image'

const userStore = useUserStore()
const imageStore = useImageStore()

const user: Ref<UserDataInterface> = ref({ ...(userStore.userData as UserDataInterface) })

const form: Ref<UserUpdateProfileInterface> = ref({
  bio: user.value.bio,
  fullname: user.value.fullname,
  isPublic: user.value.isPublic,
  photo: user.value.photo,
  username: user.value.username
})

const fakepath = ref('')

const setThumbnail = (e: Event) => {
  const inputEvent = e
  const file = ((inputEvent?.target as HTMLInputElement)?.files as FileList)[0]

  form.value.photo = file
  fakepath.value = URL.createObjectURL(form.value.photo)
}

const editProfile = async (payload: UserUpdateProfileInterface) => {
  if (payload.photo instanceof File) {
    const imageKey = await imageStore.uploadImage({ image: payload.photo })
    payload.photo = imageKey
  } else {
    payload.photo = undefined
  }

  await userStore.editUserData(payload)

  form.value.bio = user.value.bio
  form.value.fullname = user.value.fullname
  form.value.isPublic = user.value.isPublic
  form.value.photo = user.value.photo
  form.value.username = user.value.username
}

const list = [
  { id: 1, label: 'Private', value: false },
  { id: 2, label: 'Public', value: true }
]

// const languages = ref([
//   { id: 1, label: 'English' },
//   { id: 2, label: 'Indonesian' }
// ])
</script>

<template>
  <div class="grid grid-cols-1 md:p-12 lg:p-4 md:p-[70px] lg:w-[700px] lg:text-md lg:m-auto">
    <div class="flex justify-between">
      <router-link :to="{ path: '/profile/edit' }">
        <button>
          <h3 class="font-semibold hover:text-blue-600">Edit Profile</h3>
        </button>
      </router-link>
      <router-link :to="{ path: '/profile/edit-password' }">
        <button>
          <h3 class="font-semibold hover:text-blue-600">Edit Password</h3>
        </button>
      </router-link>
    </div>
    <hr class="bg-slate h-[1px]" />

    <div class="flex justify-center space-x-5 mt-5">
      <div class="mt-5 rounded-full h-[8rem] w-[8rem] overflow-hidden">
        <img :src="fakepath || (form.photo as string)" alt="user photo" class="w-full" />
      </div>
      <div class="mt-5">
        <p>{{ form.fullname }}</p>

        <!-- CHANGE FOTO PROFILE -->
        <span class="font-semibold text-[#3D8AF7] block mb-2">Change your profile picture</span>
        <label class="btn btn-primary bg-[#3D8AF7] mb-8">
          <input
            @change="setThumbnail"
            type="file"
            class="pointer-events-none absolute opacity-0"
          />
          <div class="flex items-center space-x-2">
            <!-- <i class="block i-far-arrow-up-from-bracket"></i> -->
            <span>Choose File</span>
          </div>
        </label>
      </div>
    </div>

    <!-- input - full_name -->
    <span class="font-semibold text-[#3D8AF7] block mb-2">Full Name</span>
    <component :is="BaseInput" v-model="form.fullname" class="mb-8"></component>

    <!-- input - username -->
    <span class="font-semibold text-[#3D8AF7] block mb-2">Username</span>
    <component :is="BaseInput" v-model="form.username" class="mb-8"></component>

    <!-- input - email -->
    <span class="font-semibold text-[#3D8AF7] block mb-2">Email</span>
    <component :is="BaseInput" v-model="user.email" class="mb-8" disabled></component>

    <!-- input - bio -->
    <span class="font-semibold text-[#3D8AF7] block mb-2">Bio</span>
    <component :is="BaseInput" v-model="form.bio" class="mb-8"></component>

    <!-- share with -->
    <span class="font-semibold text-[#3D8AF7] block mb-2">Account Type</span>
    <component :is="BaseSelect" class="mb-8" v-model="user.isPublic" :list="list" border="full">
    </component>

    <!-- share with -->
    <!-- <span class="font-semibold text-[#3D8AF7] block mb-2">Language</span>
    <component :is="BaseSelect" v-model="languages" :list="languages" border="full"></component> -->

    <div class="flex justify-center space-x-8 mt-8">
      <button @click="editProfile(form)" class="btn btn-primary bg-[#3D8AF7] px-7">SAVE</button>
      <button class="btn btn-primary bg-[#de2a2a]">CANCEL</button>
    </div>
  </div>
</template>
