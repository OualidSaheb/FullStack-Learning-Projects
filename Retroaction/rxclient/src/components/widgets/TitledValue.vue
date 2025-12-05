<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    title: string;
    value: string;
  }>(),
  {}
);
</script>

<template>
  <div class="d-flex flex-column control">
    <label class="title"> {{ props.title }} </label>
    <label class="value"> {{ props.value }} </label>
  </div>
</template>

<style lang="sass" scoped>
.control
  padding: 6px 12px
.title
  font-size: 2.8rem
  color: var(--form-text-color)

.value
  font-size: 1.0rem
  color: var(--primary-color)
  margin-bottom: 0.5rem
</style>
