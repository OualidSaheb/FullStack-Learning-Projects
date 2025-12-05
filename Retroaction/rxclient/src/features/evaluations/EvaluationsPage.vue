<script setup lang="ts">
import SectionCard from '@/components/widgets/SectionCard.vue';
import EntitiesCard from '@/components/widgets/EntitiesCard.vue';
import type { EvaluationInterface, GridInterface, ClassroomInterface } from '@/shared/interfaces';
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useClassroomsStore, useEvaluationStore, useGridsStore } from '@/shared/stores';

const classroomsStore = useClassroomsStore();
const gridsStore = useGridsStore();

const route = useRoute();
const router = useRouter();
const evaluationsStore = useEvaluationStore();

const selectedClassroomId = ref<string>('');

const selectedEvaluationId = ref<string>('');

watch(selectedEvaluationId, async (evaluationId) => {
  await evaluationsStore.fetchPopulatedEvaluation(evaluationId);
  if (selectedEvaluationId.value) {
    router.push({
      name: 'evaluation',
      params: { evaluationId: evaluationId }
    });
  }
});

watch(selectedClassroomId, async (classroomId, oldValue) => {
  await classroomsStore.fetchPopulatedClassroom(classroomId);
  await gridsStore.fetchCourseGrids(classroomsStore.currentClassroom?.course._id!);
  await evaluationsStore.fetchClassroomEvaluations(classroomId);
  router.replace({ path: '/evaluations', query: { classroomId } });
});

onMounted(async () => {
  await classroomsStore.fetchCurrentSessionClassrooms();
  console.log(classroomsStore.classrooms);

  if (route.params.evaluationId) {
    selectedEvaluationId.value = route.params.evaluationId?.toString()!;
  }
});
const handleCreateEvaluationAction = async (): Promise<Boolean> => {
  const evaluation = await evaluationsStore.createEvaluation(selectedClassroomId.value);
  if (evaluationsStore.currentEvaluation)
    selectedEvaluationId.value = evaluationsStore.currentEvaluation._id!;
  return !!evaluation;
};

// const handleDeleteEvaluationAction = async (entity: EntityInterface): Promise<Boolean> => {
//   return !!(await evaluationsStore.deleteEvaluation(entity as EvaluationInterface));
// };
</script>

<template>
  <div class="container-fluid mt-3 row">
    <div class="col-xl-3 col-lg-4 col-12">
      <section-card title="Liste des cours" #content>
        <entities-card
          :entities="classroomsStore.classrooms"
          title="Cours actifs"
          v-model="selectedClassroomId"
        >
          <template #row="{ entity }: { entity: ClassroomInterface }">
            <div>{{ entity.group.code }} - {{ entity.course.title }}</div>
          </template>
          <template #actions> </template> </entities-card
      ></section-card>

      <section-card title="Liste des évaluations" #content v-if="evaluationsStore.evaluations">
        <entities-card
          :entities="evaluationsStore.getEvaluations"
          title="Évaluations"
          v-model="selectedEvaluationId"
          :createCallback="handleCreateEvaluationAction"
        >
          <template #row="{ entity }: { entity: EvaluationInterface }">
            <div v-if="entity.isNew">Nouvelle evaluation</div>
            <div v-else>{{ entity.code }} - {{ entity.grid?.title }}</div>
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

    <div class="col-xl-9 col-lg-8 col-12 pe-lg-0">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="sass"></style>
