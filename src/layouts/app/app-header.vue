<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseInput, BasePopper } from '@/components/index'
import ComponentToggleSidebar from './component-toggle-sidebar.vue'
import { appName } from '@/config/app'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const user = computed(() => userStore.userData)

const form = ref({
  key: ''
})
</script>

<template>
  <!-- Header Wrapper-->
  <nav class="header">
    <!-- Header  -->
    <div class="relative w-full flex">
      <div class="w-full flex items-center justify-between">
        <!-- Left: Sidebar Toggle Button -->
        <div class="flex">
          <!-- screen: sm -->
          <component :is="ComponentToggleSidebar" class="pr-4" />
          <router-link :to="{ path: '/' }">
            <div class="flex">
              <img src="/main-logo.png" class="w-[30px] mr-1" alt="ThinkApp Logo" />
              <h1 class="text-base font-extrabold lg:text-lg">{{ appName }}</h1>
            </div>
          </router-link>
        </div>

        <!-- Right: Header Buttons -->
        <div>
          <!-- screen: lg -->
          <div class="invisible md:visible flex items-center space-x-5">
            <component :is="BaseInput" v-model="form.key" placeholder="Cari pengguna"
              class="border-2 border-slate rounded-lg"></component>

            <router-link :to="{ path: '/' }">
              <span>Home</span>
            </router-link>

            <component :is="BasePopper" placement="bottom-start" :class="!user ? 'invisible' : ''">
              <button class="ml-5">Create Goals</button>
              <template #content>
                <div class="rounded-lg">
                  <router-link :to="{ path: '/create-resolution' }">
                    <button class="block px-5 py-3 w-full text-left bg-[#FFD5F3]">
                      Create Resolution
                    </button>
                    <hr />
                  </router-link>
                  <router-link :to="{ path: '/create-weekly-goals' }">
                    <button class="block px-5 py-3 w-full text-left bg-[#D5FFD6]">
                      Create Weekly Goals
                    </button>
                    <hr />
                  </router-link>
                  <router-link :to="{ path: '/complete-goals' }">
                    <button class="block px-5 py-3 w-full text-left bg-[#E5D5FF]">
                      Complete Goals
                    </button>
                  </router-link>
                </div>
              </template>
            </component>

            <router-link :to="{ path: '/notification' }" :class="!user ? 'invisible' : ''">
              <span>Notification</span>
            </router-link>

            <div v-if="user">
              <router-link :to="{ path: '/profile' }" class="avatar avatar-sm">
                <img :src="user.photo" class="avatar-initial rounded-full bg-warning text-white" />
              </router-link>
            </div>
            <div v-else>
              <router-link :to="{ path: '/login' }">
                <span>Login</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="postcss">
nav.header {
  @apply fixed top-0 flex w-full h-60px z-20 px-4 bg-white dark:bg-slate-900 shadow;
}

.is-sidebar-open nav.header {
  @apply lg:w-[calc(100%-(var(--sidebar-shortcut-width)+var(--sidebar-panel-width)))] lg:ml-[calc(var(--sidebar-shortcut-width)+var(--sidebar-panel-width))] duration-200;
}
</style>
