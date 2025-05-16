<template>
  <div class="max-w-3xl mx-auto pt-25 py-10 bg-white text-gray-800">
    <h1 class="text-3xl font-bold mb-6 text-center">📝 V-Senpai 使用回饋調查</h1>
    <p class="mb-6 text-center leading-relaxed">
      感謝你使用 V-Senpai！我們希望透過這份問卷了解你的使用體驗，並持續改進我們的服務。
    </p>

    <FeedbackForm
      v-model:errorFeedback="errorFeedback"
      v-model:favoritePart="favoritePart"
      v-model:suggestion="suggestion"
      v-model:screenshotBase64="screenshotBase64"
    />

    <div class="flex justify-center mt-6">
      <button
        class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        @click="handleSubmit"
      >
        ✅ 提交回饋
      </button>
    </div>

    <p v-if="submitted" class="mt-4 text-center text-green-600 font-medium">
      💖 感謝你的寶貴意見，我們會持續改進！
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { User } from 'firebase/auth'
import { db, auth } from '@/config/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

//components
// import SurveyForm from '@/components/feedback/SurveyForm.vue'
import FeedbackForm from '@/components/feedback/FeedbackForm.vue'

const suggestion = ref('')
const submitted = ref(false)
const favoritePart = ref('')
const errorFeedback = ref('')
const screenshotBase64 = ref('')

const currentUser = ref<User | null>(null)
onMounted(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser.value = user
    } else {
      currentUser.value = null
    }
  })
})

const handleSubmit = async () => {
  if (!errorFeedback.value || !favoritePart.value || !suggestion.value) {
    alert('請完整填寫所有欄位')
    return
  }

  if (!currentUser.value) {
    alert('請先登入帳號再提交回饋')
    return
  }

  const payload = {
    uid: currentUser.value?.uid,
    suggestion: suggestion.value,
    favoritePart: favoritePart.value,
    errorFeedback: errorFeedback.value,
    screenshotBase64: screenshotBase64.value,
    createdAt: serverTimestamp(),
  }

  try {
    await addDoc(collection(db, 'feedback'), payload)
    submitted.value = true
    alert('提交成功，感謝你的回饋！')
    // 清空表單
    errorFeedback.value = ''
    favoritePart.value = ''
    suggestion.value = ''
    screenshotBase64.value = ''
    // surveySections.value.forEach((section) => {
    //   section.questions.forEach((question) => {
    //     question.answer = null
    //   })
    // })
  } catch (err: any) {
    console.error('提交失敗:', err.message || err)
    alert('提交失敗，請稍後再試')
  }
}
</script>
