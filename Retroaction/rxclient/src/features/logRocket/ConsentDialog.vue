<script setup lang="ts">
import { setCookie } from '@/utils/cookiesFunctions';

const emit = defineEmits(['consent-given', 'consent-notgiven']);

const giveConsent = () => {
  setCookie('logRocketConsent', 'true', 7);
  emit('consent-given');
};

const declineConsent = () => {
  setCookie('logRocketConsent', 'false', 7);
  emit('consent-notgiven');
};
</script>

<template>
  <div class="consent-dialog">
    <p>We use cookies to record your session to improve your experience. Do you consent to being recorded?</p>
    <button @click="giveConsent">Yes</button>
    <button @click="declineConsent">No</button>
  </div>
</template>

<style scoped>
.consent-dialog {
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 1000;
}

.consent-dialog p {
  margin: 0 0 10px 0;
}

.consent-dialog button {
  margin-right: 10px;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.consent-dialog button:last-child {
  background-color: #6c757d;
}

.consent-dialog button:hover {
  opacity: 0.8;
}
</style>
