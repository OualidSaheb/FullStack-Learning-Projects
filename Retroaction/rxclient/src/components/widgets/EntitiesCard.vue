<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { EntityInterface } from '@/shared/interfaces/index.ts';
//import ExpandableButton from '@/components/widgets/ExpandableButton.vue';
import DeleteButton from '@/components/widgets/DeleteButton.vue';
import DataCard from '@/components/widgets/DataCard.vue';

const props = withDefaults(
  defineProps<{
    entities: any[];
    modelValue: string;
    title: string;
    createCallback?: () => Promise<Boolean>;
    deleteCallback?: (entity: EntityInterface) => Promise<Boolean>;
    duplicateCallback?: (entity: EntityInterface) => Promise<Boolean>;
  }>(),
  {}
);

const emit = defineEmits<{
  (e: 'update:modelValue', entityId: string): void;
}>();

const selectedEntity = ref<EntityInterface>();

const select = (entity: EntityInterface) => {
  selectedEntity.value = entity;
  emit('update:modelValue', entity._id);
};

let hoverStates = ref<boolean[]>(Array(props.entities?.length || 0).fill(false));

const showDeleteButton = (index: number) => {
  hoverStates.value[index] = true;
};

const hideDeleteButton = (index: number) => {
  hoverStates.value[index] = false;
};
const handleCreateAction = (): void => {
  if (props.createCallback) props.createCallback();
};

const handleDeleteAction = (entity: EntityInterface): void => {
  if (props.deleteCallback) props.deleteCallback(entity);
};

const handleDuplicateAction = (entity: EntityInterface): void => {
  if (props.duplicateCallback) props.duplicateCallback(entity);
};
</script>

<template>
  <data-card :title="title" :create-callback="createCallback">
    <template #content>
      <ul class="list-group bg-light rounded-0">
        <li
          class="list-group-item list-group-item-action d-flex justify-content-between position-relative"
          v-for="(entity, index) of entities"
          :key="entity._id"
          @click="select(entity)"
          :class="{ active: modelValue === entity._id }"
          @mouseover="showDeleteButton(index)"
          @mouseleave="hideDeleteButton(index)"
        >
          <slot name="row" :entity="entity" />

          <div class="d-flex">
            <!-- TODO : Modifier le delete-button en confirm-button générique et ajouter un bouton de duplicate -->
            <!-- <delete-button @delete-confirmed="handleDuplicateAction(entity)" /> -->
            <Transition name="slide-fade" mode="out-in">
              <delete-button
                v-if="hoverStates[index]"
                @delete-confirmed="handleDeleteAction(entity)"
              />
            </Transition>
          </div>
        </li>
      </ul>
    </template>
    <template #actions>
      <button
        v-if="!!duplicateCallback && !!selectedEntity"
        class="btn btn-link text-decoration-none text-dark"
        @click="handleDuplicateAction(selectedEntity)"
      >
        <i class="bi bi-copy btn-custom"></i>
      </button>
    </template>
  </data-card>
</template>

<style lang="sass" scoped>

.slide-fade-enter-active,
.slide-fade-leave-active
  transition: all 0.2s ease


.slide-fade-enter-from,
.slide-fade-leave-to
  transform: translateX(10px)
  opacity: 0

  //TODO: Override $bs-card-cap-color value instead
.btn-custom
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out

  &:hover
      color: var(--bs-primary)

li
  &:hover
    cursor: pointer
</style>
