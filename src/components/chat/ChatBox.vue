<template>
  <div class="pt-25 px-8 space-y-2 overflow-y-auto bg-gray-50">
    <ChatBubble
      v-for="(msg, index) in messages"
      :key="index"
      :text="msg.text || '[沒有文字]'"
      :isSelf="msg.sender === 'user'"
      :timestamp="msg.createdAt"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useChatHistory } from '@/composables/useChatHistory'
import ChatBubble from '@/components/chat/ChatBubble.vue'

const { messages, loadChatHistory } = useChatHistory()
const auth = getAuth()

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user?.uid) {
      console.log('載入聊天記錄:', user.uid)
      await loadChatHistory(user.uid)
      console.log('訊息數量:', messages.value.length)
      console.log('訊息內容:', messages.value)
    } else {
      console.warn('尚未登入，無法載入聊天紀錄')
    }
  })
})
</script>

<style scoped></style>
