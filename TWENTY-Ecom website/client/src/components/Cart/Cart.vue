<script setup lang="ts">
import "font-awesome/css/font-awesome.min.css";
import { useCart } from "@/shared/stores/cartStore";
import { useCheckout } from "@/shared/stores/checkoutStore";
import { computed, onBeforeMount } from "vue";
import { ProductInterface } from "@/shared/interfaces/product.interface";

const cartStore = useCart();
const checkoutStore = useCheckout();

import { useUser } from "@/shared/stores/userStore";
const userStore = useUser();

import { useRouter } from "vue-router";
const router = useRouter();

const cartItems = computed(() => cartStore.carts);

const subtotal = computed(() => cartStore.getSubtotal);

const gst = computed(() => cartStore.getGst);

const qst = computed(() => cartStore.getQst);

const freeShipping = computed(() => cartStore.getFreeShipping);

const total = computed(() => cartStore.getTotal);

onBeforeMount(async () => {
  if (userStore.isAuthenticated) {
    await cartStore.fetchUserCarts();
  }
});
function memberToCheckout() {
  if (!userStore.isAuthenticated) {
    userStore.show = true;
  } else {
    checkoutStore.step = 1;

    router.push("/checkout");
  }
}

const removeItemFromCart = async (index: number) => {
  try {
    await cartStore.removeCart(index);
    await cartStore.fetchUserCarts();
  } catch (error) {
    console.error("Error deleting card :", error);
  }
};
</script>

<template>
  <div id="cart">
    <div id="title">
      <label>Shopping Cart({{ cartStore.getTotalQuantity }} Items)</label>
    </div>

    <!-- <h2>Shopping Cart</h2> -->
    <div id="cart-content">
      <div id="cart-left">
        <div v-if="cartItems.length === 0">
          <!-- Message si le panier est vide -->
          There are no items in your bag.
        </div>
        <div id="cartItems" v-else>
          <div v-for="(item, index) in cartItems" :key="index" class="item">
            <img :src="item.product.image_url" alt="Product Image" />
            <div id="itemDetail">
              <div>{{ item.product.name }}</div>
              <div id="itemprice">
                <div>Each: ${{ item.currentPrice }}</div>
                <div>Total: ${{ (item.currentPrice * item.quantity).toFixed(2) }}</div>
              </div>
              <div>
                Qty:
                <input
                  type="number"
                  id="quantity"
                  v-model="item.quantity"
                  @change="cartStore.updateQuantity(item.product.id, item.quantity)"
                  min="1"
                />
              </div>

              <div>
                <button @click="removeItemFromCart(index)">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="cart-right">
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
            <div>Shipping</div>
            <div>{{ freeShipping ? "Free" : "$15" }}</div>
          </div>
          <div class="orderDetail">
            <div>Total</div>
            <div>${{ total }}</div>
          </div>
          <div id="checkout">
            <router-link to="/checkout">
              <input
                type="submit"
                :disabled="userStore.isAuthenticated || cartStore.carts.length === 0"
                class="button"
                value="Guest Checkout"
                @click="checkoutStore.toCheckoutShipping"
            /></router-link>

            <input
              :disabled="cartStore.carts.length === 0"
              type="submit"
              class="button"
              value="Member Checkout"
              @click="memberToCheckout"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#cart {
  display: flex;
  flex-direction: column;
  margin: 0px 40px;
  padding-top: 20px;

  max-width: 100%;
  padding: 10px;
}

#title {
  margin-bottom: 10px;
  font-size: 2rem;

  padding-bottom: 10px;
  font-weight: bold;
  display: flex;
  align-items: baseline;
  gap: 5px;
}

#cart-content {
  margin-top: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  border: 1px #cecccc solid;
  padding: 30px;
}

#cartItems {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#itemprice {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#itemDetail {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#cart-left {
  width: 65%;
}

#cart-right {
  width: 30%;
}

img {
  width: 120px;
  float: left;
  margin-right: 10px;
}

.item {
  padding-bottom: 10px;
  border-bottom: 1px solid #cecccc;
}



.item div:nth-child(3) {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

#orderSummary {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.button {
  width: 100%;
  background-color: #612940;
  border: none;
  color: white;
  padding: 10px 10px;
  text-align: center;
  text-decoration: none;
  font-size: 1.3rem;
  border-radius: 16px;
  font-weight: bold;
  cursor: pointer;
  height: 50px;
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
  width: 80px;
}

button:hover {
  background-color: #0f110c;
}

input {
  width: 50px;
  border-radius: 4px;
  border: #cecccc 1px solid;
  padding-left: 5px;
}

*:disabled {
  background-color: dimgrey;
  color: linen;
  opacity: 1;
}

*:disabled:hover {
  background-color: dimgrey;
}

@media (max-width: 750px) {
  #cart {
    top: 100px;
  }
}
</style>
