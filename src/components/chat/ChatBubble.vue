<template>
  <div class="flex mb-2" :class="isSelf ? 'justify-end' : 'justify-start'">
    <div class="flex flex-col items-end" v-if="isSelf">
      <div class="max-w-xs bg-indigo-500 text-white px-4 py-2 rounded-2xl rounded-br-none shadow">
        {{ text }}
      </div>
      <span class="text-xs text-gray-400 mt-1" v-if="timestamp">{{ timestamp }}</span>
    </div>

    <div class="flex flex-col items-start" v-else>
      <div class="max-w-xs bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none shadow">
        {{ text }}
      </div>
      <span class="text-xs text-gray-400 mt-1" v-if="timestamp">{{ timestamp }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
  isSelf?: boolean
  timestamp?: string
}>()
</script>
