<script setup lang="ts">
const props = defineProps<{
  buttonText: string;
  buttonColor: string;
  buttonHoverColor: string;
}>();

</script>

<template>
  <button class="btn">{{ buttonText }}</button>
</template>

<style scoped>
.btn {
  max-width: 10rem;
  border-radius: 6px;
  border: black 1px solid;
  padding: 1rem;
  /*Notez qu'on peut connecter une prop directement avec le css
  en utilisant v-bind(propName) comme propriété */
  background-color: v-bind(buttonColor);
}

.btn:hover {
  background-color: v-bind(buttonHoverColor);
}
</style>
