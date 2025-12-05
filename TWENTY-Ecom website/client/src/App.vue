<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { useUser } from "@/shared/stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUser();
const router = useRouter()

</script>

<template>
  <div class="container">
    <Header  :is-authenticated="userStore.isAuthenticated" class="header"></Header>
    <main class="main">
      <RouterView></RouterView>
    </main>
    <Footer class="footer"></Footer>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main {
  margin-bottom: 150px;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
