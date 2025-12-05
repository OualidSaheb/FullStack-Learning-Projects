<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import grids from '@/data/grids.json';
import type { CriterionInterface, CriterionFormInterface } from '@/shared/interfaces';
import LevelView from '@/features/grids/components/LevelView.vue';
import DeleteButton from '@/components/widgets/DeleteButton.vue';
import { useGridsStore } from '@/shared/stores/gridsStore';

const gridsStore = useGridsStore();
const router = useRouter();
const route = useRoute();

const props = withDefaults(
  defineProps<{
    criterion: CriterionInterface | CriterionFormInterface;
    index: number;
  }>(),
  {}
);
const criterion = ref<CriterionInterface | CriterionFormInterface>(props.criterion);
const isLastLevel = (index: number) => index === (criterion.value.levels?.length ?? 0) - 1;

let hoverStates = ref<boolean>(false);

const showDeleteButton = () => {
  hoverStates.value = true;
};

const hideDeleteButton = () => {
  hoverStates.value = false;
};
const hover = ref(false);
</script>

<template>
  <!-- TODO: Changer le number input pour le weight en un simple label non éditable -->
  <div class="d-flex flex-column flex-lg-row position-relative">
    <div
      class="form-floating container-fluid col-lg-3 col-12 d-flex flex-column border-1 border-dark border-end border-sm"
      @mouseover="showDeleteButton()"
      @mouseleave="hideDeleteButton()"
    >
      <div class="d-flex justify-content-end h-25">
        <div class="pt-6"></div>
        <delete-button class="btn-delete" v-if="hoverStates"></delete-button>
      </div>
      <textarea
        class="form-control w-100 h-100 border-0 fs-6 lh-sm p-1"
        id="title"
        placeholder=""
        v-model="criterion.title"
        :class="{ 'bg-secondary': props.index % 2 === 0, 'bg-light': props.index % 2 !== 0 }"
      ></textarea>
      <label for="title">Nom du critère</label>

      <div class="input-group d-flex flex-row bg-gray text-dark align-items-center align-self-end">
        <span class="form-control custom-number-input border-0 p-0 text-center">
          {{ gridsStore.getMaxLevelValue(criterion) }}
        </span>
        <span class="me-1"> pts</span>
      </div>
    </div>
    <div class="overflow-auto d-flex flex-column flex-lg-row col-lg-9 col-12">
      <level-view
        v-for="(level, index) of criterion.levels"
        :key="level._id"
        :level="level"
        :style="{ marginRight: isLastLevel(index) ? '50px' : '0' }"
        class="level-view"
      />
    </div>

    <button
      class="btn confirmation-popover position-absolute rounded-0"
      :style="{
        backgroundColor: hover ? 'var(--bs-dark)' : 'rgba(19, 36, 95, 0.5)',
        borderColor: 'transparent'
      }"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      @click="gridsStore.createLevel()"
    >
      <i class="bi bi-plus text-light"></i>
    </button>
  </div>
  <div class="form-floating border border-2 border-white border-start-0 border-end-0">
    <textarea
      class="form-control"
      id="note"
      placeholder=""
      :class="{ 'bg-secondary': props.index % 2 === 0, 'bg-light': props.index % 2 !== 0 }"
    ></textarea>

    <label for="note">Note privée sur ce critère</label>
  </div>
</template>

<style scoped lang="sass">
.confirmation-popover
  height: 100%
  z-index: 10
  right: 0
  top: 0

@media (max-width: 991.98px)
  .level-view:last-child
    margin-right: 0px !important
    margin-bottom: 35px
  .confirmation-popover
    width: 100%
    height: 5%
    z-index: 10
    right: 0
    top: 95%
  .border-sm
    border-right: none !important
</style>
