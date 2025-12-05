<script setup lang="ts">
import { watch, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { EntityInterface } from '@/shared/interfaces';
import EntitiyCard from '@/components/widgets/EntitiyCard.vue';
import { useSessionsStore } from '@/shared/stores';
import type { SessionInterface } from '@/shared/interfaces';
const sessionsStore = useSessionsStore();
const route = useRoute();
const router = useRouter();

const selectedSessionId = ref<string>('');

let originalSessionData = ref({});

watch(
  () => route.params,
  (newParams) => {
    if (newParams.sessionId) {
      sessionsStore.setCurrentSession(newParams.sessionId as string);
      originalSessionData.value = { ...sessionsStore.currentSession }; // Store original data
    }
  },
  { immediate: true }
);

const handleCancelCurrentSessionAction = () => {
  if (sessionsStore.currentSession && originalSessionData.value) {
    Object.assign(sessionsStore.currentSession, originalSessionData.value); // Revert to original data
  }
};

const handleUpdateCurrentSessionAction = () => {
  return sessionsStore.updateCurrentSession();
};

const createComputedDate = (dateField: keyof SessionInterface) =>
  computed({
    get: () => {
      // Getter converts the date to 'YYYY-MM-DD' format for the input

      const dateValue = sessionsStore.currentSession?.[dateField] as string;
      return dateValue ? dateValue.split('T')[0] : '';
    },
    // Setter updates the date in the store

    set: (newValue) => {
      if (sessionsStore.currentSession) {
        sessionsStore.currentSession[dateField] = new Date(newValue).toISOString();
      }
    }
  });

const formattedStartDate = createComputedDate('createdAt');
const formattedEndDate = createComputedDate('endsOn');
</script>

<template>
  <div class="row">
    <div class="d-flex col-xl-4 col-md-12 flex-column gap-4">
      <entitiy-card
        v-if="sessionsStore.currentSession"
        title="Informations sur la session"
        :entity="sessionsStore.currentSession"
        :updateCallback="handleUpdateCurrentSessionAction"
        :cancelCallback="handleCancelCurrentSessionAction"
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
              v-model="sessionsStore.currentSession.code"
            />
            <label for="Code">Code</label>
          </div>

          <div class="form-floating mb-2 w-100">
            <input
              type="text"
              class="form-control"
              id="title"
              placeholder="Nom"
              v-model="sessionsStore.currentSession.title"
            />
            <label for="title">Nom de la session</label>
          </div>
        </div>

        <div class="form-floating mb-2">
          <input
            type="date"
            class="form-control"
            id="date"
            placeholder="date"
            v-model="formattedEndDate"
          />
          <label for="date">Fin de la session</label>
        </div>

        <div class="form-floating mb-2">
          <textarea
            class="form-control"
            placeholder="Note sur cette session"
            id="note"
            style="height: 100px"
            v-model="sessionsStore.currentSession.note"
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
