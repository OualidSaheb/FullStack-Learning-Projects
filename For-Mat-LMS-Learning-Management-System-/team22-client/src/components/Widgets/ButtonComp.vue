<script setup lang="ts">
const props = defineProps<{
  btnText?: string
  btnColor?: string
  btnBgColor?: string
  btnHoverColor?: string
  btnHoverBgColor?: string
}>()
</script>

<template>
  <button class="btn">{{ btnText }}</button>
</template>

<style scoped>
.btn {
  padding: 1rem;
  border: none;
  color: v-bind(btnColor);
  background-color: v-bind(btnBgColor);
  font-size: calc(0.5rem + 1.7vmin);
  transition: all 0.3s ease;

}

.btn:hover {
  color: v-bind(btnHoverColor);
  background-color: v-bind(btnHoverBgColor);
  cursor: pointer;
  transition: all 0.3s ease;

}

.btn:not(:hover) {
  animation: mouseOutAnimation 0.3s ease forwards;
}

@keyframes mouseOutAnimation {
  0% {
    transform: scale(1.02);
  }

  100% {
    transform: scale(1);
  }
}

.btn:active {
  transform: scale(1.02);
  background-color: v-bind(btnHoverBgColor);
  box-shadow: 0 5px #666;
  outline: none;
}
</style>
