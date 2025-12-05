<script lang="ts" setup>
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import { onErrorCaptured } from 'vue';

onErrorCaptured((err) => {
  console.log(err);
});
</script>

<template>
  <header>
    <header-component />
  </header>

  <main class="d-flex flex-column flex-grow-1">
    <router-view />
  </main>

  <footer class="footer mt-auto">
    <footer-component />
  </footer>
</template>
