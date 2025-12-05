<script setup lang="ts">
import { watch, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EntitiyCard from '@/components/widgets/EntitiyCard.vue';
import { useCoursesStore, useDepartmentsStore } from '@/shared/stores';
const route = useRoute();
const router = useRouter();

const coursesStore = useCoursesStore();
const departmentsStore = useDepartmentsStore();
const selectedCourseId = ref<string>('');
let originalcoursesData = ref({});

watch(
  () => route.params,
  (newParams) => {
    if (newParams.courseId) {
      coursesStore.setCurrentCourse(newParams.courseId as string);
      originalcoursesData.value = { ...coursesStore.currentCourse }; // Store original data
    }
  },
  { immediate: true }
);

const departmentTitle = computed(() => {
  const departmentId = coursesStore.currentCourse?.department;
  if (departmentId) {
    const department = departmentsStore.getDepartmentById(departmentId);
    return department?.title || '';
  }
  return '';
});

const handleCancelCurrentCourseAction = () => {
  if (coursesStore.currentCourse && originalcoursesData.value) {
    Object.assign(coursesStore.currentCourse, originalcoursesData.value); // Revert to original data
  }
};

const handleUpdateCurrentCourseAction = () => {
  return coursesStore.updateCurrentCourse();
};

const isCourseCodeValid = computed(() => {
  const code = coursesStore.currentCourse?.code;
  return code && code.length === 3;
});
</script>

<template>
  <div class="row">
    <div class="d-flex col-xl-4 col-md-12 flex-column gap-4">
      <entitiy-card
        v-if="coursesStore.currentCourse"
        title="Information sure le cours"
        :entity="coursesStore.currentCourse"
        :updateCallback="handleUpdateCurrentCourseAction"
        :cancelCallback="handleCancelCurrentCourseAction"
        #content
      >
        <div
          class="d-flex flex-column flex-lg-row align-items-center gap-1 justify-content-between"
        >
          <div class="form-floating mb-2 w-25">
            <input
              type="text"
              class="form-control"
              id="Code"
              placeholder="Nom"
              v-model="coursesStore.currentCourse.code"
              :class="{ 'is-invalid': !isCourseCodeValid }"
            />
            <label for="Code">Code</label>
            <div v-if="!isCourseCodeValid" class="invalid-feedback">3 characters</div>
          </div>

          <div class="form-floating mb-2 w-100">
            <input
              type="text"
              class="form-control"
              id="title"
              placeholder="Nom"
              v-model="coursesStore.currentCourse.title"
            />
            <label for="title">Nom de cours</label>
          </div>
        </div>

        <div class="form-floating mb-2">
          <input
            type="text"
            class="form-control"
            id="title"
            placeholder="Nom du département"
            v-model="departmentTitle"
          />
          <label for="title">Nom de department</label>
        </div>

        <div class="form-floating mb-2">
          <textarea
            class="form-control"
            placeholder="Note sur cette session"
            id="note"
            style="height: 100px"
            v-model="coursesStore.currentCourse.note"
          ></textarea>
          <label for="note">Note</label>
        </div>
      </entitiy-card>
    </div>
    <!-- <div class="col-xl-8 col-md-12">
            <router-view />
        </div> -->
  </div>
</template>
