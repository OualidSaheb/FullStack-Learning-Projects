<script setup lang="ts">
import { ref, watch, onMounted, compile, computed } from 'vue';
import type { GridInterface, CourseInterface, EntityInterface } from '@/shared/interfaces';
import EntitiesCard from '@/components/widgets/EntitiesCard.vue';
import SectionCard from '@/components/widgets/SectionCard.vue';
import { useRoute, useRouter } from 'vue-router';
import { useGridsStore, useCoursesStore } from '@/shared/stores';

const gridsStore = useGridsStore();
const coursesStore = useCoursesStore();
const route = useRoute();
const router = useRouter();

const selectedCourseId = ref<string>('');
const selectedGridId = ref<string>('');

watch(selectedGridId, async (gridId, oldValue) => {
  await gridsStore.fetchPopulatedGrid(gridId);
  if (route.params.sectionId) gridsStore.setCurrentSection(route.params.sectionId.toString());
  router.push({ name: 'grid', params: { gridId }, query: { courseId: selectedCourseId.value } });
});

watch(selectedCourseId, async (courseId, oldValue) => {
  await gridsStore.fetchCourseGrids(courseId);
  router.replace({ path: '/grids', query: { courseId } });
});

onMounted(async () => {
  //;
  await coursesStore.fetchCurrentDepartmentCourses();
  if (route.query.courseId) selectedCourseId.value = route.query.courseId?.toString();
  if (route.params.gridId) selectedGridId.value = route.params.gridId?.toString();
});

// TODO Find out how to DRY thoses 2 next functions.  Unable to set parameter to callback function parameter
const handleCreateGridAction = async (): Promise<Boolean> => {
  const grid = await gridsStore.createGrid(selectedCourseId.value);
  if (gridsStore.currentGrid?._id) {
    selectedGridId.value = gridsStore.currentGrid._id;
    router.push({ query: { isNew: '1' } });
  }
  return !!grid;
};

const handleCreateUserGridAction = async (): Promise<Boolean> => {
  const grid = await gridsStore.createGrid(selectedCourseId.value, true);
  if (gridsStore.currentGrid?._id) selectedGridId.value = gridsStore.currentGrid._id;
  return !!grid;
};

const handleDeleteGridAction = async (entity: EntityInterface): Promise<Boolean> => {
  return !!(await gridsStore.deleteGrid(entity as GridInterface));
};

const handleDuplicateGridAction = async (entity: EntityInterface): Promise<Boolean> => {
  return true; //!!(await gridsStore.duplicateGrid(entity as GridInterface));
};
</script>

<template>
  <div class="container-fluid mt-3 row">
    <div class="col-xl-3 col-lg-4 col-12">
      <section-card title="Liste des cours">
        <template #content>
          <entities-card
            :entities="coursesStore.courses"
            title="Cours actifs"
            v-model="selectedCourseId"
          >
            <template #row="{ entity }: { entity: CourseInterface }">
              <div>{{ entity.title }}</div>
            </template>
            <template #actions> </template> </entities-card></template
      ></section-card>
      <section-card title="Liste des grilles">
        <template #content>
        <entities-card
          :entities="gridsStore.getGrids"
          title="Grilles de département"
          v-model="selectedGridId"
          :createCallback="handleCreateGridAction"
          :deleteCallback="handleDeleteGridAction"
        >
          <template #row="{ entity }: { entity: GridInterface }">
            <div>{{ entity.code }} - {{ entity.title }}</div>
          </template>
          <template #actions>
            <!--             <button class="btn btn-link text-decoration-none text-dark">
              <i class="bi bi-arrow-down-square btn-custom"></i>
            </button> -->
          </template>
        </entities-card>
        <entities-card
          :entities="gridsStore.getUserGrids"
          title="Grilles personnelles"
          v-model="selectedGridId"
          :createCallback="handleCreateUserGridAction"
          :deleteCallback="handleDeleteGridAction"
        >
          <template #row="{ entity }: { entity: GridInterface }">
            <div>{{ entity.title }}</div>
          </template>
        </entities-card>
        </template
      >
      </section-card>
    </div>
    <div class="col-xl-9 col-lg-8 col-12 pe-lg-0">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="sass">
.btn-custom
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out

  &:hover
      color: var(--bs-primary)
</style>
