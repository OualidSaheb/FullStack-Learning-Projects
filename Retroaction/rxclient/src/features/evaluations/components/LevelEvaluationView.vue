<script setup lang="ts">
import type { CriterionInterface, LevelInterface } from '@/shared/interfaces';

import { useEvaluationStore } from '@/shared/stores/evaluationsStore';

const EvaluationStore = useEvaluationStore();

const props = withDefaults(
  defineProps<{
    level: LevelInterface;
    criterion: CriterionInterface;
  }>(),
  {}
);

const updateCurrentCorrectionValue = () => {
  if (EvaluationStore.currentCorrection && EvaluationStore.currentCorrection.results) {
    // Find the result with criterionId
    const resultToUpdate = EvaluationStore.currentCorrection.results.find(
      (result) => result.criterion === props.criterion._id
    );

    if (resultToUpdate) {
      resultToUpdate.value = props.level.value;
    }
  }
};

function findResultValue(criterionId: string): number {
  const result = EvaluationStore?.currentCorrection?.results.find(
    (result) => result.criterion === criterionId
  );

  return result ? result.value : 0;
}
</script>

<template>
  <div
    class="container-fluid position-relative rx-box d-flex flex-column justify-content-between border border-1 border-dark border-top-0 border-bottom-0 border-sm p-2"
    :class="{
      'orange-background bg-primary': props.level.value === findResultValue(props.criterion._id)
    }"
    @click="updateCurrentCorrectionValue"
  >
    <div class="me-1">
      <div>{{ props.level.title }}</div>
    </div>

    <div class="align-self-end">{{ props.level.value }} pts</div>
  </div>
</template>

<style scoped lang="sass">
.orange-background
  font-weight: 700
  color: white

@media (max-width: 991.98px)
  .border-sm
    border-left: none !important
    border-right: none !important
    border-top: 1px solid var(--bs-dark) !important
</style>
