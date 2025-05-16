<template>
  <div class="feedback-review">
    <h1>📋 使用者回饋總覽</h1>

    <div v-if="loading">讀取中...</div>
    <div v-else-if="feedbacks.length === 0">目前沒有回饋資料</div>

    <div v-for="(item, index) in feedbacks" :key="index" class="feedback-item">
      <h2>回饋 #{{ index + 1 }}</h2>
      <p><strong> 姓名：</strong>{{ item.name }}</p>
      <p><strong> 學號：</strong>{{ item.studentId }}</p>
      <p><strong> 時間：</strong>{{ formatDate(item.createdAt) }}</p>
      <p><strong> 最喜歡的部分：</strong>{{ item.favoritePart }}</p>
      <p><strong> 改進建議：</strong>{{ item.suggestion }}</p>
      <p><strong> 錯誤或問題：</strong>{{ item.errorFeedback }}</p>

      <div v-if="item.screenshotBase64">
        <p><strong>📷 上傳截圖：</strong></p>
        <img :src="item.screenshotBase64" alt="上傳圖片" class="preview-img" />
      </div>
      <button @click="deleteFeedback(item.id)" class="delete-btn">
        <i class="fi fi-rr-trash"></i>
      </button>

      <hr />
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

<style scoped lang="scss">
.feedback-review {
  max-width: 800px;
  margin: auto;
  padding: 2rem;

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  .feedback-item {
    margin-bottom: 2rem;
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    .delete-btn {
      background-color: #e3342f;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 0.95rem;
      margin-top: 1rem;

      &:hover {
        background-color: #cc1f1a;
      }
    }
  }

  .preview-img {
    max-width: 100%;
    margin-top: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  hr {
    margin-top: 1.5rem;
    border: none;
    border-top: 1px solid #ccc;
  }
}
</style>
