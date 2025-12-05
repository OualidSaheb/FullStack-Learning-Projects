<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const deleteCoursesFromLocalStorage = () => {
  localStorage.removeItem('courses')

  router.push({ path: '/' })
}
</script>
<template>
  <button @click="deleteCoursesFromLocalStorage">Effacer LocalStorage</button>
</template>

<style scoped>
button {
  background-color: var(--laccent);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  cursor: pointer;
}
</style>
