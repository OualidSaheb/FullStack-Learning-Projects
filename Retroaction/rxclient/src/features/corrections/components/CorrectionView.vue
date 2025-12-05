<script setup lang="ts">
import { watch } from 'vue';
import SectionCard from '@/components/widgets/SectionCard.vue';
import CriterionEvaluationView from '@/features/corrections/components/CriterionCorrectionView.vue';
import DataCard from '@/components/widgets/DataCard.vue';
import { useEvaluationStore } from '@/shared/stores/evaluationsStore';
const EvaluationStore = useEvaluationStore();

const props = withDefaults(
    defineProps<{
        evaluationId: string;
        correctionId: string;
    }>(),
    {}
);

watch(
    () => props.correctionId,
    (correctionId) => {
        EvaluationStore.setCurrentCorrection(correctionId);
        EvaluationStore.setCurrentGrid();
        console.log('store correction : ', EvaluationStore.currentCorrection);
    },
    { immediate: true }
);
</script>

<template>
    <section-card :title="`Répartition des notes`">
        <template #content>
            <data-card v-for="section in EvaluationStore.currentGrid?.sections" :key="section._id" :title="section.title"
                v-if="EvaluationStore.currentGrid" class="bg-white">
                <template #content>
                    <div v-for="(criterion, index) in section.criteria" :key="criterion._id" class="card-body p-0 mt-2"
                        :class="{ 'bg-secondary': index % 2 === 0, 'bg-light': index % 2 !== 0 }">
                        <CriterionEvaluationView :criterion="criterion" :index="index" />
                    </div>
                </template>

            </data-card>
            <div class="container-fluid d-flex flex-column flex-lg-row justify-content-between">
                <div>Évalué le samedi 14 Novembre 2023, 21:45 par Marco</div>
                <div class="text-primary fw-bold">Note finale : 27/30</div>
            </div>
        </template>

    </section-card>
</template>

<style scoped lang="sass">

</style>