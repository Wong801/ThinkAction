<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import UserPost from '../components/user-post.vue'
import { usePostStore } from '@/stores/post'

const postStore = usePostStore()

const postData = computed(() => postStore.posts)

const posts = ref(postData.value.data)

onMounted(async () => {
  await postStore.getAllPosts()
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
    <!-- jika post belum dibuat -->
    <div v-if="!posts.length" class="flex justify-center lg:space-x-15">
      <div class="md:mt-[50px] lg:mt-[100px] space-y-5">
        <h1 class="font-extrabold">Welcome to ThinkAction</h1>
        <p>
          Please, create your goals to start this app. <br class="invisible md:visible" />
          In bellow details guideline for create your goals:
        </p>

        <!-- to do -->
        <div class="space-y-5">
          <div class="card p-4 bg-[#FFD5F3]">
            <span>1. Create your resolutions</span>
          </div>
          <div class="card p-4 bg-[#D5FFD6]">
            <span>2. Create your weekly goals</span>
          </div>
          <div class="card p-4 bg-[#E5D5FF]">
            <span>3. Complete your goals</span>
          </div>
        </div>
      </div>
      <img
        src="/goals.png"
        class="w-0 md:w-[400px] lg:w-[600px] invisible md:visible"
        alt="goals image ilustration"
      />
    </div>

    <div v-else>
      <!-- jika goals sudah dibuat -->
      <div v-for="post in posts" :key="post._id">
        <UserPost
          :id="post._id"
          :user="post.userInfo"
          :category="post.categoryResolution"
          :caption="post.caption"
          :photos="post.photo"
          v-model:isLiked="post.likedByCurrent"
          v-model:cheersCount="post.likeCount"
          :commentsCount="post.commentCount"
          :date_time="post.createdDate"
        ></UserPost>
      </div>
    </div>
  </div>
</template>
