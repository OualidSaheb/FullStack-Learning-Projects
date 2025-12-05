<script setup lang="ts">
import { useFilter } from "@/shared/stores/filterStore";
import { useProducts } from "@/shared/stores/productsStore";
import { FilterInterface } from "@/shared/interfaces/product.interface";

const filterStore = useFilter();

const productsStore = useProducts();
const categoryItems = filterStore.categoryData;
const priceItems = filterStore.priceData;
const brandItems = filterStore.brandData;
const ratingItems = filterStore.ratingData;

function updateCategoryValue(item:FilterInterface) {
  productsStore.filterCategory = item.name;

  productsStore.filterPrice = "";
  productsStore.filterBrand = "";
  productsStore.filterRating = "";

  productsStore.sortRating = false;
  productsStore.sortPrice = false;

  productsStore.searchName = "";
}
function updatePriceValue(item:FilterInterface) {
  productsStore.filterPrice = item.name;

  productsStore.filterCategory = "";

  productsStore.filterBrand = "";
  productsStore.filterRating = "";

  productsStore.sortRating = false;
  productsStore.sortPrice = false;

  productsStore.searchName = "";
}
function updateBrandValue(item:FilterInterface) {
  productsStore.filterBrand = item.name;

  productsStore.filterCategory = "";
  productsStore.filterPrice = "";
  productsStore.filterRating = "";

  productsStore.sortRating = false;
  productsStore.sortPrice = false;

  productsStore.searchName = "";
}
function updateRatingValue(item:FilterInterface) {
  productsStore.filterRating = item.name;

  productsStore.filterCategory = "";
  productsStore.filterPrice = "";
  productsStore.filterBrand = "";

  productsStore.sortRating = false;
  productsStore.sortPrice = false;

  productsStore.searchName = "";
}
</script>

<template>
  <div id="filter">
    <div id="title">
      <label>FILTER</label>
      <i class="fa fa-remove" aria-hidden="true" v-on:click="filterStore.toggleFilterVisibility"></i>
    </div>
    <div>
      <div class="criteria" @click="filterStore.openCategoryValue">
        <label>CATEGORY</label>
        <div>
          <div v-if="filterStore.categoryShow"><i class="fa fa-chevron-up" aria-hidden="true"></i></div>
          <div v-else><i class="fa fa-chevron-down" aria-hidden="true"></i></div>
        </div>
      </div>
      <div class="list" v-show="filterStore.categoryShow">
        <ul id="test">
          <li @click="updateCategoryValue(item)" v-for="(item, index) in categoryItems" class="list-items">
            {{ item["name"] }}
          </li>
        </ul>
      </div>
    </div>

    <div>
      <div class="criteria" @click="filterStore.openPriceValue">
        <label>PRICE</label>
        <div>
          <div v-if="filterStore.priceShow"><i class="fa fa-chevron-up" aria-hidden="true"></i></div>
          <div v-else><i class="fa fa-chevron-down" aria-hidden="true"></i></div>
        </div>
      </div>
      <div class="list" v-show="filterStore.priceShow">
        <ul>
          <li @click="updatePriceValue(item)" v-for="(item, index) in priceItems" class="list-items">
            {{ item["name"] }}
          </li>
        </ul>
      </div>
    </div>
    <div>
      <div class="criteria" @click="filterStore.openBrandValue">
        <label>BRAND</label>
        <div>
          <div v-if="filterStore.brandShow"><i class="fa fa-chevron-up" aria-hidden="true"></i></div>
          <div v-else><i class="fa fa-chevron-down" aria-hidden="true"></i></div>
        </div>
      </div>
      <div class="list" v-show="filterStore.brandShow">
        <ul>
          <li @click="updateBrandValue(item)" v-for="(item, index) in brandItems" class="list-items">
            {{ item["name"] }}
          </li>
        </ul>
      </div>
    </div>
    <div>
      <div class="criteria" @click="filterStore.openRatingValue">
        <label>RATING</label>
        <div>
          <div v-if="filterStore.ratingShow"><i class="fa fa-chevron-up" aria-hidden="true"></i></div>
          <div v-else><i class="fa fa-chevron-down" aria-hidden="true"></i></div>
        </div>
      </div>
      <div class="list" v-show="filterStore.ratingShow">
        <ul>
          <li @click="updateRatingValue(item)" v-for="(item, index) in ratingItems" :key="index" class="list-items">
            {{ item["name"] }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
#filter {
  width: 600px;
  background-color: white;
  display: block;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 3;
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-weight: bold;
}
#title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  margin: 20px 0px;
}

#title > i {
  cursor: pointer;
  font-size: 1.5rem;
}

.criteria {
  border-top: 1px solid #cecccc;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  color: #612940;
  padding: 20px 0px;
}

.list {
  width: 100%;
  height: 80px;
  background-color: white;
}

ul li {
  list-style: none;
}
.list ul li {
  width: 100%;
  height: 20px;
  cursor: pointer;
  line-height: 20px;
  padding-left: 10px;
}
.list ul li:hover {
  background-color: #cccccc;
}

#filter > div:nth-child(1) {
  font-weight: bold;
  font-size: 1.5rem;
}

button {
  border-radius: 10px;
  height: 40px;
  background-color: #612940;
  border: none;
  color: white;
  margin-top: 30px;
}

button:hover {
  background-color: #0f110c;
}

select {
  border: none;
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.fa-remove {
  font-size: 1rem;
}

@media (max-width: 750px) {
  #filter {
    top: 400px;
    width: 100%;
    height: 80vh;
  }
}
</style>
