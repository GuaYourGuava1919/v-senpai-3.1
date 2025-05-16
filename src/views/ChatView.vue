<template>
  <div class="flex flex-col h-screen">
    <!-- 中間聊天訊息區 -->
    <div class="flex-1 overflow-y-auto">
      <ChatBox :messages="messages" />
    </div>

    <!-- 輸入框區 -->
    <div class="bg-white px-4 py-3 shadow-md w-full">
      <div class="flex items-center gap-2 max-w-4xl mx-auto">
        <input
          v-model="input"
          type="text"
          placeholder="輸入訊息..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
        />
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-200"
          @click="sendMessage"
        >
          發送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatBox from '../components/chat/ChatBox.vue'
import { useChatService } from '@/composables/useChatService'

// 狀態
const input = ref('')
const isThinking = ref(false)
const messages = ref([])

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/config/firebaseConfig'
const { sendMessage, readUserData, watchFirestoreMessages } = useChatService(
  messages,
  input,
  isThinking,
)

// 初始化
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('✅ 已登入:', user.uid)
    readUserData(user.uid)
    watchFirestoreMessages(user.uid)
  } else {
    console.warn('⚠️ 尚未登入，sendMessage 不會作用')
  }
})

// 注入邏輯
// const { sendMessage } = useChatService(messages, input, isThinking)
</script>
