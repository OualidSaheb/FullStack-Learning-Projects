<script setup lang="ts">
import SectionCard from '@/components/widgets/SectionCard.vue';
import EntitiesCard from '@/components/widgets/EntitiesCard.vue';
import type { EvaluationInterface, CourseInterface, ClassroomInterface } from '@/shared/interfaces';
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useCoursesStore, useClassroomsStore, useEvaluationStore } from '@/shared/stores';

const coursesStore = useCoursesStore();
const classroomsStore = useClassroomsStore();

const route = useRoute();
const router = useRouter();
const EvaluationStore = useEvaluationStore();

const selectedCourseId = ref<string>('');

const selectedEvaluationId = ref<string>('');

watch(selectedEvaluationId, async (evaluationId) => {
  await EvaluationStore.fetchPopulatedEvaluation(evaluationId);
  if (selectedEvaluationId.value) {
    router.push({
      name: 'EvaluationCorrectionView',
      params: { evaluationId: evaluationId }
    });
  }
});

watch(selectedCourseId, async (courseId, oldValue) => {
  await EvaluationStore.fetchCourseEvaluations(courseId);
  router.replace({ path: '/corrections', query: { courseId } });
});

onMounted(async () => {
  await classroomsStore.fetchCurrentSessionClassrooms();
  console.log(classroomsStore.classrooms);

  if (route.params.evaluationId) {
    selectedEvaluationId.value = route.params.evaluationId?.toString()!;
  }
});
</script>

<template>
  <div class="container-fluid mt-3 row">
    <div class="col-xl-3 col-lg-4 col-12">
      <section-card title="Liste des cours" #content>
        <entities-card :entities="classroomsStore.classrooms" title="Cours actifs" v-model="selectedCourseId">
          <template #row="{ entity }: { entity: ClassroomInterface }">
            <div>{{ entity.group.code }} - {{ entity.course.title }}</div>
          </template>
          <template #actions> </template> </entities-card></section-card>

      <section-card title="Liste des évaluations" #content v-if="EvaluationStore.evaluations">
        <entities-card :entities="EvaluationStore.getEvaluations" title="Évaluations" v-model="selectedEvaluationId">
          <template #row="{ entity }: { entity: EvaluationInterface }">
            <div>{{ entity.code }} {{ entity.title }}</div>
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
