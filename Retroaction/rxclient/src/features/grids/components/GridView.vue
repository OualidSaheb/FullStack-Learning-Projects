<script setup lang="ts">
import { watch, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import grids from '@/data/grids.json';
import type { EntityInterface, SectionInterface } from '@/shared/interfaces';
import EntitiyCard from '@/components/widgets/EntitiyCard.vue';
import SectionCard from '@/components/widgets/SectionCard.vue';
import EntitiesCard from '@/components/widgets/EntitiesCard.vue';
import TitledValue from '@/components/widgets/TitledValue.vue';
import { useGridsStore } from '@/shared/stores/gridsStore';

const gridsStore = useGridsStore();

const route = useRoute();
const router = useRouter();

const selectedSectionId = ref<string>('');
const selectedCourseId = ref<string>('');

const props = withDefaults(
  defineProps<{
    gridId: string;
  }>(),
  {}
);

watch(selectedSectionId, (sectionId, oldValue) => {
  //TODO: Change le currentSection dans Pinia
  gridsStore.setCurrentSection(sectionId);
  router.push({
    name: 'section',
    params: { sectionId, gridId: props.gridId },
    query: { courseId: selectedCourseId.value }
  });
});

onMounted(async () => {
  //selectedCourseId.value = route.query.courseId?.toString() || '';
});

watch(
  () => props.gridId,
  async () => {
    if (route.params.sectionId) selectedSectionId.value = route.params.sectionId.toString()!;
    //await gridsStore.fetchPopulatedGrid(gridId);
  },

  { immediate: true }
);

const handleUpdateCurrentGridAction = () => {
  return gridsStore.updateCurrentGrid();
};

const handleCreateSectionAction = async (): Promise<Boolean> => {
  const section = await gridsStore.createSection();
  if (section?._id) selectedSectionId.value = section._id;
  return !!section;
};

const handleDeleteSectionAction = (entity: EntityInterface): Promise<Boolean> => {
  return gridsStore.deleteSection(entity._id);
};
</script>

<template>
  <div class="row">
    <div class="d-flex col-xl-4 col-md-12 flex-column gap-4">
      <!-- TODO: Find out how to get title formated as Grille 1091 -->
      <entitiy-card
        v-if="gridsStore.currentGrid"
        :title="gridsStore.currentGrid.code"
        :entity="gridsStore.currentGrid"
        :updateCallback="handleUpdateCurrentGridAction"
      >
      <template #content>
        <div class="form-floating mb-2">
          <input
            type="text"
            class="form-control"
            id="title"
            placeholder="Nom de la grille"
            v-model="gridsStore.currentGrid.title"
          />
          <label for="title">Nom de la grille</label>
        </div>
        <div class="form-floating">
          <textarea
            class="form-control"
            placeholder="Note sur cette grille"
            id="note"
            style="height: 100px"
            v-model="gridsStore.currentGrid.note"
          ></textarea>
          <label for="note">Note</label>
        </div>
      </template>
      </entitiy-card>
      <section-card title="Liste des sections">
        <template #content>
        <entities-card
          :entities="gridsStore.currentGrid?.sections || []"
          title="Sections"
          :grade="gridsStore.getTotalForAllSections"
          v-model="selectedSectionId"
          :createCallback="handleCreateSectionAction"
          :deleteCallback="handleDeleteSectionAction"
        >
          <template #row="{ entity }: { entity: SectionInterface }">
            <div class="d-flex justify-content-between w-100">
              <div>{{ entity.title }}</div>
              <div>{{ gridsStore.getTotalSectionValue(entity) }}</div>
            </div>
          </template>
        </entities-card>
      </template>
        </section-card
      >
    </div>
    <div class="col-xl-8 col-md-12">
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="sass"></style>
