<script setup lang="ts">
import { ref } from 'vue';

//const props = withDefaults(defineProps<{}>(), {});

const confirmationRequested = ref(false);

const emit = defineEmits<{
  (e: 'deleteConfirmed'): void;
}>();

const handleConfirmationAction = () => {
  emit('deleteConfirmed');
  confirmationRequested.value = false;
};

const handleCancellationAction = () => {
  confirmationRequested.value = false;
};
</script>

<template>
  <div>
    <transition name="slide-fade">
      <div v-if="confirmationRequested"
        class="confirmation-popover d-flex justify-content-around position-absolute bg-light w-30 border border-1 border-dark p-1">
        <i class="bi bi-check-lg text-success btn" @click="handleConfirmationAction"></i>
        <i class="bi bi-x-lg text-danger btn" @click="handleCancellationAction"></i>
      </div>
    </transition>
    <div v-if="!confirmationRequested" class="position-relative d-inline-block" :style="{ '--delete-btn-color': 'red' }"
      @click="confirmationRequested = true">
      <i class="bi bi-x-lg delete-btn btn p-0 ps-1" style="font-size: 0.8rem;"></i>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.delete-btn
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out
  color: rgba(0, 0, 0, 0.3)

  &:hover
    transform: scale(1.1)
    color: var(--delete-btn-color)

.confirmation-popover
  z-index: 10
  right: 0
  top: 0
.confirmation-popover
  .btn
   &:hover
    transition: transform 0.2s ease-in-out
    color: var(--bs-dark) !important
    transform: scale(1.2)


.slide-fade-enter-active,
.slide-fade-leave-active
  transition: all 0.3s ease


.slide-fade-enter-from,
.slide-fade-leave-to
  transform: translateY(-10px)
  opacity: 0
</style>
