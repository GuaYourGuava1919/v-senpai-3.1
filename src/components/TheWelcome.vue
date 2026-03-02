<template>
  <div
    class="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#fdfefe] to-[#f5f7fa] sm:px-6 py-10 text-gray-800"
  >
    <div class="text-center w-full max-w-xl p-10">
      <h1 class="text-3xl sm:text-4xl font-extrabold mb-4 leading-snug">V-Senpai 已搬新家 🎓</h1>

      <p class="text-base sm:text-lg text-gray-600 mb-4">
        我們已升級至全新網站，提供更穩定的服務與體驗 ✨
      </p>

      <p class="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed">
        請前往新的入口繼續使用：
      </p>

      <a
        href="https://senpai-40.vercel.app/"
        target="_blank"
        class="inline-block px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold shadow-md hover:scale-105 hover:bg-primary-600 transition"
      >
        前往新網站 →
      </a>

      <p class="text-xs sm:text-sm text-gray-400 mt-6 italic">舊網站將不再更新，感謝您的支持 ❤️</p>

      <ImageCarousel class="mt-8" />
    </div>
  </div>
</template>

<script setup>
import ImageCarousel from '@/components/ImageCarousel.vue'
</script>
