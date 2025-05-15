<template>
  <div class="flex flex-col h-screen">
    <!-- 中間聊天訊息區 -->
    <div class="flex-1 overflow-y-auto bg-gray-800">
      <ChatBox />
    </div>

    <!-- 輸入框區 -->
    <div class="bg-white px-4 py-3 shadow-md w-full">
      <div class="flex items-center gap-2 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="輸入訊息..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
        />
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-200"
        >
          發送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatBox from '../components/chat/ChatBox.vue'
</script>
