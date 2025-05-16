<template>
  <div class="user-settings-page">
    <h1>👤 個人設置</h1>
    <!-- 個人資料修改 -->
    <UserProfileSettings />
    <hr class="divider" />
    <!-- 受測報名表單 -->
    <UserTestSignupForm />
  </div>
</template>

<script setup lang="ts">
import UserTestSignupForm from '../components/personal/UserTestSignupForm.vue'
import UserProfileSettings from '../components/personal/UserProfileSettings.vue'
</script>

<script setup lang="ts"></script>

<style scoped></style>
