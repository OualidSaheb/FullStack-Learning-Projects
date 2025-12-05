<script setup lang="ts">
import "font-awesome/css/font-awesome.min.css";
import { useCart } from "@/shared/stores/cartStore";
import { computed, onMounted, watch, ref } from "vue";

const cartStore = useCart();

const removeItemFromCart = async (index: number) => {
  try {
    await cartStore.removeCart(index);
    await cartStore.fetchUserCarts();
  } catch (error) {
    console.error("Error deleting card :", error);
  }
};
onMounted(async () => {
  await cartStore.fetchUserCarts();
});

const cartItems = computed(() => cartStore.getCartItemsFormatted);

const subtotal = computed(() => cartStore.getSubtotal);

const gst = computed(() => cartStore.getGst);

const qst = computed(() => cartStore.getQst);

const total = computed(() => cartStore.getTotal);

watch(
  () => cartItems,
  (newCarts, oldCarts) => {
    console.log("Cart items updated:", newCarts);
  },
  { deep: true }
);
</script>

<template>
  <div id="cart">
    <div id="title">
      <h2>Your Shopping Cart</h2>
    </div>
    <div>
      <div v-if="cartItems.length === 0">There are no item in your bag.</div>
      <div id="cartIems" v-else>
        <div v-for="(cart, index) in cartItems" :key="index" class="item">
          <div v-if="cart.product">
            <div>{{ cart.product.name }}</div>
            <img :src="cart.product.image_url" alt="Product Image" />
            <div>
              <div>Each: ${{ cart.currentPrice }}</div>
              <div>Qty {{ cart.quantity }}</div>

              <div>
                <button @click="removeItemFromCart(index)">Remove</button>
              </div>
            </div>
          </div>
        </div>
        <div id="orderSummary">
          <div>Order Summary</div>
          <div class="orderDetail">
            <div>Subtotal</div>
            <div>${{ subtotal }}</div>
          </div>
          <div class="orderDetail">
            <div>GST</div>
            <div>${{ gst }}</div>
          </div>
          <div class="orderDetail">
            <div>QST</div>
            <div>${{ qst }}</div>
          </div>
          <div class="orderDetail">
            <div>Total</div>
            <div>${{ total }}</div>
          </div>
        </div>

        <div id="checkout">
          <router-link to="/cart">
            <input type="submit" class="button" value="View cart" v-on:click="cartStore.toggleCartVisibility"
          /></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#title {
  margin-bottom: 10px;
  text-align: center;
  border-bottom: 1px solid black;
  padding-bottom: 10px;
}

#cart {
  display: block;
  position: absolute;
  background-color: #fdecef;
  width: 400px;
  top: 60px;
  right: 0px;
  z-index: 2;
  padding: 10px;
}

#cartItems {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

img {
  width: 80px;
  float: left;
  margin-right: 10px;
}

.item {
  padding-bottom: 10px;
  border-bottom: 1px solid #cecccc;
}

.item > div:nth-child(1) {
  margin-bottom: 10px;
}

.item div:nth-child(3) {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

#orderSummary {
  text-align: left;
}

#orderSummary > div:nth-child(1) {
  font-size: 1.5rem;
  font-weight: bold;
}

.orderDetail {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.orderDetail:nth-child(6) {
  font-weight: bold;
}

i {
  float: right;
  cursor: pointer;
}

#checkout {
  width: 100%;
  margin-top: 10px;
  text-align: center;
}

.button {
  width: 100%;
  background-color: #612940;
  border: none;
  color: white;
  padding: 10px 10px;
  text-align: center;
  text-decoration: none;
  font-size: 14px;
  border-radius: 16px;
  font-weight: bold;
  cursor: pointer;
}

.button:hover {
  background-color: #0f110c;
}

button {
  background-color: #612940;
  border: none;
  color: white;
  padding: 3px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0f110c;
}

input {
  width: 50px;
  border-radius: 4px;
  border: none;
  padding-left: 5px;
}

@media (max-width: 750px) {
  #cart {
    top: 100px;
  }
}
</style>
