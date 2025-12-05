<script setup lang="ts">
import { watch } from 'vue';
import SectionCard from '@/components/widgets/SectionCard.vue';
import CriterionEvaluationView from '@/features/evaluations/components/CriterionEvaluationView.vue';
import DataCard from '@/components/widgets/DataCard.vue';
import { useEvaluationStore } from '@/shared/stores/evaluationsStore';
const EvaluationStore = useEvaluationStore();

const props = withDefaults(
  defineProps<{
    evaluationId: string;
    correctionId: string;
  }>(),
  {}
);

watch(
  () => props.correctionId,
  (correctionId) => {
    EvaluationStore.setCurrentCorrection(correctionId);
    EvaluationStore.setCurrentGrid();
    console.log('store correction : ', EvaluationStore.currentCorrection);
  },
  { immediate: true }
);
</script>

<template>
  <section-card
    :title="`${EvaluationStore.currentCorrection?.student.firstName} ${EvaluationStore.currentCorrection?.student.lastName}`"
  >
    <template #content>
      <data-card
        v-for="section in EvaluationStore.currentGrid?.sections"
        :key="section._id"
        :title="section.title"
        v-if="EvaluationStore.currentGrid"
      >
        <template #content>
          <div
            v-for="(criterion, index) in section.criteria"
            :key="criterion._id"
            class="card-body p-0"
            :class="{ 'bg-secondary': index % 2 === 0, 'bg-light': index % 2 !== 0 }"
          >
            <criterion-evaluation-view :criterion="criterion" :index="index" />
          </div>
        </template>
      </data-card>
    </template>
  </section-card>
</template>

<style scoped lang="sass"></style>
