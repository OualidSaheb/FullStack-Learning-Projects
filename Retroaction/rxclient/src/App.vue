<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ConsentDialog from '@/features/logRocket/ConsentDialog.vue';
import { getCookie } from '@/utils/cookiesFunctions';
import { initializeLogRocket } from '@/utils/logRocketSetup';

const showConsentDialog = ref(false);

const handleConsentGiven = () => {
  showConsentDialog.value = false;
  initializeLogRocket("undefined", "undefined@null.com");
};

const handleConsentNotGiven = () => {
  showConsentDialog.value = false; // Assuming you want to hide after declining
};

onMounted(() => {
  const consent = getCookie('logRocketConsent');
  console.log(consent);
  if (consent === 'true') {
    initializeLogRocket("undefined", "undefined@null.com");
  } else {
    console.log("wtf");
    showConsentDialog.value = true;
  }
});
</script>

<template>
  <ConsentDialog v-if="showConsentDialog" @consent-given="handleConsentGiven" @consent-notgiven="handleConsentNotGiven"/>
  <router-view />
</template>

<style lang="sass">
// Your styles here
</style>
