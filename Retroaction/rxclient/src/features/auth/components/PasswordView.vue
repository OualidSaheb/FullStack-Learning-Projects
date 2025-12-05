<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/shared/stores';

import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const router = useRouter();
const authStore = useAuthStore();

const error = ref(false);
const success = ref(false);

const form = ref({
  email: 'coordinator@gmail.com',
  password: 'pass123'
});

async function tryPasswordSend() {
  //mainStore.setLoading(true);
  let user = await authStore.checkEmail(form.value.email);
  //mainStore.setLoading(false);
  if (user) {
    authStore.resetEmailPassword(form.value.email);
    success.value = true;
  } else {
    error.value = true;
  }
}
</script>

<template>
  <div class="sign_container">
<!--     <div class="sign_form">
      <div class="sign_form_header">
        <img id="logo" src="../assets/logo_white.svg" alt="" srcset="" />
        <div class="brand_logo">
          <h1>Retro<span>Action</span></h1>
        </div>
      </div>
      <h3>Mot de Passe Oublier</h3>
      <p>
        Entrez votre adresse courriel.Nous vous enverrons un courriel avec un lien pour
        réinitialiser votre mot de passe.
      </p>
      <form class="sign_form_content" @submit.prevent="tryPasswordSend()">
        <input
          v-model="form.email"
          class="input"
          name="email"
          type="text"
          :label="t('signIn.email')"
          require="true"
          @focus="(success = false), (error = false)"
        />

        <button class="btn" :class="{ disabled: useMainStore().isLoading }" type="submit">
          {{ t('signIn.send') }}
        </button>
      </form>
      <transition name="fade_up">
        <div v-if="success" class="sign_form--success">
          Verifier votre boite couriel au {{ form.email }}
        </div>
      </transition>
      <transition name="fade_up">
        <div v-if="error" class="sign_form--error">
          Nous ne pouvons pas envoyer un email de changement de mdp aux {{ form.email }}
        </div>
      </transition>
      <router-link class="sign_form_link sign_form_link--back" to="/signin"
        ><span>
          <svg><use xlink:href="@src/assets/sprite.svg#icon-arrow"></use></svg
        ></span>
        {{ t('actions.return') }}</router-link
      >
    </div> -->
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
