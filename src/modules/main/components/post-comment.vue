<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'
import { BaseTextarea } from '@/components/index'
import { useCommentStore, type CommentInterface } from '@/stores/comment'

export interface Props {
  id?: string
  postId: string
  fullname?: string
  avatar?: string
  date_time?: string
  comment?: string
  replyCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  avatar: '/public/profile.png',
  replyCount: 0
})

const replies = ref<CommentInterface[]>([])

const commentStore = useCommentStore()

const newReply = ref('')

const isFetching = ref(false)

const showTextarea = ref(false)
const showReplies = ref(false)

const emit = defineEmits(['create-reply'])

const getReplies = async () => {
  if (!showReplies.value) {
    isFetching.value = true
    const result = await commentStore.getReplies(props.id as string)
    replies.value = result
    isFetching.value = false
  }

  showReplies.value = !showReplies.value
}

const replyComment = async () => {
  if (await commentStore.replyComment(props.postId, props.id as string, newReply.value)) {
    newReply.value = ''
    emit('create-reply', true)
  }
}
</script>

<template>
  <div class="p-3 rounded-lg">
    <!-- PARENT -->
    <div>
      <!-- user info -->
      <div class="flex space-x-3">
        <img :src="props.avatar" alt="user-photo" class="w-20 h-20 bg-slate-300 rounded-full" />
        <div>
          <p class="font-bold">{{ props.fullname }}</p>
          <p>{{ dayjs(props.date_time).format('DD/MM/YYYY : HH.mm') }}</p>
        </div>
      </div>

      <!-- caption -->
      <span>{{ props.comment }}</span>

      <div class="flex justify-between my-2">
        <button @click="showTextarea = !showTextarea" class="text-blue-500 underline">Reply</button>
        <button @click="getReplies" class="text-blue-500 underline">
          See {{ props.replyCount }} replies
        </button>
      </div>

      <!-- REPLIES -->
      <div v-for="reply in replies" :key="reply._id" class="ml-10 mb-4">
        <div v-if="showReplies">
          <div v-if="isFetching">Loading...</div>
          <!-- user info -->
          <div v-else class="flex space-x-3">
            <img
              :src="reply.userInfo.photo"
              alt="user-photo"
              class="w-20 h-20 bg-slate-300 rounded-full"
            />
            <div>
              <p class="font-bold">{{ reply.userInfo.username }}</p>
              <p>{{ dayjs(reply.createdDate).format('DD/MM/YYYY : HH.mm') }}</p>
            </div>
          </div>

          <!-- caption -->
          <span>{{ reply.message }}</span>
        </div>
      </div>

      <!-- TEXTAREA -->
      <div v-if="showTextarea" class="mb-4">
        <component :is="BaseTextarea" v-model="newReply" border="full" class="mb-2"></component>
        <button @click="replyComment" class="btn btn-primary bg-[#3D8AF7]">KIRIM</button>
      </div>
    </div>
  </div>
</template>
