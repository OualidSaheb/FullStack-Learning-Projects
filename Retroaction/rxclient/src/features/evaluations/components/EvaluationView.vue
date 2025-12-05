<script setup lang="ts">
import { watch, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EntitiyCard from '@/components/widgets/EntitiyCard.vue';
import SectionCard from '@/components/widgets/SectionCard.vue';
import EntitiesCard from '@/components/widgets/EntitiesCard.vue';
import type { CorrectionInterface, GridInterface } from '@/shared/interfaces';
import { useEvaluationStore, useClassroomsStore, useGridsStore } from '@/shared/stores';

const evaluationsStore = useEvaluationStore();
const gridsStore = useGridsStore();

const route = useRoute();
const router = useRouter();

const selectedEvaluationId = ref<string>('');
const selectedCorrectionId = ref<string>('');
const selectedGridId = ref<string>('');

const props = withDefaults(
  defineProps<{
    evaluationId: string;
  }>(),

  {}
);

watch(
  () => props.evaluationId,
  async (evaluationId) => {
    evaluationsStore.setCurrentGrid();
    console.log('GRID STORE', evaluationsStore.currentGrid);
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

watch(selectedGridId, async (gridId) => {
  if (evaluationsStore.currentEvaluation && gridId) {
    evaluationsStore.currentEvaluation.grid = gridsStore.getGrid(gridId);
  }
});

const isRedClass = (entity: CorrectionInterface): string => {
  const ratio = totalResultValue(entity) / getTotalWeight();

  return ratio < 0.6 ? 'red-text' : '';
};

const getTotalWeight = (): number => {
  const sections = evaluationsStore.currentGrid?.sections || [];
  let totalWeight = 0;

  for (const section of sections) {
    for (const criteria of section.criteria) {
      totalWeight += criteria.weight || 0;
    }
  }

  return totalWeight;
};
const totalResultValue = (entity: CorrectionInterface): number => {
  const evaluations = evaluationsStore.currentEvaluation;
  let entityTotalResult = 0;

  for (const correction of evaluations?.corrections || []) {
    if (correction.student._id === entity.student._id) {
      for (const result of correction.results) {
        const resultValue = result.value || 0;
        entityTotalResult += resultValue;
      }
    }
  }

  return entityTotalResult;
};
const handleUpdateCurrentEvaluationAction = () => {
  return evaluationsStore.updateCurrentEvaluation();
};
const handleStartCurrentEvaluationAction = () => {
  return evaluationsStore.startEvaluation();
};
const gridTitle = computed(() => {
  if (evaluationsStore.currentEvaluation?.grid) {
    return evaluationsStore.currentEvaluation.grid.title;
  }
  return 'Pas de grille selectionné';
});
</script>

<template>
  <div class="row" v-if="evaluationsStore.currentEvaluation">
    <div class="d-flex col-xl-4 col-md-12 flex-column gap-4">
      <entitiy-card
        title="Informations sur l’évaluation"
        v-if="evaluationsStore.currentEvaluation"
        :entity="evaluationsStore.currentEvaluation"
        :updateCallback="handleUpdateCurrentEvaluationAction"
        :startCallback="handleStartCurrentEvaluationAction"
        #content
      >
        <div class="mb-3 d-flex gap-3">
          <div class="">
            <input
              v-model="evaluationsStore.currentEvaluation.code"
              type="text"
              class="form-control bg-light"
              id="code"
              :placeholder="evaluationsStore.currentEvaluation.code || 'code'"
            />
          </div>
          <div class="d-flex align-items-center gap-2">
            <label class="form-check-label" for="flexSwitchCheckChecked">Publiée</label>

            <div class="form-check form-switch w-100">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckChecked"
                v-model="evaluationsStore.currentEvaluation.published"
              />
            </div>
          </div>
        </div>
        <div class="form-floating mb-2">
          <input
            type="text"
            class="form-control"
            id="title"
            placeholder="Nom de la grille"
            v-model="gridTitle"
          />
          <label for="title">Nom de la grille</label>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">description</label>
          <textarea
            class="form-control bg-light"
            id="description"
            rows="3"
            placeholder="text"
            v-model="evaluationsStore.currentEvaluation.note"
          ></textarea>
        </div>
      </entitiy-card>
      <section-card
        title="Liste des corrections"
        #content
        v-if="evaluationsStore.currentEvaluation && !evaluationsStore.currentEvaluation.isNew"
      >
        <entities-card
          :entities="evaluationsStore.currentEvaluation?.corrections"
          title="Étudiants"
          v-model="selectedCorrectionId"
        >
          <template #row="{ entity }: { entity: CorrectionInterface }">
            <div class="d-flex justify-content-between w-100">
              <div>
                {{ entity.student.firstName }}
                {{ entity.student.lastName }}
              </div>
              <div :class="{ 'red-text': isRedClass(entity) }">
                {{ totalResultValue(entity) }} /
                {{ getTotalWeight() }}
              </div>
            </div>
          </template>
          <template #actions>
            <button class="btn btn-link text-decoration-none text-dark">
              <i class="bi bi-pencil-square btn-custom"></i>
            </button>
            <button class="btn btn-link text-decoration-none text-dark">
              <i class="bi bi-copy btn-custom"></i>
            </button>
          </template>
        </entities-card>
      </section-card>
    </div>
    <div class="col-xl-4 col-md-12" v-if="evaluationsStore.currentEvaluation.state === 'created'">
      <section-card title="Choisir une grille" #content>
        <entities-card
          :entities="gridsStore.getGrids"
          title="Grilles de département"
          v-model="selectedGridId"
        >
          <template #row="{ entity }: { entity: GridInterface }">
            <div>{{ entity.title }}</div>
          </template>
          <template #actions> </template>
        </entities-card>
      </section-card>
    </div>
    <div
      class="col-xl-8 col-md-12"
      v-else-if="evaluationsStore.currentEvaluation.state === 'started'"
    >
      <router-view></router-view>
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
