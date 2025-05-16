<template>
  <div class="mt-8 space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-2">發現錯誤或功能建議</h2>
      <textarea
        v-model="errorFeedbackModel"
        rows="4"
        placeholder="請描述你遇到的問題或建議..."
        class="w-full border border-gray-300 rounded-lg p-3"
      />
    </div>

    <div>
      <h2 class="text-lg font-semibold mb-2">上傳截圖（可選）</h2>
      <input type="file" accept="image/*" @change="handleImageUpload" class="mb-2" />
      <img
        v-if="imagePreview"
        :src="imagePreview"
        alt="預覽圖片"
        class="max-w-full mt-2 rounded border border-gray-300"
      />
    </div>

    <div>
      <h2 class="text-lg font-semibold mb-2">更多回饋 (若無，則填寫無)</h2>
      <textarea
        v-model="favoritePartModel"
        rows="3"
        placeholder="你最喜歡 V-Senpai 哪個部分？"
        class="w-full border border-gray-300 rounded-lg p-3 mb-2"
      />
      <textarea
        v-model="suggestionModel"
        rows="3"
        placeholder="還有哪些你覺得可以改進的地方？"
        class="w-full border border-gray-300 rounded-lg p-3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

// ✅ props 改成多接一個 screenshotBase64
const props = defineProps({
  errorFeedback: String,
  favoritePart: String,
  suggestion: String,
  email: String,
  screenshotBase64: String,
})

// ✅ emits 也要改為 screenshotBase64
const emit = defineEmits([
  'update:errorFeedback',
  'update:favoritePart',
  'update:suggestion',
  'update:email',
  'update:screenshotBase64', // ⬅️ 新增這個
])

const imagePreview = ref<string | null>(props.screenshotBase64 ?? null)

watch(
  () => props.screenshotBase64,
  (newVal) => {
    imagePreview.value = newVal || null
  },
)

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const maxWidth = 600
        const scale = maxWidth / img.width
        const canvas = document.createElement('canvas')
        canvas.width = Math.min(maxWidth, img.width)
        canvas.height = img.height * scale
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8) // 可調壓縮率
        imagePreview.value = compressedBase64
        emit('update:screenshotBase64', compressedBase64)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  } else {
    imagePreview.value = null
    emit('update:screenshotBase64', null)
  }
}

const errorFeedbackModel = computed({
  get: () => props.errorFeedback,
  set: (val) => emit('update:errorFeedback', val),
})
const favoritePartModel = computed({
  get: () => props.favoritePart,
  set: (val) => emit('update:favoritePart', val),
})
const suggestionModel = computed({
  get: () => props.suggestion,
  set: (val) => emit('update:suggestion', val),
})
const emailModel = computed({
  get: () => props.email,
  set: (val) => emit('update:email', val),
})
</script>
