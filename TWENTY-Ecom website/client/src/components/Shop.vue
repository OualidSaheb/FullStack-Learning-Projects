<script setup lang="ts">
import Products from "./Products/Products.vue";
import Filter from "./Products/Filter.vue";
import { useFilter } from "@/shared/stores/filterStore";
import Sale from "./Products/Sale.vue";
import { useProducts } from "@/shared/stores/productsStore";

const filterStore = useFilter();
const productsStore = useProducts();

</script>

<template>
  <div id="container">
    <Products class="product"></Products>
    <Filter v-if="filterStore.show"></Filter>
    <Sale v-if="productsStore.show"></Sale>
  </div>
</template>

<style scoped>
#container {
  padding-bottom: 15px;
}
</style>
