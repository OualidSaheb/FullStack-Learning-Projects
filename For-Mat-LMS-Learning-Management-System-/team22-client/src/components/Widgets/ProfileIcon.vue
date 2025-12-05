<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>

<template>
  <div class="user-icon">
    <div class="circle"></div>
  </div>
</template>

<style scoped>
.circle {
  width: 35px;
  height: 35px;
  background-color: #e0e0e0;
  border-radius: 50%;
}
</style>
