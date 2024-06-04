<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import UserPost from '../components/user-post.vue'
import PostComment from '../components/post-comment.vue'
import { usePostStore } from '@/stores/post'
import { useRoute } from 'vue-router'
import { useCommentStore } from '@/stores/comment'
import { BaseTextarea } from '@/components'

const route = useRoute()
const postStore = usePostStore()
const commentStore = useCommentStore()

const post = computed(() => postStore.post)
const comments = ref([...commentStore.comments])

const newComment = ref('')

const refreshComment = async () => {
  await commentStore.getComments(route.params.id as string)
  comments.value = commentStore.comments
}

const addComent = async () => {
  if (newComment.value) {
    if (await commentStore.addComent(route.params.id as string, newComment.value)) {
      newComment.value = ''
      await refreshComment()
    }
  }
}

onMounted(async () => {
  await postStore.getOnePost(route.params.id as string)
  await refreshComment()
})
</script>

<template>
  <div class="main-content-container">
    <!-- USER POSTS -->
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

    <div v-for="comment in comments" :key="comment._id" class="shadow-lg border-2 rounded-lg">
      <PostComment
        :id="comment._id"
        :fullname="comment.userInfo.username"
        :avatar="comment.userInfo.photo"
        :date_time="comment.createdDate"
        :comment="comment.message"
        :replyCount="comment.replyCount"
        :postId="post._id"
        @create-reply="refreshComment"
      ></PostComment>
    </div>

    <!-- TEXTAREA -->
    <div class="shadow-lg p-3 rounded-lg border-2 mb-5">
      <component :is="BaseTextarea" v-model="newComment" border="full" class="mb-2"></component>
      <button @click="addComent" class="btn btn-primary bg-[#3D8AF7]">KIRIM</button>
    </div>
  </div>
</template>
