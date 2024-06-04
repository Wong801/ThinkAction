<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import BaseProfileHeader from '../components/profile-header.vue'
import BaseResolutionCategory from '../components/profile-resolution-categories.vue'
import BaseMyPost from '../components/my-post.vue'
import { useUserStore, type UserDataInterface } from '@/stores/user'
import { usePostStore } from '@/stores/post'

const userStore = useUserStore()
const postStore = usePostStore()

const postData = computed(() => postStore.posts)

const posts = ref(postData.value.data)

const user: Ref<UserDataInterface> = ref({ ...(userStore.userData as UserDataInterface) })

onMounted(async () => {
  await userStore.getPerformanceReport(user.value._id)
  await postStore.getAllPosts({
    page: 1,
    limit: 10,
    userId: user.value._id
  })
})

watch(
  () => postData.value.data,
  (val) => {
    posts.value = val
  }
)
</script>

<template>
  <div class="main-content-container">
    <!-- PROFILE HEADER -->
    <BaseProfileHeader
      :id="user._id"
      :full_name="user.fullname"
      :username="user.username"
      :avatar="(user.photo as string)"
      :bio="user.bio"
      :is_private="!user.isPublic"
      :is_supporting="user.isSupporting"
      :goals_performance="userStore.performanceReport"
      :supporting_count="user.supportingCount"
      :supporter_count="user.supporterCount"
    ></BaseProfileHeader>

    <!-- BUTTON EDIT PROFILE -->
    <router-link :to="{ path: '/profile/edit' }">
      <button class="btn bg-[#3D8AF7] w-full font-semibold text-white mt-5">Edit Profile</button>
    </router-link>

    <!-- RESOLUTIONS -->
    <hr class="border-2" />
    <BaseResolutionCategory
      :resolution_categories="user.categoryResolution"
    ></BaseResolutionCategory>
    <hr class="border-2" />

    <!-- USER POSTS -->
    <div v-for="post in posts" :key="post._id">
      <BaseMyPost
        class=""
        :id="post._id"
        :user="post.userInfo"
        :category="post.categoryResolution"
        :caption="post.caption"
        :photos="post.photo"
        :is_liked="false"
        :cheers_count="post.likeCount"
        :comments_count="post.commentCount"
        :date_time="post.createdDate"
      ></BaseMyPost>
    </div>
  </div>
</template>
