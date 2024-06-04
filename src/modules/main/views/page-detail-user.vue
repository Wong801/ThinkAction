<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseProfileHeader from '../components/profile-header.vue'
import BaseResolutionCategory from '../components/profile-resolution-categories.vue'
import BaseUserPost from '../components/user-post.vue'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'

const route = useRoute()
const userStore = useUserStore()
const postStore = usePostStore()

const user = computed(() => userStore.otherUser)

const postData = computed(() => postStore.posts)

const posts = ref(postData.value.data)

onMounted(async () => {
  await userStore.getOtherUser(route.params.id as string)
  await userStore.getPerformanceReport(route.params.id as string)
  await postStore.getAllPosts({ limit: 10, page: 1, userId: user.value?._id })
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
      :avatar="user.photo"
      :bio="user.bio"
      :is_private="user.isPrivate"
      :is_supporting="user.isSupporting"
      :goals_performance="user.performanceReport"
      :supporting_count="user.supportingCount"
      :supporter_count="user.supporterCount"
    ></BaseProfileHeader>

    <!-- SUPPORTING BUTTON -->
    <button v-if="!user.isSupporting" class="btn bg-[#3D8AF7] w-full font-semibold text-white">
      Support
    </button>
    <button v-else class="btn bg-slate-400 w-full font-semibold text-white">Supporting</button>

    <!-- RESOLUTIONS -->
    <hr class="border-2" />
    <BaseResolutionCategory
      :resolution_categories="user?.categoryResolution"
    ></BaseResolutionCategory>
    <hr class="border-2" />

    <!-- USER POSTS -->
    <div v-for="post in posts" :key="post._id">
      <BaseUserPost
        :id="post._id"
        :user="post.userInfo"
        :category="post.categoryResolution"
        :caption="post.caption"
        :photos="post.photo"
        v-model:isLiked="post.likedByCurrent"
        v-model:cheersCount="post.likeCount"
        :comments_count="post.commentCount"
        :date_time="post.createdDate"
      ></BaseUserPost>
    </div>
  </div>
</template>
