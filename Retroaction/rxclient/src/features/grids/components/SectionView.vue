<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type {
  CriterionFormInterface,
  SectionInterface,
  EntityInterface
} from '@/shared/interfaces';
import SectionCard from '@/components/widgets/SectionCard.vue';
import CriterionView from '@/features/grids/components/CriterionView.vue';
import { useGridsStore } from '@/shared/stores/gridsStore';
import DataCard from '@/components/widgets/DataCard.vue';

const gridsStore = useGridsStore();

const router = useRouter();

const props = withDefaults(
  defineProps<{
    gridId: string;
    sectionId: string;
  }>(),
  {}
);

watch(
  () => props.sectionId,
  (sectionId) => {},
  { immediate: true }
);
const handleCreateCriteronAction = async (): Promise<Boolean> => {
  return !!(await gridsStore.createCriterion());
};
</script>

<template>
  <section-card title="Section en cours" v-if="gridsStore.currentSection">
    <template #content>
      <data-card
        :title="gridsStore.currentSection.title"
        :create-callback="handleCreateCriteronAction"
        :grade="gridsStore.getTotalSectionValue(gridsStore.currentSection)"
      >
        <template #content>
          <div
            v-for="(criterion, index) in gridsStore.currentSection.criteria"
            :key="criterion._id"
            class="card-body p-0"
            :class="{ 'bg-secondary': index % 2 === 0, 'bg-light': index % 2 !== 0 }"
          >
            <criterion-view :criterion="criterion" :index="index" />
          </div>
        </template>
        <template #action> </template>
      </data-card>
    </template>
    <div>
      <button type="button" class="btn btn-primary text-light m-1">
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>
  </section-card>
</template>

<style scoped lang="sass"></style>
