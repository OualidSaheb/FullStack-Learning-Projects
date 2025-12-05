<script setup lang="ts">
import Button from '@/components/Widgets/ButtonComp.vue'
</script>

<template>
  <main>
    <div class="container">
      <div class="centent center column">
        <h1>Contactez-nous</h1>
        <p>
          Découvrez comment nos offres peuvent vous aider à réduire efficacement et de manière proactive les risques et à
          gérer la conformité.
        </p>
        <Button btnText="Contactez" btnColor="var(--laccent)" btnBgColor="white" btnHoverColor="white"
          btnHoverBgColor="var(--daccent)" class="contact-btn" />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  background-color: var(--laccent);
  color: var(--background);
  display: flex;
  justify-content: center;
}

#container {
  max-width: 720px;
}

.centent {
  margin: 100px auto;
  gap: 25px;
  text-align: center;

}

h1 {
  font-size: calc(0.5rem + 6vmin);
  line-height: 1.2;
  font-weight: 600;
}

p {
  font-size: calc(0.9rem + 1.25vmin);
  line-height: 1.2;
  font-weight: 200;

}

.btn {
  width: 50%;
  cursor: pointer;
}
</style>
