<script setup lang="ts">
import { useProducts } from "@/shared/stores/productsStore";
const productsStore = useProducts();
import { computed, ref } from "vue";

const nameSearch = ref("");
const nameItems = computed(() => productsStore.getProductsSearch);

function search() {
  productsStore.searchName = nameSearch.value;

  productsStore.filterRating = "";
  productsStore.filterCategory = "";
  productsStore.filterPrice = "";
  productsStore.filterBrand = "";

  productsStore.sortRating = false;
  productsStore.sortPrice = false;
}

const flag = ref(false);
function ToggleSearchDisplayTip() {
  flag.value = !flag.value;
}
</script>

<template>
  <div id="search">
    <input
      v-model="nameSearch"
      @blur="ToggleSearchDisplayTip"
      @focus="ToggleSearchDisplayTip"
      type="text"
      id="myInput"
      v-on:keyup="search"
      placeholder="Search here ..."
      title="Type in any information of product"
    />
    <div id="mydiv">
      <ul id="myUL">
        <li v-show="nameSearch && flag" v-for="(item, index) in nameItems">{{ item.name }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
#search {
  text-align: center;
  max-width: 700px;
  margin: auto;
}
#search > div:nth-child(1) {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
#myInput {
  width: 100%;
  font-size: 16px;
  padding: 12px 10px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  border-radius: 4px;
}

#mydiv {
  z-index: 2;
  position: absolute;
  max-height: 400px;
  overflow: auto;
  width: 700px;
  border-bottom: 1px solid #cecccc;
}
#myUL {
  list-style-type: none;
  padding: 0;
  margin: 0;
  background-color: white;
  text-align: left;
}

#myUL li {
  padding-left: 10px;
}
</style>
