<template>
  <div class="px-5 py-2 bg-yellow-50 border-t border-b border-gray-200">
    <div class="flex items-center justify-between mb-3 font-bold text-gray-800">
      <span>💬 想問什麼？</span>
      <button
        @click="isCollapsed = !isCollapsed"
        class="text-sm text-blue-600 hover:underline focus:outline-none"
      >
        {{ isCollapsed ? '▼ 展開' : '▲ 收合' }}
      </button>
    </div>

    <div v-show="!isCollapsed" class="flex flex-wrap gap-2">
      <button
        v-for="(q, index) in questions"
        :key="index"
        @click="$emit('select', q)"
        class="bg-gray-100 hover:bg-gray-200 text-sm text-gray-800 rounded-full px-4 py-1 transition"
      >
        {{ q }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  questions: {
    type: Array,
    default: () => ['這個系統是做什麼的？', '如何開始使用？', '可以舉一個範例嗎？'],
  },
})

defineEmits(['select'])

const isCollapsed = ref(false)
</script>
