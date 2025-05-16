<template>
  <div class="max-w-xl mx-auto px-4 py-8 text-gray-800">
    <h2 class="text-2xl font-bold mb-2">🧪 參與使用者受測計畫</h2>
    <p class="mb-6 text-gray-600">誠摯邀請你協助我們優化 V-Senpai 系統。</p>

    <form v-if="!submitted" @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block mb-1 font-medium">真實姓名</label>
        <input
          v-model="name"
          type="text"
          required
          class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">系級（例如：二甲）</label>
        <input
          v-model="organization"
          type="text"
          required
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">聯絡方式</label>
        <select v-model="contactMethod" required class="w-full border rounded px-3 py-2 mb-2">
          <option disabled value="">請選擇</option>
          <option value="email">電子信箱 (亦可直接加官方帳號)</option>
          <option value="line">LINE帳號名稱 (請記得加官方帳號喔)</option>
        </select>
        <input
          v-model="contactInfo"
          :placeholder="contactMethod === 'email' ? '例如：abc123@gmail.com' : '例如：黑色螃蟹'"
          type="text"
          required
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <div class="flex justify-between items-center">
        <button
          type="button"
          @click="showConsent = true"
          class="text-blue-600 hover:underline text-sm"
        >
          📖 查看參與聲明
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          提交
        </button>
      </div>
    </form>

    <div v-else class="mt-6 text-center text-green-600 font-medium">✅ 感謝你的填寫！</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const organization = ref('')
const contactMethod = ref('')
const contactInfo = ref('')
const submitted = ref(false)
const showConsent = ref(false)

function handleSubmit() {
  submitted.value = true
}
</script>
