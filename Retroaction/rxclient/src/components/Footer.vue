<script lang="ts" setup>
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="container-fluid bg-dark">
    <div class="text-center text-light py-3">
      Copyright © {{ currentYear }} Rétroaction. Tous droits réservés.
    </div>
  </footer>
</template>

<style scoped></style>
