<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { BaseInput } from '@/components/index'
import UserSneakpeak from '../components/user-sneakpeak.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const userSupporter = computed(() => userStore.userSupporter)

const form = ref({
  key: ''
})

onMounted(async () => {
  await userStore.getAllSupporter(userStore.userData?._id as string)
})
</script>

<template>
  <div class="main-content-container">
    <!-- SEARCH -->
    <component
      :is="BaseInput"
      v-model="form.key"
      placeholder="Cari pengguna"
      class="border-1 border-slate rounded-lg"
    >
    </component>

    <!-- LIST SUPPORTER -->
    <div class="flex justify-between" v-for="supporter in userSupporter.data" :key="supporter._id">
      <router-link :to="{ path: `user/${supporter._id}` }">
        <UserSneakpeak
          :id="supporter._id"
          :fullname="supporter.fullname"
          :username="supporter.username"
          :avatar="supporter.photo"
        ></UserSneakpeak>
      </router-link>
      <div class="flex space-x-2">
        <button
          v-if="supporter.isSupporting == true"
          class="bg-slate-400 h-[40px] rounded-lg mt-6 px-3 text-white font-semibold"
        >
          Supporting
        </button>
        <button
          v-if="supporter.isSupporting == false"
          class="bg-[#3D8AF7] h-[40px] rounded-lg mt-6 px-6 text-white font-semibold"
        >
          Support
        </button>
        <button class="bg-slate-400 h-[40px] rounded-lg mt-6 px-3 text-white font-semibold">
          Remove
        </button>
      </div>
    </div>
  </div>
</template>
