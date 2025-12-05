<template>
  <div class="container-fluid bg-dark">
    <nav class="navbar navbar-expand-lg navbar-dark justify-content-between border-bottom">
      <div class="d-flex flex-column flex-lg-row align-items-center gap-2">
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <img src="@/assets/logo.png" alt="logo" width="200" height="55" />
        </router-link>

        <div class="d-flex flex-column flex-lg-row align-items-center gap-2">
          <!-- Session Selector -->

          <select v-model="selectedSession" class="form-select bg-light">
            <option value="" disabled>{{ selectedSessionTitle }}</option>
            <option
              v-for="session in sessionsStore.sessions"
              :key="session._id"
              :value="session._id"
            >
              {{ session.title }}
            </option>
          </select>

          <!-- Department Selector -->
          <select v-model="selectedDepartment" class="form-select bg-light">
            <option value="" disabled>{{ selectedDepartmentTitle }}</option>
            <option
              v-for="department in departmentsStore.departments"
              :key="department._id"
              :value="department._id"
            >
              {{ department.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="d-flex gap-2">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item text-uppercase">
              <router-link to="/grids" class="nav-link" active-class="active">Grilles</router-link>
            </li>
            <li class="nav-item text-uppercase">
              <router-link to="/evaluations" class="nav-link" active-class="active"
                >Évaluations</router-link
              >
            </li>
            <li class="nav-item text-uppercase">
              <router-link to="/corrections" class="nav-link" active-class="active"
                >Corrections</router-link
              >
            </li>
            <li class="nav-item text-uppercase">
              <router-link to="/signin" class="nav-link" active-class="active"
                >Connexion</router-link
              >
            </li>
            <li class="nav-item text-uppercase">
              <router-link to="/admin" class="nav-link" active-class="active">Admin</router-link>
            </li>
          </ul>
        </div>
        <SideMenu />
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDepartmentsStore, useSessionsStore } from '@/shared/stores';
import SideMenu from '@/components/SideMenu.vue';

const departmentsStore = useDepartmentsStore();
const sessionsStore = useSessionsStore();

const selectedDepartment = ref('');
const selectedSession = ref('');

const departments = ref(departmentsStore.departments);
const sessions = ref(sessionsStore.sessions);

const router = useRouter();

const selectedDepartmentTitle = computed(() => {
  const department = departments.value.find((d) => d._id === selectedDepartment.value);
  return department ? department.title : 'Department';
});

const selectedSessionTitle = computed(() => {
  const session = sessions.value.find((s) => s._id === selectedSession.value);
  return session ? session.title : 'Session';
});
onMounted(async () => {
  await departmentsStore.fetchDepartments();
  await sessionsStore.fetchSessions();
  sessions.value = sessionsStore.sessions;

  const query = router.currentRoute.value.query;
  if (query.department) {
    selectedDepartment.value = query.department;
  }
  if (query.session) {
    selectedSession.value = query.session;
  }
});

watch([selectedDepartment, selectedSession], ([newDept, newSess]) => {
  const query: Record<string, string> = {};
  if (newDept) {
    query.department = newDept;
    departmentsStore.setCurrentDepartment(newDept);
  }
  if (newSess) {
    query.session = newSess;
    sessionsStore.setCurrentSession(newSess);
  }
  router.push({ query });
});
</script>

<style lang="sass" scoped>
.form-select
  width: 150px !important
</style>
