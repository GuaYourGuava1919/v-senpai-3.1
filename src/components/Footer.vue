<template>
  <div>
    <footer class="bg-primary-100 border-t py-4 w-full text-center text-sm text-gray-600">
      <div class="max-w-5xl mx-auto px-4 text-center space-y-2">
        <p class="text-sm text-gray-600">&copy; 2025 GuaYourGuava. All rights reserved.</p>
        <nav class="flex flex-wrap justify-center gap-4 text-sm">
          <a
            href="#"
            class="text-gray-700 hover:text-primary-500 hover:underline"
            @click.prevent="openPolicy"
          >
            隱私權政策
          </a>
          <a
            href="#"
            class="text-gray-700 hover:text-primary-500 hover:underline"
            @click.prevent="openTerms"
          >
            使用條款
          </a>
          <a
            href="https://lin.ee/QL9vs11"
            target="_blank"
            class="text-gray-700 hover:text-primary-500 hover:underline"
          >
            聯絡阿緹
          </a>
        </nav>
      </div>
    </footer>

    <!-- Modal -->
    <div
      v-if="showTerms || showPolicy"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative animate-popup"
      >
        <!-- 關閉按鈕 -->
        <button
          class="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-green-500 transition"
          @click="closeModal"
          aria-label="關閉"
        >
          &times;
        </button>

        <!-- 條款內容 -->
        <div
          class="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed"
          v-html="showTerms ? termsHtml : policyHtml"
        />

        <!-- 同意按鈕 -->
        <button
          class="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg shadow transition"
          @click="closeModal"
        >
          ✅ 我已閱讀並同意
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { marked } from 'marked'

const termsHtml = ref('')
const policyHtml = ref('')
const showTerms = ref(false)
const showPolicy = ref(false)

function openTerms() {
  fetch('/terms.md')
    .then((res) => res.text())
    .then((text) => {
      termsHtml.value = marked(text)
      showTerms.value = true
      showPolicy.value = false
    })
}

function openPolicy() {
  fetch('/privacy-policy.md')
    .then((res) => res.text())
    .then((text) => {
      policyHtml.value = marked(text)
      showPolicy.value = true
      showTerms.value = false
    })
}

function closeModal() {
  showTerms.value = false
  showPolicy.value = false
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
