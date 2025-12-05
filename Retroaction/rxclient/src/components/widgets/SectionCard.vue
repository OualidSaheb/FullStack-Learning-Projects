<script setup lang="ts">
import { ref } from 'vue';
import type { ModelInterface } from '@/shared/interfaces/index.ts';

// const itemsVisible = ref(true);

// const toggleItemsVisibility = () => {
//   itemsVisible.value = !itemsVisible.value;
// };

const props = withDefaults(
  defineProps<{
    title: string;
  }>(),
  { title: 'Enter title here' }
);
</script>

<template>
  <div class="card bg-white border border-light rounded-1 m-1 p-3">
    <p class="h4">{{ title }}</p>
    <div class="card-body d-flex flex-column p-0">
      <slot name="content" />
    </div>
  </div>
</template>

<style lang="sass" scoped></style>
