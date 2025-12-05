<script setup lang="ts">
import type { LevelInterface, LevelFormInterface } from '@/shared/interfaces';
import { ref } from 'vue';
import DeleteButton from '@/components/widgets/DeleteButton.vue';

const props = withDefaults(
  defineProps<{
    level: LevelInterface;
  }>(),
  {}
);
const level = ref<LevelInterface>(props.level);

let hoverStates = ref<boolean>(false);

const showDeleteButton = () => {
  hoverStates.value = true;
};

const hideDeleteButton = () => {
  hoverStates.value = false;
};
</script>

<template>
  <div
    class="container-fluid position-relative rx-box d-flex flex-column border border-1 border-dark border-top-0 border-bottom-0 level pe-1 ps-1 border-sm"
    @mouseover="showDeleteButton()"
    @mouseleave="hideDeleteButton()"
  >
    <div class="d-flex position-absolute w-100 confirmation-popover">
      <delete-button v-if="hoverStates" />
    </div>

    <div class="form-floating mt-2">
      <textarea
        class="form-control bg-white fs-6 lh-1 p-1 w-100 h-100"
        id="name"
        placeholder=""
        row
        v-model="level.title"
      ></textarea>
    </div>

    <!-- TODO: Faire un composant number-input avec le code ci-bas-->
    <div
      class="input-group d-flex flex-row bg-gray text-dark border-0 align-items-center align-self-end"
    >
      <input
        type="number"
        class="form-control custom-number-input border-0 p-0 text-center"
        id="value"
        v-model="level.value"
      />
      <span class="me-1"> pts</span>
    </div>
  </div>
</template>

<style scoped lang="sass">
.level
  height: 150px
.confirmation-popover
  z-index: 99999
  right: 0
  top: 0

.form-floating
 height: 100%



@media (max-width: 991.98px)
  .border-sm
    border-left: none !important
    border-right: none !important
    border-top: 1px solid var(--bs-dark) !important
</style>
