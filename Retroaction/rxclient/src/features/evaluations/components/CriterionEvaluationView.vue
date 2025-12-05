<script setup lang="ts">
import { toRefs, ref, onMounted, watch, computed } from 'vue';
import type {
  CorrectionInterface,
  CriterionInterface,
  ResultInterface,
  ResultFormInterface
} from '@/shared/interfaces';
import LevelEvaluationView from '@/features/evaluations/components/LevelEvaluationView.vue';
import AudioRecorder from '@/components/widgets/AudioRecorder.vue';

import { useEvaluationStore } from '@/shared/stores/evaluationsStore';
import type { Buffer } from 'buffer';

const evaluationsStore = useEvaluationStore();

const props = withDefaults(
  defineProps<{
    criterion: CriterionInterface;
    index: number;
  }>(),
  {}
);
const { criterion } = toRefs(props);

const result = computed(() => {
  return evaluationsStore.currentCorrection?.results.find(
    (result) => result.criterion === props.criterion._id
  )!;
});

const handleChangeCriterionAction = () => {
  evaluationsStore.setCurrentResult(props.criterion._id);
};

// let audio = ref<Blob | null>(null);
// function handleAudioAvailable(receivedAudioBlob: Blob): void {
//   audio.value = receivedAudioBlob;
//   result.value.audioData = audio.value;
// }
</script>

<template>
  <!-- TODO: Changer le number input pour le weight en un simple label non éditable -->
  <div
    class="d-flex flex-column flex-lg-row position-relative"
    @click="handleChangeCriterionAction"
    v-if="result"
  >
    <div
      class="form-floating container-fluid col-lg-3 col-12 d-flex flex-column border-1 border-dark border-end border-sm"
    >
      <div class="d-flex justify-content-end h-25">
        <div class="pt-6"></div>
      </div>
      <div>{{ criterion.title }}</div>

      <div class="input-group d-flex flex-row bg-gray text-dark align-items-center align-self-end">
        <input
          type="number"
          class="form-control custom-number-input border-0 p-0 text-center"
          id="value"
          placeholder=""
          v-model="criterion.weight"
        />
        <span class="me-1"> pts</span>
      </div>
    </div>
    <div class="verflow-auto d-flex flex-column flex-lg-row col-lg-9 col-12">
      <level-evaluation-view
        v-for="(level, index) of criterion.levels"
        :key="level._id"
        :level="level"
        :criterion="criterion"
      />
    </div>
  </div>
  <div class="form-floating border border-2 border-white border-start-0 border-end-0">
    <textarea
      class="form-control"
      id="note"
      placeholder=""
      :class="{ 'bg-secondary': props.index % 2 === 0, 'bg-light': props.index % 2 !== 0 }"
      v-model="result.note"
    ></textarea>
    <label for="note">Précision</label>
    <!-- <div>
      <AudioRecorder @audioAvailable="handleAudioAvailable" />
      <div>{{ result.audioData }}</div>
      <div>{{ result.audioUrl }}</div>
      <div>{{ result.note }}</div>
    </div> -->
  </div>
</template>

<style scoped lang="sass">
@media (max-width: 991.98px)
  .border-sm
    border-right: none !important
</style>
