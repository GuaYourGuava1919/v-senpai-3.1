<template>
  <div class="max-w-5xl mx-auto mt-[150px] y-10 text-gray-800">
    <h1 class="text-3xl font-bold text-center mb-4">🧪 使用者報名資料列表</h1>
    <p class="text-center text-gray-500 mb-6">目前共有 {{ signups.length }} 位報名者</p>

    <div v-if="loading" class="text-center text-gray-500 text-base mt-10">載入中...</div>
    <div v-else-if="signups.length === 0" class="text-center text-gray-500 text-base mt-10">
      尚無報名資料
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="signup in signups"
        :key="signup.id"
        :to="{
          name: 'user-messages',
          params: { uid: signup.uid },
          query: { name: signup.name },
        }"
        class="bg-white rounded-xl shadow-md border p-6 hover:shadow-lg transition block"
      >
        <h3 class="text-sm text-gray-400 font-semibold mb-1">
          # {{ signups.indexOf(signup) + 1 }}
        </h3>
        <h2 class="text-lg font-semibold text-gray-700 mb-2">{{ signup.name }}</h2>
        <p class="text-sm text-gray-600 mb-1">
          <span class="font-medium text-gray-700">系級：</span>{{ signup.organization }}
        </p>
        <p class="text-sm text-gray-600 mb-1">
          <span class="font-medium text-gray-700">聯絡方式：</span>{{ signup.contactMethod }} -
          {{ signup.contactInfo }}
        </p>
        <p class="text-xs text-gray-400 mt-3">
          建立於：{{ signup.createdAt?.toDate().toLocaleString() }}
        </p>
        <p class="text-xs text-gray-400 break-all mt-1">UID：{{ signup.uid }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { app } from '../config/firebaseConfig'
const db = getFirestore(app)

const signups = ref([])
const loading = ref(true)

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'user-test-signups'))
  signups.value = querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort((a, b) => a.createdAt?.toMillis() - b.createdAt?.toMillis())

  loading.value = false
})
</script>
