<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-xl max-w-md w-full shadow-lg text-gray-800">
      <h2 class="text-xl font-bold mb-4">📝 使用者參與聲明</h2>
      <p class="text-sm leading-relaxed mb-6 space-y-1">
        <span>我了解本系統僅用於學術研究與產品優化之目的。</span><br />
        <span
          >本次測試將蒐集我在使用系統過程中所產生的互動紀錄、文字回饋與系統使用行為，並進行匿名化分析。</span
        ><br />
        <span>我所提供的資料將嚴格保密，僅用於研究與改進系統之用。</span><br />
        <span>我已充分理解本計畫內容，並自願參與此次使用者測試。</span>
      </p>
      <div class="text-right">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          關閉
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>()
defineEmits(['close'])
</script>
