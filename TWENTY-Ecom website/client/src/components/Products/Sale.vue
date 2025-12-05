<script setup lang="ts">
import { onMounted } from "vue";
import { useProducts } from "@/shared/stores/productsStore";
import { useCart } from "@/shared/stores/cartStore";
const productsStore = useProducts();
const cartStore = useCart();

onMounted(() => {
  productsStore.startCountdown();
});
</script>

<template>
  <div id="saleContainer">
    <div id="saleContent">
      <h1>SPECIAL SALE</h1>
      <div v-if="productsStore.countdown === 0">
        <!-- Message si le countdown est 0 -->
        <h2>Sorry the offer has ended !</h2>
      </div>
      <div id="cartItems" v-else>
        <h2>Last chance!</h2>
      </div>
      <p class="time">TIME REMAINING : {{ `${productsStore.formattedTime}` }}</p>
    </div>

    <ul>
      <li v-for="product of productsStore.getsaleProducts" :key="product.id">
        <div id="liste_produit">
          <img :src="product.image_url" alt="Product Image" />

          <div class="produit_info">
            <p class="name_produit">{{ `${product.name}` }}</p>

            <div class="produit_wrap">
              <div class="info-gauche">
                <p class="old-price">{{ `${product.list_price} $` }}</p>
                <p>{{ `${product.sale_price} $` }}</p>
              </div>
              <div class="info-droit">
                <button @click="cartStore.addToCart(product, true)"><i class="fa fa-cart-plus"></i></button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
#saleContainer {
  display: block;
  position: absolute;
  background-color: #fdecef;
  overflow: hidden;
  width: 100%;
  top: 100px;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 22px;
  margin: 0 auto;
}

ul {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 35px;
}

li {
  width: 300px;
  list-style: none;
}

#liste_produit img {
  width: 300px;
  height: 300px;
  border: 1px solid #fdecef;
  margin-bottom: 10px;
}

.name_produit {
  font-size: 14px;
  font-weight: 400;
  height: 30px;
}

.produit_wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
}

.info-gauche {
  font-weight: 700;
}

.info-droit button {
  color: #612940;
  border: none;
  cursor: pointer;
  font-size: 1.7rem;
  background-color: transparent;
}

.info-droit button:hover {
  color: #0f110c;
}

.old-price {
  text-decoration-line: line-through;
  font-size: 12px;
  margin-top: 5px;
}

#saleContent {
  text-align: center;
}

.time {
  margin: 10px auto;
}
</style>
