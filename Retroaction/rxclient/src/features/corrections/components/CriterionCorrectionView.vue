<script setup lang="ts">
import { toRefs } from 'vue';
import type { CorrectionInterface, CriterionInterface } from '@/shared/interfaces';
import LevelEvaluationView from '@/features/evaluations/components/LevelEvaluationView.vue';

const props = withDefaults(
    defineProps<{
        criterion: CriterionInterface;
        index: number;
    }>(),
    {}
);

const { criterion } = toRefs(props);
</script>

<template>
    <div class="d-flex flex-column flex-lg-row position-relative">
        <div class="container-fluid col-lg-6 d-flex flex-column border-1 border-dark border-end border-sm">
            <div class="fs-6 lh-sm my-2">{{ criterion.title }}</div>
        </div>
        <div class="container-fluid col-lg-6 d-flex justify-content-between my-2">
            <div class="fs-6 lh-sm">{{ criterion.title }}</div>
            <div>{{ criterion.weight }}pts</div>
        </div>

    </div>

    <!-- Précision -->
    <div class="form border border-2 border-white border-start-0 border-end-0 pt-1">

        <label for="description" class="form-label mx-2 fs-6">Précision:</label>
        <textarea class="form-control  border-1 border-dark" id="description" rows="1"
            placeholder="écrire un commentaire ...."
            :class="{ 'bg-secondary': props.index % 2 === 0, 'bg-light': props.index % 2 !== 0 }"></textarea>

    </div>
</template>

<style scoped lang="sass">
.confirmation-popover
  z-index: 10
  right: 0
  top: 0

@media (max-width: 991.98px) 
  .border-sm
    border-left: none !important
    border-right: none !important
    border-bottom: 1px solid var(--bs-dark) !important
</style>
