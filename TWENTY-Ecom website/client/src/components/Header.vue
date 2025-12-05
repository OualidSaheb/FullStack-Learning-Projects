<script setup lang="ts">
import "font-awesome/css/font-awesome.min.css";
import { useCart } from "@/shared/stores/cartStore";
import { useSearch } from "@/shared/stores/searchStore";
import { useFilter } from "@/shared/stores/filterStore";
import { computed } from "vue";
import CartSummary from "./Cart/CartSummary.vue";
import Search from "./Products/search.vue";

const cartStore = useCart();
const searchStore = useSearch();
const filterStore = useFilter();

//pour calculer le nombre au total des produits dans le panier
const quantity = computed(() => cartStore.getTotalQuantity);

function showSearchBar() {
  if (filterStore.show) {
    filterStore.show = !filterStore.show;
  }
  searchStore.show = !searchStore.show;
}
defineProps<{ isAuthenticated: boolean }>();
const emit = defineEmits<{
  (e: "signOut"): void;
}>();
</script>

<template>
  <div class="header">
    <router-link to="/">
      <div id="logo">TWENTY</div>
    </router-link>
    <div id="menu">
      <ul id="menuText">
        <li>
          <router-link to="/sale"> SALE</router-link>
        </li>
        <li>
          <router-link to="/brands">BRANDS</router-link>
        </li>
        <li>
          <router-link to="/clothes"> CLOTHES</router-link>
        </li>
        <li>
          <router-link to="/home">HOME</router-link>
        </li>
      </ul>
      <ul id="menuIcon">
        <li><i class="fa fa-search" aria-hidden="true" v-on:click="showSearchBar"></i></li>
        <li>
          <i class="fa fa-shopping-bag show" aria-hidden="true" v-on:click="cartStore.toggleCartVisibility"></i>
        </li>

        <li>
          <router-link v-if="isAuthenticated" to="/profile">
            <i class="fa fa-user-o" aria-hidden="true"></i>
          </router-link>
          <router-link v-else to="/signup">
            <i class="fa fa-user-o" aria-hidden="true"></i>
          </router-link>
        </li>
      </ul>
    </div>
    <div id="quantity">{{ quantity }}</div> 
    <Search v-if="searchStore.show"></Search>
    <CartSummary v-if="cartStore.show"></CartSummary>
  </div>
</template>

<style scoped>
#quantity {
  display: block;
  position: absolute;
  top: 20px;
  right: 52px;
  color: white;
  font-size: 0.8rem;
  background-color: #612940;
  border-radius: 50%;
  padding: 1.5px;
}

.header {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100px;
  align-items: center;
}

a {
  text-decoration: none;
}

#logo {
  height: 60px;
  padding-left: 80px;
  font-size: 3rem;
  font-weight: bold;
}

#menu {
  height: 60px;
  padding-right: 20px;
  line-height: 60px;
}

#menu ul {
  display: inline;
  margin-left: 20px;
  list-style-type: none;
}

#menuText li {
  display: inline;
  margin-left: 20px;
  cursor: pointer;
}

#menuText li:hover {
  background-color: #fdecef;
}

#menuIcon li {
  display: inline;
  margin-left: 10px;
}

i {
  cursor: pointer;
  font-size: 1.5rem;
}

i:hover {
  background-color: #fdecef;
}

@media (max-width: 750px) {
  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  #quantity {
    display: none;
  }

  .header > div:nth-child(1) {
    text-align: center;
    border-bottom: 1px solid #cecccc;
  }

  .header > div:nth-child(2) {
    text-align: right;
  }
}
</style>
