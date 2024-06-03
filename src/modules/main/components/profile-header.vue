<script setup lang="ts">
import { RouterLink } from 'vue-router'
export interface Props {
  id: string
  full_name: string
  username: string
  avatar?: string
  bio: string
  is_private: boolean
  is_supporting: boolean
  goals_performance: number
  supporting_count: number
  supporter_count: number
}

const props = withDefaults(defineProps<Props>(), {
  avatar: '/public/profile.png'
})
</script>

<template>
  <div class="flex text-center space-x-16">
    <div class="w-[18rem]">
      <div class="w-full h-[14rem] rounded-full overflow-hidden m-4">
        <img :src="props.avatar || '/public/profile.png'" class="w-full" />
      </div>
      <span class="font-semibold text-center">{{ props.full_name }}</span>
    </div>

    <div class="w-full">
      <!-- goals performance, supporter, supporting -->
      <div class="flex justify-between space-x-8 px-8 py-12">
        <div>
          <p>{{ props.goals_performance + '%' }}</p>
          <p>Goals Performance</p>
        </div>
        <router-link :to="{ path: 'supporters' }">
          <div>
            <p>{{ props.supporter_count }}</p>
            <p>Supporter</p>
          </div>
        </router-link>
        <router-link :to="{ path: 'supporting' }">
          <div>
            <p>{{ props.supporting_count }}</p>
            <p>Supporting</p>
          </div>
        </router-link>
      </div>
      <p class="text-left mt-8 px-8">
        {{ props.bio }}
      </p>
    </div>
  </div>
</template>
