<script setup lang="ts">
import { watch, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EntitiyCard from '@/components/widgets/EntitiyCard.vue';
import SectionCard from '@/components/widgets/SectionCard.vue';
import CorrectionView from '@/features/corrections/components/CorrectionView.vue';
import type { CorrectionInterface } from '@/shared/interfaces';
import { useEvaluationStore } from '@/shared/stores/evaluationsStore';

const EvaluationStore = useEvaluationStore();

const route = useRoute();
const router = useRouter();

const selectedEvaluationId = ref<string>('');
const selectedCorrectionId = ref<string>('');

const props = withDefaults(
  defineProps<{
    evaluationId: string;
  }>(),

  {}
);

watch(
  () => props.evaluationId,
  async (evaluationId) => {
    EvaluationStore.setCurrentGrid();
    console.log('GRID STORE', EvaluationStore.currentGrid);
    if (route.params.correctionId)
      selectedCorrectionId.value = route.params.correctionId?.toString()!;
  },
  { immediate: true }
);

onMounted(async () => {
  if (route.params.evaluationId) {
    selectedEvaluationId.value = route.params.evaluationId?.toString()!;
    console.log(route.params.evaluationId?.toString());
  }
});

watch(selectedCorrectionId, async (correctionId) => {
  if (selectedCorrectionId.value) {
    router.push({
      name: 'correction',
      params: { correctionId: correctionId }
    });
  }
});

const isRedClass = (entity: CorrectionInterface) => {
  const resultValue = entity.results[0].value || 0;
  const weight = EvaluationStore.currentGrid?.sections[0]?.criteria[0]?.weight || 1;
  const ratio = resultValue / weight;

  return ratio < 0.6 ? 'red-text' : '';
};

const getTotalWeight = () => {
  const sections = EvaluationStore.currentGrid?.sections || [];
  let totalWeight = 0;

  for (const section of sections) {
    totalWeight += section.weight || 0;
  }

  return totalWeight;
};
</script>

<template>
  <div class="row">
    <div class="d-flex col-xl-4 col-md-12 flex-column gap-4">
      <entitiy-card title="Informations sur l’évaluation" v-if="EvaluationStore.currentEvaluation"
        v-model="EvaluationStore.currentEvaluation" #content>
        <div class="mb-3">
          <label for="description" class="form-label">Commentaire général</label>
          <textarea class="form-control bg-light" id="description" rows="3"></textarea>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Description de l'énoncé</label>
          <textarea class="form-control bg-light" id="description" rows="3" placeholder=""></textarea>
        </div>
      </entitiy-card>
    </div>
    <div class="col-xl-8 col-md-12">
      <CorrectionView></CorrectionView>
    </div>
  </div>
</template>

<style scoped lang="sass">

.form-check-input
  width: 4em !important
  height: 1.5em !important
.red-text
  color: red
</style>
