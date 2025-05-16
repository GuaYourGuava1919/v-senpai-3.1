<template>
  <div
    class="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#fdfefe] to-[#f5f7fa] pt-25 sm:px-6 py-10 text-gray-800"
  >
    <div class="text-center w-full max-w-xl p-10">
      <h1 class="text-3xl sm:text-4xl font-extrabold mb-4 leading-snug">
        歡迎來到 <span class="text-green-500 animate-pulse">V-Senpai</span> 🎓
      </h1>

      <p class="text-base sm:text-lg text-gray-600 mb-4">
        我是你的學長姐小助手，幫你解答系統分析與專題相關的疑惑 ✨
      </p>

      <p class="text-sm sm:text-base text-gray-700 mb-3 leading-relaxed">
        🔐 請先登入 GitHub，並在授權畫面確認授權給
        <span class="font-semibold text-indigo-500">GuaYourGuava1919</span>。
      </p>

      <p class="text-xs sm:text-sm text-gray-500 italic mb-6">
        📝 阿緹的論文需要你 ❤️（5/4 已開放回饋功能）
      </p>

      <img
        class="w-full max-w-sm mx-auto rounded-2xl mb-8 shadow-md transition hover:scale-105 hover:shadow-xl duration-300"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEQ9UAjQuEGP1I8as1m32Qg33gslPq8CHCQg&s"
        alt="V-senpai 可愛歡迎圖片"
      />

      <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
        <router-link
          to="/personal"
          class="px-6 py-3 w-full sm:w-auto bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition shadow-md text-center"
        >
          🚀 開始使用
        </router-link>

        <button
          @click="goToDocs"
          class="px-6 py-3 w-full sm:w-auto bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition shadow-md"
        >
          📘 查看說明
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 範例點擊用：可改為打開文件連結
function goToDocs() {
  window.open('https://your-doc-link.example.com', '_blank')
}
</script>
