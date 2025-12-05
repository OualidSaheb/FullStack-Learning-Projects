<script setup lang="ts">
import { watch, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EntitiyCard from '@/components/widgets/EntitiyCard.vue';
import { useDepartmentsStore } from '@/shared/stores';
const route = useRoute();
const router = useRouter();

const departmentsStore = useDepartmentsStore();
const selectedDepartmentId = ref<string>('');
let originalDepartmentData = ref({});

watch(
  () => route.params,
  (newParams) => {
    if (newParams.departmentId) {
      departmentsStore.setCurrentDepartment(newParams.departmentId as string);
      originalDepartmentData.value = { ...departmentsStore.currentDepartment }; // Store original data
    }
  },
  { immediate: true }
);

const handleCancelCurrentDepartmentAction = () => {
  if (departmentsStore.currentDepartment && originalDepartmentData.value) {
    Object.assign(departmentsStore.currentDepartment, originalDepartmentData.value); // Revert to original data
  }
};

const handleUpdateCurrentDepartmentAction = () => {
  return departmentsStore.updateCurrentDepartment();
};
</script>

<template>
  <div class="row">
    <div class="d-flex col-xl-4 col-md-12 flex-column gap-4">
      <entitiy-card
        v-if="departmentsStore.currentDepartment"
        title="Informations sur le département"
        :entity="departmentsStore.currentDepartment"
        :updateCallback="handleUpdateCurrentDepartmentAction"
        :cancelCallback="handleCancelCurrentDepartmentAction"
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
              v-model="departmentsStore.currentDepartment.code"
            />
            <label for="Code">Code</label>
          </div>

          <div class="form-floating mb-2 w-100">
            <input
              type="text"
              class="form-control"
              id="title"
              placeholder="Nom"
              v-model="departmentsStore.currentDepartment.title"
            />
            <label for="title">Nom du département</label>
          </div>
        </div>

        <div class="form-floating mb-2">
          <textarea
            class="form-control"
            placeholder="Note sur cette session"
            id="note"
            style="height: 100px"
            v-model="departmentsStore.currentDepartment.note"
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
