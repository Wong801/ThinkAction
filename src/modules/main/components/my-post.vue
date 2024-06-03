<script setup lang="ts">
import { ref } from 'vue'
import moment from 'moment'
import { BasePopper } from '@/components/index'
import BaseModal, { type SizeType } from '@/components/base-modal.vue'
import type { UserInfoInterface } from '@/stores/post'
const showModal = ref(false)
const sizeModal = ref<SizeType>('md')
const openModal = (size: SizeType) => {
  sizeModal.value = size
  showModal.value = true
}

export interface Props {
  id?: string
  user?: UserInfoInterface
  category?: string
  caption?: string
  photos?: Array<string>
  is_liked?: boolean
  cheers_count?: number
  comments_count?: number
  date_time?: string
}

const props = withDefaults(defineProps<Props>(), {
  photo: '/public/profile.png',
  is_liked: false,
  cheers_count: 0,
  comments_count: 0
})
</script>

<template>
  <div class="shadow-lg p-3 rounded-lg border-2 mb-5">
    <!-- user info -->
    <div class="flex space-x-3 mb-3 justify-between">
      <div class="flex">
        <div class="overflow-hidden w-[4rem] h-[4rem] rounded-full mr-6">
          <img :src="props.user?.photo" alt="user-photo" class="w-full" />
        </div>
        <div>
          <p class="font-bold">{{ props.user?.username }}</p>
          <p>{{ props.category }}</p>
          <p>{{ moment(props.date_time).fromNow() }}</p>
        </div>
      </div>

      <!-- EDIT DELETE -->
      <component :is="BasePopper" placement="bottom-start">
        <i class="i-fas-ellipsis h-35px w-35px bg-slate-700 block"></i>
        <template #content>
          <div class="rounded-lg w-[130px] bg-[#3D8AF7] font-semibold text-white">
            <!-- EDIT GOAL BUTTON -->
            <router-link :to="{ path: '/edit-goal' }">
              <button class="block px-5 py-3 w-full text-left">Edit</button>
              <hr />
            </router-link>

            <!-- DELETE GOAL BUTTON -->
            <button @click="openModal('sm')" class="block px-5 py-3 w-full text-left">
              Delete
            </button>
            <component :is="BaseModal" :is-open="showModal" @on-close="showModal = false" :size="sizeModal">
              <template #content>
                <!-- ALERT CONTENT -->
                <div class="max-h-90vh overflow-auto p-4 text-center">
                  <i class="i-far-circle-exclamation m-auto bg-amber h-35px w-35px block"></i>
                  <h2 class="py-4 text-2xl">DELETE</h2>
                  <div class="space-y-8">
                    <p>Are you sure? You won't be able to revert this!</p>

                    <!-- BUTTON DELETE & CANCEL -->
                    <div class="flex justify-center space-x-8">
                      <button class="btn btn-primary bg-[#3D8AF7]">DELETE</button>
                      <button @click="showModal = false" class="btn btn-primary bg-[#de2a2a]">
                        CANCEL
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </component>
          </div>
        </template>
      </component>
    </div>

    <!-- caption -->
    <p>{{ props.caption }}</p>

    <!-- Slider main container -->
    <swiper-container class="mySwiper" navigation="true">
      <swiper-slide v-for="photo in props.photos" :key="props.photos?.indexOf(photo)"><img :src="photo"
          alt="goals image" class="w-[200px] h-[200px]" /></swiper-slide>
    </swiper-container>

    <!-- cheers and comments -->
    <div>
      <div>
        <button class="btn btn-icon rounded-full">
          <img src="/cheers.png" class="h-25px w-25px mr-2" />
          <router-link :to="{ path: `/post/${props.id}/cheers` }">
            <span>
              {{ props.cheers_count }}
            </span>
          </router-link>
        </button>
        <button class="btn btn-icon rounded-full">
          <i class="i-fas-comments h-25px w-25px mr-2"></i>{{ props.comments_count }}
        </button>
      </div>
      <div></div>
    </div>
  </div>
</template>

<style>
html,
body {
  position: relative;
  height: 100%;
}

body {
  background: #eee;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #000;
  margin: 0;
  padding: 0;
}

swiper-container {
  width: 100%;
  height: 100%;
}

swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
