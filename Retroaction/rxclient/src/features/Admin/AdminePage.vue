<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type {
  DepartmentInterface,
  EntityInterface,
  CourseInterface,
  SectionInterface
} from '@/shared/interfaces';
import EntitiesCard from '@/components/widgets/EntitiesCard.vue';
import SectionCard from '@/components/widgets/SectionCard.vue';
import { useRoute, useRouter } from 'vue-router';
import { useDepartmentsStore, useCoursesStore, useSessionsStore } from '@/shared/stores';

const departmentsStore = useDepartmentsStore();
const sessionsStore = useSessionsStore();
const coursesStore = useCoursesStore();

const selectedDepartmentId = ref<string>('');
const selectedSessionId = ref<string>('');
const selectedCourseId = ref<string>('');

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await departmentsStore.fetchDepartments();
  await sessionsStore.fetchSessions();
  // If there's a departmentId in the route params, fetch courses for that department
  if (route.params.departmentId) {
    selectedDepartmentId.value = route.params.departmentId as string;
    await coursesStore.fetchCoursesForDepartment(route.params.departmentId as string);
  }
});

watch(selectedDepartmentId, async (departmentId) => {
  if (departmentId) {
    await coursesStore.fetchCoursesForDepartment(departmentId);
    // Optional: Navigate to a specific department admin view
    router.push({ name: 'DepartmentAdminView', params: { departmentId } });
  }
});

watch(selectedSessionId, async (sessionId) => {
  if (sessionId) {
    router.push({ name: 'SessionAdminView', params: { sessionId } });
  }
});

watch(selectedCourseId, async (courseId) => {
  if (courseId) {
    router.push({ name: 'CourseAdminView', params: { courseId } });
  }
});

const handleDeleteDepartmentAction = (entity: EntityInterface): Promise<Boolean> => {
  return departmentsStore.deleteDepartment(entity._id);
};

const handleCreateDepartmentAction = async (): Promise<boolean> => {
  const department = await departmentsStore.createDepartment();
  if (department) selectedDepartmentId.value = department._id;
  return !!department;
};

const handleCreateSessionAction = async (): Promise<boolean> => {
  const newSession = await sessionsStore.createSession();
  if (newSession) {
    selectedSessionId.value = newSession._id;
    return true;
  }
  return false;
};

const handleDeleteSessionAction = async (entity: EntityInterface): Promise<boolean> => {
  try {
    await sessionsStore.deleteSession(entity._id);
    if (selectedSessionId.value === entity._id) {
      selectedSessionId.value = ''; // Clear the selection if the current session was deleted
    }
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
};

const handleCreateCourseAction = async (): Promise<Boolean> => {
  const evaluation = await coursesStore.createCourse(selectedDepartmentId.value);
  if (coursesStore.currentCourse) selectedCourseId.value = coursesStore.currentCourse._id!;
  return !!evaluation;
};

const handleDeleteCourseAction = async (entity: EntityInterface): Promise<boolean> => {
  try {
    await coursesStore.deleteCourse(entity._id);
    // Optionally, clear the selected course if it was deleted
    if (selectedCourseId.value === entity._id) {
      selectedCourseId.value = '';
    }
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    return false;
  }
};
</script>

<template>
  <div class="container-fluid mt-3 row">
    <div class="col-xl-3 col-lg-4 col-12">
      <section-card title=" Liste des sessions" #content>
        <entities-card
          :entities="sessionsStore.sessions"
          title="Sessions"
          v-model="selectedSessionId"
          :createCallback="handleCreateSessionAction"
          :deleteCallback="handleDeleteSessionAction"
          class="overflow-auto custom-entities-card"
        >
          <template #row="{ entity }: { entity: SectionInterface }">
            <div>
              <!-- Check if the entity is not new before displaying the code -->
              <template v-if="!entity.isNew"> {{ entity.code }} - </template>
              {{ entity.displayTitle || entity.title }}
            </div>
          </template>

          <template #actions> </template>
        </entities-card>
      </section-card>

      <section-card title="Liste des départements" #content>
        <entities-card
          :entities="departmentsStore.departments"
          title="Départements"
          v-model="selectedDepartmentId"
          :createCallback="handleCreateDepartmentAction"
          :deleteCallback="handleDeleteDepartmentAction"
          class="overflow-auto custom-entities-card"
        >
          <template #row="{ entity }: { entity: DepartmentInterface }">
            <div>
              <!-- Check if the entity is not new before displaying the code -->
              <template v-if="!entity.isNew"> {{ entity.code }} - </template>
              {{ entity.displayTitle || entity.title }}
            </div>
          </template>
          <template #actions> </template>
        </entities-card>
      </section-card>

      <section-card title=" Liste des cours" #content>
        <div v-if="!selectedDepartmentId" class="alert alert-info">
          Veuillez sélectionner un département pour afficher ou créer des cours.
        </div>
        <entities-card
          v-else
          :entities="coursesStore.courses"
          title="Cours"
          v-model="selectedCourseId"
          :createCallback="selectedDepartmentId ? handleCreateCourseAction : null"
          :deleteCallback="handleDeleteCourseAction"
          class="overflow-auto custom-entities-card"
        >
          <template #row="{ entity }: { entity: CourseInterface }">
            <div>
              <!-- Check if the entity is not new before displaying the code -->
              <template v-if="!entity.isNew"> {{ entity.code }} - </template>
              {{ entity.displayTitle || entity.title }}
            </div>
          </template>
          <template #actions> </template>
        </entities-card>
      </section-card>
    </div>
    <div class="col-xl-9 col-lg-8 col-12 pe-lg-0">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="sass">
.custom-entities-card
  max-height: 200px
.btn-custom
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out

  &:hover
      color: var(--bs-primary)
</style>
