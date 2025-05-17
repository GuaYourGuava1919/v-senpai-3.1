<template>
  <div class="flex my-5" :class="isSelf ? 'justify-end' : 'justify-start'">
    <div class="flex flex-col" :class="isSelf ? 'items-end' : 'items-start'">
      <div
        class="max-w-md px-4 py-2 rounded-2xl shadow-md whitespace-pre-wrap break-words"
        :class="
          isSelf
            ? 'bg-primary-500 text-white rounded-br-none'
            : 'bg-primary-100 text-primary-800 rounded-bl-none'
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
              class="text-xs text-primary-800 bg-primary-200 hover:bg-primary-100 transition rounded-full px-3 py-1 shadow-sm"
              @click="showMetadataDialog = true"
            >
              原文
            </button>

            <button
              class="text-xs text-primary-600 bg-primary-100 hover:bg-primary-200 transition rounded-full px-3 py-1 shadow-sm"
              @click="showFeedback = !showFeedback"
            >
              {{ showFeedback ? '收合回饋' : '給予回饋' }}
            </button>
          </div>

          <!-- 展開回饋 -->
          <div v-if="showFeedback" class="mt-2 flex gap-3 animate-fade-in">
            <button
              class="bg-white border border-green-200 hover:border-green-400 text-green-600 px-3 py-1 rounded-full shadow-sm hover:shadow transition"
              @click="sendFeedback('up')"
            >
              <i class="fi fi-rr-social-network"></i>
            </button>
            <button
              class="bg-white border border-red-200 hover:border-red-400 text-red-500 px-3 py-1 rounded-full shadow-sm hover:shadow transition"
              @click="sendFeedback('down')"
            >
              <i class="fi fi-rr-hand"></i>
            </button>
          </div>
        </div>

        <!-- 感謝訊息 -->
        <div v-else class="text-xs text-green-600 mt-2">✅ 已收到你的回饋，感謝！</div>
      </div>
    </div>
  </div>

  <!-- Metadata Dialog -->
  <div
    v-if="showMetadataDialog"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-5"
    @click.self="showMetadataDialog = false"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[80vh] p-6 animate-fade-in overflow-y-scroll"
    >
      <h2 class="text-lg font-semibold mb-3 text-primary-800 border-b pb-2">原始內容</h2>
      <pre
        class="text-sm text-primary-700 whitespace-pre-wrap break-words font-mono leading-relaxed"
        >{{ props.metadata || '（無原文說明）' }}
      </pre>
      <div class="text-right mt-4">
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md shadow hover:bg-red-600 transition"
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
