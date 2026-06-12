<template>
  <div class="flex flex-col h-screen">
    <!-- 中間聊天訊息區 -->
    <div class="flex-1 overflow-y-auto">
      <ChatBox :messages="messages" />
    </div>
    <SuggestedQuestions
      :questions="[
        '從系統分析與設計課程中遇到什麼問題？如何解決？',
        '使用 git 嗎？',
        '使用哪個語言、資料庫開發？為什麼選擇它？優缺點是？',
        '使用生成式人工智慧嗎？如何使用？遇到什麼問題？',
        '如何定期追蹤組員進度？遇到什麼問題？',
        '對各位的建議是？',
      ]"
      @select="handleSuggestedQuestion"
    />
    <!-- 輸入框區 -->
    <div class="bg-white px-4 py-3 shadow-md w-full">
      <div class="flex items-center gap-2 max-w-4xl mx-auto">
        <input
          v-model="input"
          type="text"
          placeholder="輸入訊息..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 transition duration-200"
        />
        <button
          class="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-200"
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
import { watchFirestoreMessages } from '@/composables/services/chatFirestoreService'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/config/firebaseConfig'
import SuggestedQuestions from '../components/chat/SuggestedQuestions.vue'

// 狀態
const input = ref('')
const isThinking = ref(false)
const messages = ref([])

// 注入主邏輯
const { sendMessage, readUserData, handleSuggestedQuestion } = useChatService(
  messages,
  input,
  isThinking,
)

// 預設訊息
const defaultMessage = {
  sender: 'ai',
  text:
    '👋 嗨～我是你的學長姊模擬助理 V-Senpai！\n' +
    '我整理了歷屆學長姊在「系統分析與設計」課程中的經驗與建議，\n' +
    '不管是選題、合作、技術、還是報告準備，你都可以問我唷～\n' +
    '如果不知道從哪裡開始，也可以點選下方的引導問題來試試看 👇',
  createdAt: new Date().toISOString(),
  metadata: '這是開場訊息',
  docid: 'init-msg',
}

// 初始化
onAuthStateChanged(auth, (user) => {
  if (user) {
    // console.log('✅ 已登入:', user.uid)
    readUserData(user.uid)
    watchFirestoreMessages(user.uid, messages, defaultMessage)
  } else {
    console.warn('⚠️ 尚未登入，sendMessage 不會作用')
  }
})
</script>
