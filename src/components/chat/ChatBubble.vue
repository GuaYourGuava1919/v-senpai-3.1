<template>
  <div class="flex mb-2" :class="isSelf ? 'justify-end' : 'justify-start'">
    <div class="flex flex-col" :class="isSelf ? 'items-end' : 'items-start'">
      <div
        class="max-w-md px-4 py-2 rounded-2xl shadow-md whitespace-pre-wrap break-words"
        :class="
          isSelf
            ? 'bg-indigo-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        "
      >
        {{ text }}
      </div>

      <span class="text-xs text-gray-400 mt-1" v-if="timestamp">{{ timestamp }}</span>

      <!-- 回饋區塊（僅非自己訊息顯示） -->
      <div v-if="!isSelf" class="mt-2">
        <div v-if="!feedbackGiven">
          <div class="flex gap-3">
            <!-- 主控按鈕 -->
            <button
              class="text-xs text-indigo-800 bg-indigo-300 hover:bg-indigo-200 transition rounded-full px-3 py-1 shadow-sm"
              @click="showMetadataDialog = true"
            >
              原文
            </button>

            <button
              class="text-xs text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition rounded-full px-3 py-1 shadow-sm"
              @click="showFeedback = !showFeedback"
            >
              {{ showFeedback ? '收合回饋' : '給予回饋' }}
            </button>
          </div>
          <!-- 展開回饋 -->
          <div v-if="showFeedback" class="mt-2 flex gap-3 animate-fade-in">
            <button
              class="bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-600 px-3 py-1 rounded-full shadow-sm hover:shadow transition"
              @click="sendFeedback('up')"
            >
              👍 喜歡
            </button>
            <button
              class="bg-white border border-red-200 hover:border-red-400 text-red-500 px-3 py-1 rounded-full shadow-sm hover:shadow transition"
              @click="sendFeedback('down')"
            >
              👎 不喜歡
            </button>
          </div>
        </div>

        <!-- 感謝訊息 -->
        <div v-else class="text-xs text-green-600 mt-2">✅ 已收到你的回饋，感謝！</div>
      </div>
    </div>
  </div>
  <!-- Metadata Dialog -->
  <!-- Dialog 背景區 -->
  <div
    v-if="showMetadataDialog"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="showMetadataDialog = false"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[80vh] p-6 animate-fade-in overflow-y-auto"
    >
      <h2 class="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">原始內容</h2>
      <pre class="text-sm text-gray-700 whitespace-pre-wrap break-words font-mono leading-relaxed"
        >{{ props.metadata || '（無原文說明）' }}
    </pre
      >
      <div class="text-right mt-4">
        <button
          class="text-sm text-indigo-600 hover:underline hover:text-indigo-800"
          @click="showMetadataDialog = false"
        >
          關閉
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  text: string
  isSelf?: boolean
  timestamp?: string
  metadata?: string
}>()

const emit = defineEmits<{
  (e: 'feedback', payload: { type: 'up' | 'down'; text: string }): void
}>()

const showFeedback = ref(false)
const feedbackGiven = ref(false)
const showMetadataDialog = ref(false)

function sendFeedback(type: 'up' | 'down') {
  emit('feedback', { type, text: props.text })
  feedbackGiven.value = true
  showFeedback.value = false
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>
