<script setup lang="ts">
import { ref, computed } from 'vue';
import type { SignInFormInterface } from '@/shared/interfaces';
import { useAuthStore } from '@/shared/stores';
import { useRouter } from 'vue-router';
import router from '@/router';

const authStore = useAuthStore();

const form = ref<SignInFormInterface>({
  email: '',
  password: ''
});

async function trySignIn() {
  //mainStore.setLoading(true);
  await authStore.signIn(form.value);
  if (authStore.isAuthenticated) router.push('/grids');
  //mainStore.setLoading(false);
}
</script>

<template>
  <div class="d-flex flex-column">
    
    <p class="lead">Veuillez entrer le code envoyé par courriel</p>
    <div class="form-floating mb-3 w-100">
      <input type="text" class="form-control text-white" id="floatingCode" v-model="form.password"/>
      <label class="text-white bg-transparent" for="floatingCode">Code</label>
    </div>
    <p class="align-self-end">Réenvoyer le code</p>
    <button class="btn btn-warning" @click="trySignIn">Continuer</button>
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
