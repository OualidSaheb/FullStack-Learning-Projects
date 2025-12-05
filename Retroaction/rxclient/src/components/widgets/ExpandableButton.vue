<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    target: string;
  }>(),
  {}
);

function buildHref() {
  return `@/assets/sprites.svg#${props.target}`;
}
</script>

<template>
  <button type="button" class="btn btn-primary">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <use :xlink:href="buildHref()" />
    </svg>
    {{ title }}
  </button>
</template>

<style lang="sass" scoped></style>
