<template>
  <div class="max-w-3xl mx-auto pt-25 py-10">
    <h1 class="text-2xl font-bold mb-6">🗂️ 使用者對話紀錄</h1>
    <p class="text-gray-500 mb-4">UID：{{ uid }}</p>
    <p class="text-gray-500 mb-4">使用者名稱：{{ name || '未知' }}</p>
    <p class="text-gray-500 mb-4">對話紀錄數量：{{ chatPairs.length }}</p>
    <div v-if="chatPairs.length === 0" class="text-gray-400">尚無對話紀錄</div>
    <div v-else class="space-y-6">
      <div v-for="(pair, index) in chatPairs" :key="index" class="bg-gray-100 rounded p-4 shadow">
        <p class="mb-1 text-gray-700"><strong>使用者：</strong> {{ pair.user }}</p>
        <p class="text-blue-700"><strong>AI：</strong> {{ pair.ai }}</p>

        <div v-if="pair.metadata" class="mt-2">
          <button
            @click="expanded[index] = !expanded[index]"
            class="text-xs text-indigo-600 hover:underline focus:outline-none"
          >
            {{ expanded[index] ? '🔽 收合原始資料' : '▶️ 查看原始資料' }}
          </button>

          <div
            v-if="expanded[index]"
            class="mt-2 text-xs text-gray-500 whitespace-pre-wrap bg-white border rounded p-2"
          >
            {{ pair.metadata }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import type { ChatPair } from '@/composables/useChatService'
import { useChatService } from '@/composables/useChatService'

const route = useRoute()
const uid = route.params.uid as string
const name = (route.query.name as string) || ''
const expanded = ref<boolean[]>([]) // 控制每一則對話是否展開

const chatPairs = ref<ChatPair[]>([])
const messages = ref([])
const input = ref('')
const isThinking = ref(false)

const { fetchChatHistoryFromFirestore } = useChatService(messages, input, isThinking)

onMounted(async () => {
  chatPairs.value = await fetchChatHistoryFromFirestore(uid)
  expanded.value = Array(chatPairs.value.length).fill(false)
})
</script>
