<template>
  <div class="max-w-xl mx-auto px-4 py-8 text-gray-800">
    <h2 class="text-2xl font-bold mb-6">👤 資料設定</h2>

    <div class="space-y-6">
      <!-- 使用者名稱 -->
      <div>
        <label class="block mb-1 font-medium">使用者名稱（這個系統上顯示的）：</label>
        <input
          v-model="username"
          type="text"
          class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <!-- 顯示名稱 -->
      <div>
        <label class="block mb-1 font-medium">顯示名稱（原 GitHub 名稱）：</label>
        <input
          v-model="displayName"
          type="text"
          disabled
          class="w-full border bg-gray-100 rounded px-3 py-2 text-gray-500"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block mb-1 font-medium">Email：</label>
        <input
          :value="email"
          type="email"
          disabled
          class="w-full border bg-gray-100 rounded px-3 py-2 text-gray-500"
        />
      </div>

      <!-- 系級 -->
      <div>
        <label class="block mb-1 font-medium">系級：</label>
        <select v-model="userClass" class="w-full border rounded px-3 py-2">
          <option disabled value="">請選擇</option>
          <option value="2a">二甲</option>
          <option value="2b">二乙</option>
        </select>
      </div>

      <!-- 性別 -->
      <div>
        <label class="block mb-1 font-medium">性別：</label>
        <select v-model="gender" class="w-full border rounded px-3 py-2">
          <option disabled value="">請選擇</option>
          <option value="male">男</option>
          <option value="female">女</option>
          <option value="other">其他</option>
        </select>
      </div>

      <!-- 優先權 -->
      <div>
        <label class="block mb-1 font-medium">優先使用者權限：</label>
        <span class="ml-2">{{ priority ? '✅ 已開啟' : '❌ 尚未啟用' }}</span>
      </div>

      <!-- 管理者區塊 -->
      <div v-if="role" class="border-t pt-6">
        <label class="block mb-2 font-medium">管理者權限：</label>
        <span class="block mb-4">{{ role === 'admin' ? '✅ 大老大' : '❌ 未啟用' }}</span>

        <div class="flex flex-col sm:flex-row gap-4">
          <router-link
            to="/feedback-review"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center"
          >
            回饋查看
          </router-link>
          <router-link
            to="/signup-list"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center"
          >
            受測者管理
          </router-link>
        </div>
      </div>

      <!-- 儲存按鈕與訊息 -->
      <div class="pt-4">
        <button
          @click="saveSettings"
          class="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          💾 儲存變更
        </button>
        <p v-if="saved" class="text-green-600 mt-3 text-sm">✅ 已儲存</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onAuthStateChanged, updateProfile, type User } from 'firebase/auth'
import { db, auth } from '@/config/firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

// 狀態變數
const currentUser = ref<User | null>(null)
const uid = ref('')
const role = ref('')
const gender = ref('')
const username = ref('')
const saved = ref(false)
const userClass = ref('')
const priority = ref(false)
const email = ref('')
const displayName = ref('')

const saveSettings = async () => {
  try {
    // if (currentUser.value) {
    //   // ⚠️ 若日後 displayName 可編輯再開啟這行
    //   await updateProfile(currentUser.value, {
    //     displayName: displayName.value,
    //   })
    // }

    if (uid.value) {
      await updateDoc(doc(db, 'users', uid.value), {
        username: username.value || '',
        class: userClass.value,
        gender: gender.value,
        priority: priority.value,
      })
    }

    saved.value = true
    setTimeout(() => (saved.value = false), 2000)
  } catch (err) {
    console.error('❌ 儲存失敗：', err)
  }
}

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser.value = user
      uid.value = user.uid
      email.value = user.email || ''
      displayName.value = user.displayName || ''

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        username.value = data.username || ''
        userClass.value = data.class || ''
        gender.value = data.gender || ''
        role.value = data.role || ''
        priority.value = data.priority || false
      }
    }
  })
})
</script>
