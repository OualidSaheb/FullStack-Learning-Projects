<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { EntityInterface } from '@/shared/interfaces/index.ts';
//import ExpandableButton from '@/components/widgets/ExpandableButton.vue';
import DeleteButton from '@/components/widgets/DeleteButton.vue';

const props = withDefaults(
  defineProps<{
    grade?: number;
    title: string;
    createCallback?: () => Promise<Boolean>;
  }>(),
  { title: 'Enter title here' }
);

const handleCreateAction = (): void => {
  if (props.createCallback) props.createCallback();
};
</script>

<template>
  <div class="card mb-3 border border-light rounded-1">
    <div class="h5 card-header bg-dark text-light d-flex justify-content-between" v-if="grade">
      <div>{{ title }}</div>
      <div>{{ grade }} pts</div>
    </div>
    <div class="h5 card-header bg-dark text-light" v-else>{{ title }}</div>
    <div class="card-body p-0 overflow-auto">
      <slot name="content" />
    </div>

    <div
      v-if="true"
      class="card-footer border-secondarydark border-top-2 d-flex justify-content-end"
    >
      <div class="d-flex flex-row">
        <slot name="actions" />
        <button
          v-if="createCallback"
          class="btn btn-link text-decoration-none text-dark"
          @click="handleCreateAction"
        >
          <i class="bi bi-plus-lg btn-custom fs-5"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>

  //TODO: Override $bs-card-cap-color value instead
.btn-custom
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out

  &:hover
      color: var(--bs-primary)

li
  &:hover
    cursor: pointer
</style>
