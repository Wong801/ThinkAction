<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import { usePostStore, type UserInfoInterface } from '@/stores/post'
import moment from 'moment'
import { Swiper, SwiperSlide } from 'swiper/vue'
// import Swiper and modules styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export interface Props {
  id?: string
  user?: UserInfoInterface
  category?: string
  caption?: string
  photos?: Array<string>
  isLiked?: boolean
  cheersCount: number
  commentsCount?: number
  date_time?: string
}

const postStore = usePostStore()

const props = withDefaults(defineProps<Props>(), {
  avatar: '/public/profile.png',
  isLiked: false
  // cheers_count: 0,
  // comments_count: 0
})

const emit = defineEmits(['update:cheersCount', 'update:isLiked'])

async function cheers() {
  if (await postStore.likePost(props.id as string)) {
    emit('update:cheersCount', props.cheersCount + 1)
    emit('update:isLiked', true)
  }
}

async function undoCheers() {
  if (await postStore.unlikePost(props.id as string)) {
    emit('update:cheersCount', props.cheersCount - 1)
    emit('update:isLiked', false)
  }
}
</script>

<template>
  <div class="shadow-lg p-3 rounded-lg border-2 mb-5">
    <!-- user info -->
    <router-link :to="{ path: `/post/${props.id}` }">
      <div class="flex space-x-3 mb-3">
        <img
          :src="props.user?.photo"
          alt="user-photo"
          class="w-20 h-20 bg-slate-300 rounded-full"
        />
        <div>
          <p class="font-bold">{{ props.user?.username }}</p>
          <p>{{ props.category }}</p>
          <p>{{ moment(props.date_time).fromNow() }}</p>
        </div>
      </div>

      <!-- caption -->
      <p>{{ props.caption }}</p>
    </router-link>

    <!-- Slider main container -->
    <swiper :navigation="true" :slides-per-view="1">
      <swiper-slide v-for="photo in props.photos" :key="props.photos?.indexOf(photo)"
        ><img :src="photo" alt="goals image"
      /></swiper-slide>
    </swiper>

    <!-- cheers and comments -->
    <div>
      <div class="flex gap-x-4 items-center">
        <div v-if="!props.isLiked" class="flex items-center">
          <button @click="cheers" class="btn btn-icon rounded-full">
            <img src="/cheers.png" class="h-25px w-25px mr-2" />
          </button>
          <router-link :to="{ path: `/post/${props.id}/cheers` }">
            <span>
              {{ props.cheersCount }}
            </span>
          </router-link>
        </div>

        <div v-else class="flex items-center">
          <button @click="undoCheers" class="btn btn-icon rounded-full">
            <img src="/undo_cheers.png" class="h-25px w-25px mr-2" />
          </button>
          <router-link :to="{ path: `/post/${props.id}/cheers` }" class="px-2 py-1">
            <span>
              {{ props.cheersCount }}
            </span>
          </router-link>
        </div>

        <button class="btn btn-icon rounded-full">
          <i class="i-fas-comments h-25px w-25px mr-2"></i>{{ props.commentsCount }}
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

.swiper {
  height: 32rem;
}

.swiper .swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper .swiper-slide img {
  display: block;
  width: auto;
  height: 100%;
  object-fit: cover;
}
</style>
