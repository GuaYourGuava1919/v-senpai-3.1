<template>
  <div class="relative w-60 h-60 mx-auto overflow-hidden rounded-2xl shadow-lg">
    <div
      class="flex transition-transform duration-700 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div v-for="(img, index) in images" :key="index" class="w-full flex-shrink-0">
        <img :src="img" class="w-60 h-60 object-cover" />
      </div>
    </div>

    <!-- 左右箭頭 -->
    <button
      @click="prev"
      class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
    >
      ‹
    </button>
    <button
      @click="next"
      class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
    >
      ›
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const images = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1ZxSvM28ripK19JeZzHgZJRiJFrJYS4NOKg&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUS8BJwTfG1xulHsmaOMMjA-f2W7n0xpRF-Bgd_BsIqTbbLiMN9pXe35oyCGzLVeVZ-yY',
  'https://truth.bahamut.com.tw/s01/201911/53542e9977713a1d432bd63d2f3ef975.JPG',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEQ9UAjQuEGP1I8as1m32Qg33gslPq8CHCQg&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6JL1nnyEXDOZxtLpvqNXGCJRJVtawkhsRjQ&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA-bpNZ6mcRg1hvyi7OjLwpo_DzaSLQPTpJbQHd8yifTGrdshHdk_zcQ1kJAVI8LvE5HE&s',
]

const currentIndex = ref(0)

function next() {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
}

// 自動播放
onMounted(() => {
  setInterval(() => {
    next()
  }, 3000)
})
</script>
