<script setup lang="ts">
import HeaderComponent from '@/components/MainPageComponents/HeaderComponent.vue'
import Hero from '@/components/MainPageComponents/HeroComponent.vue'
import Stages from '@/components/MainPageComponents/StagesComp.vue'
import NewsArticles from '@/components/MainPageComponents/NewsArticles.vue'
import Contactez from '@/components/MainPageComponents/ContactezComp.vue'
import OurFeatures from '@/components/MainPageComponents/OurFeatures.vue'
import FooterComponent from '@/components/MainPageComponents/FooterComponent.vue'
import { onMounted } from 'vue'

onMounted(() => {
  if (!localStorage.getItem('courses')) {
    fetch('../data/CourseList.json')
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('courses', JSON.stringify(data))
      })
      .catch((error) => console.error('Failed to load courses:', error))
  }
})
</script>

<template>
  <main>
    <div id="mainContainer">
      <HeaderComponent class="fixed" />
      <Hero />
      <Stages class="stages" />
      <OurFeatures />
      <NewsArticles />
      <Contactez />
      <FooterComponent />
    </div>
  </main>
</template>

<style scoped>
/*  */
#mainContainer {
  display: flex;
  flex-direction: column;
}

.fixed {
  position: fixed;
  z-index: 999;
  width: 100%;
}
</style>
