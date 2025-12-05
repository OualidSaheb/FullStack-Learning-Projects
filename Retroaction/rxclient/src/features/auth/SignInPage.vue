<script setup lang="ts">
import { ref, computed } from 'vue';
import type { SignInFormInterface } from '@/shared/interfaces';
import { useAuthStore } from '@/shared/stores';
import { useRouter } from 'vue-router';
import router from '@/router';

const authStore = useAuthStore();

const form = ref<SignInFormInterface>({
  email: 'coordinator@gmail.com',
  password: 'pass123'
});

async function trySignIn() {
  //mainStore.setLoading(true);
  await authStore.signIn(form.value);
  if (authStore.isAuthenticated) router.push('/grids');
  //mainStore.setLoading(false);
}
</script>

<template>
  <div class="d-flex flex-row-reverse flex-grow-1 page">
    <div class="d-flex flex-column w-25 text-white m-4">
      <div
        class="d-flex flex-column flex-grow-1 justify-content-center align-items-center blur-background w-100"
      >
        <h1 class="">Bienvenue</h1>
        <router-view class="w-100 p-3" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.page
  background: url("@/assets/bridge.jpg") center center / cover no-repeat fixed

.blur-background
  backdrop-filter: blur(2px)

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus
    transition: background-color 5000s ease-in-out 0s
    -webkit-text-fill-color: white !important
</style>
