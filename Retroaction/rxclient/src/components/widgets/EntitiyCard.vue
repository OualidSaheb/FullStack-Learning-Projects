<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { EntityInterface } from '@/shared/interfaces/index.ts';
import SectionCard from '@/components/widgets/SectionCard.vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    entity: EntityInterface;
    updateCallback?: (entity: EntityInterface) => EntityInterface;
    cancelCallback?: () => void; // Added this line
    startCallback?: (entity: EntityInterface) => EntityInterface;
  }>(),
  { title: 'Enter title here' }
);

let initEntity = ref('');
let currentEntity = ref<EntityInterface>(props.entity);

watch(
  () => props.entity,
  (entity) => {
    console.log('entity', entity);
    if (entity != null) initEntity.value = JSON.stringify(entity);
  },
  { immediate: true }
);

let isDirty = computed(() => {
  return JSON.stringify(currentEntity.value) !== initEntity.value;
});

const handleUpdateAction = () => {
  if (props.updateCallback) {
    if (props.updateCallback(currentEntity.value)) {
      initEntity.value = JSON.stringify(currentEntity.value);
    }
  }
  console.log('isDirty', isDirty.value);
};

const handleCancelAction = () => {
  if (props.cancelCallback) {
    props.cancelCallback(); // Invoke the cancel callback
  }
};

const handleStartCallback = () => {
  if (props.startCallback) {
    if (props.startCallback(currentEntity.value)) {
      initEntity.value = JSON.stringify(currentEntity.value);
    }
  }
  console.log('isDirty', isDirty.value);
};
</script>

<template>
  <section-card :title="title">
    <template #content>
      <div class="d-flex flex-column">
        <div class="d-flex flex-column">
          <slot name="content"> Enter content here </slot>
        </div>

        <div class="card-footer d-flex justify-content-between align-items-center">
          <div>
            <button
              class="btn btn-danger m-1 text-light"
              :class="{ disabled: !isDirty }"
              @click="handleCancelAction"
            >
              Cancel
            </button>
            <button
              class="btn btn-primary text-light"
              :class="{ disabled: !isDirty }"
              @click="handleUpdateAction"
            >
              Save
            </button>
          </div>
          <div v-if="props.startCallback">
            <button class="btn btn-primary text-light" @click="handleStartCallback">start</button>
          </div>
        </div>
      </div>
    </template>
  </section-card>
</template>

<style lang="sass" scoped></style>
