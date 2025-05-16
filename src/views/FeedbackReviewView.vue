<template>
  <div class="max-w-4xl mx-auto mt-[150px] py-10">
    <h1 class="text-3xl font-bold text-center mb-8">📋 使用者回饋總覽</h1>

    <div v-if="loading" class="text-center text-gray-600">讀取中...</div>
    <div v-else-if="feedbacks.length === 0" class="text-center text-gray-500">目前沒有回饋資料</div>

    <div
      v-for="(item, index) in feedbacks"
      :key="index"
      class="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-300"
    >
      <h2 class="text-xl font-semibold mb-4">回饋 #{{ index + 1 }}</h2>
      <p><span class="font-medium">姓名：</span>{{ item.uid }}</p>
      <p><span class="font-medium">時間：</span>{{ formatDate(item.createdAt) }}</p>
      <p><span class="font-medium">最喜歡的部分：</span>{{ item.favoritePart }}</p>
      <p><span class="font-medium">改進建議：</span>{{ item.suggestion }}</p>
      <p><span class="font-medium">錯誤或問題：</span>{{ item.errorFeedback }}</p>

      <div v-if="item.screenshotBase64" class="mt-4">
        <p class="font-medium mb-1">📷 上傳截圖：</p>
        <img
          :src="item.screenshotBase64"
          alt="上傳圖片"
          class="max-w-full rounded border border-gray-300"
        />
      </div>

      <button
        @click="deleteFeedback(item.id)"
        class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        刪除
      </button>

      <hr class="mt-6 border-t border-gray-300" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { db } from '@/config/firebaseConfig'
import { collection, getDocs, Timestamp, deleteDoc, doc, orderBy, query } from 'firebase/firestore'

interface Feedback {
  id: string
  name: string
  favoritePart: string
  suggestion: string
  errorFeedback: string
  studentId: string
  screenshotBase64?: string
  createdAt: Timestamp
}

const feedbacks = ref<Feedback[]>([])
const loading = ref(true)

async function fetchFeedbacks() {
  const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)

  feedbacks.value = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Feedback, 'id'>),
  }))

  loading.value = false
}

function formatDate(timestamp: Timestamp | undefined) {
  if (!timestamp) return '未知'
  const date = timestamp.toDate()
  return date.toLocaleString()
}

async function deleteFeedback(id: string) {
  const confirmDelete = confirm('確定要刪除此回饋嗎？此操作無法復原')
  if (!confirmDelete) return

  try {
    await deleteDoc(doc(db, 'feedback', id))
    feedbacks.value = feedbacks.value.filter((item) => item.id !== id)
    alert('✅ 回饋已刪除')
  } catch (err) {
    console.error('❌ 刪除失敗：', err)
    alert('刪除失敗，請稍後再試')
  }
}

onMounted(fetchFeedbacks)
</script>
