<script setup lang="ts">
import "font-awesome/css/font-awesome.min.css";
import { useCart } from "@/shared/stores/cartStore";
import { useCheckout } from "@/shared/stores/checkoutStore";
import { ref, computed, onMounted, onBeforeMount } from "vue";
import { reactive } from "vue";
import { OrderInterface, cardType, PaymentCardInerface } from "@/shared/interfaces/order.interface";
import { CardInterface } from "@/shared/interfaces/card.interface";
import type { AddressInterface } from "@/shared/interfaces/address.interface";

import { useUser } from "@/shared/stores/userStore";
const userStore = useUser();

import { useAddress } from "@/shared/stores/addressStore";
const addressStore = useAddress();

import { useCard } from "@/shared/stores/cardStore";
const cardStore = useCard();

const email = ref("");
const name = ref("");

const address = ref("");

const creditCard = ref("");

const order = reactive<OrderInterface>({} as OrderInterface);
const paymentMethod = reactive<PaymentCardInerface>({} as PaymentCardInerface);

const cartStore = useCart();
const checkoutStore = useCheckout();

const cartItems = computed(() => cartStore.carts);

const subtotal = computed(() => cartStore.getSubtotal);

const gst = computed(() => cartStore.getGst);

const qst = computed(() => cartStore.getQst);

const freeShipping = computed(() => cartStore.getFreeShipping);

const total = computed(() => cartStore.getTotal);

// GET ADDRESSES AND CARDS FROM USERS

onBeforeMount(async () => {
  if (userStore.isAuthenticated) {
    await addressStore.getUserAddresses();
    await cardStore.getUserCards();
    await userStore.getOrders();
  }
});

function toCheckoutPayment() {
  order.email = email.value;
  order.name = name.value;
  order.address = address.value;

  checkoutStore.toCheckoutPayment();
}

function toCheckoutReview() {
  paymentMethod.cardNumber = creditCard.value;
  if (userStore.isAuthenticated) {
    order.address = addressStore.addressDefault as string;
    checkoutStore.paymentMethod.cardNumber = cardStore.cardDefault;
  }

  checkoutStore.toCheckoutReview();
}

async function placeOrder() {
  order.lines = cartItems.value;
  order.gst = Number(gst.value);
  order.qst = Number(qst.value);
  order.subtotal = Number(subtotal.value);
  order.total = Number(total.value);
  order.paymentMethod = paymentMethod;

  if (userStore.isAuthenticated) {
    console.log("login ok");
    order.email = userStore.currentUser?.email as string;
    order.name = userStore.currentUser?.name as string;
    order.address = addressStore.addressDefault.toString();

    order.paymentMethod.cardNumber = cardStore.cardDefault;
  }
  checkoutStore.toConfirmOrder();
  await checkoutStore.createOrder(order);
}

/////////////// CREATE ADDRESSS ///////////////

const addingNewAddress = ref(false);
const newAddress = ref<AddressInterface>({
  numberAddress: 0,
  streetAddress: "",
  postCode: "",
});

const startAddingAddress = () => {
  addingNewAddress.value = true;
};

const saveNewAddress = async () => {
  try {
    // Create a new address using the store's action
    await addressStore.createAddress(newAddress.value);
    await addressStore.getUserAddresses();
    // Reset the form
    newAddress.value = {
      numberAddress: 0,
      streetAddress: "",
      postCode: "",
    };

    // Hide the form
    addingNewAddress.value = false;
  } catch (error) {
    console.error("Error creating new address:", error);
  }
};

const cancelNewAddress = () => {
  // Reset the form
  newAddress.value = {
    numberAddress: 0,
    streetAddress: "",
    postCode: "",
  };

  // Hide the form
  addingNewAddress.value = false;
};

/////////////// CREATE CARDS ///////////////
const addingNewCard = ref(false);
const newCard = ref<CardInterface>({
  nameOnCard: "",
  cardNumber: "",
  expiration: "",
  CVC: "",
});

const startAddingCard = () => {
  addingNewCard.value = true;
};

const saveNewCard = async () => {
  try {
    // Create a new card using the store's action
    await cardStore.createCard(newCard.value);
    await cardStore.getUserCards();

    // Reset the form
    newCard.value = {
      nameOnCard: "",
      cardNumber: "",
      expiration: "",
      CVC: "",
    };

    // Hide the form
    addingNewCard.value = false;
  } catch (error) {
    console.error("Error creating new card:", error);
  }
};

const cancelNewCard = () => {
  // Reset the form
  newCard.value = {
    nameOnCard: "",
    cardNumber: "",
    expiration: "",
    CVC: "",
  };

  // Hide the form
  addingNewCard.value = false;
};

function toModifyAddress() {
  if (userStore.isAuthenticated) {
    checkoutStore.flagForModifyAddress = !checkoutStore.flagForModifyAddress;
    checkoutStore.flagForModifyCard = false;
  } else {
    checkoutStore.toCheckoutShipping();
  }
}

function toModifyCard() {
  if (userStore.isAuthenticated) {
    checkoutStore.flagForModifyAddress = false;
    checkoutStore.flagForModifyCard = !checkoutStore.flagForModifyCard;
  } else {
    checkoutStore.toCheckoutPayment();
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
    <div id="title"><label>Checkout</label>({{ cartStore.getTotalQuantity }} Items)</div>

    <!-- <h2>Shopping Cart</h2> -->
    <div id="cart-content">
      <div id="cart-left">
        <div v-if="checkoutStore.step == 1">
          <template v-if="!userStore.isAuthenticated">
            <div>1 - SHIPPING</div>
            <div class="segment">
              <h2>Contact Information</h2>
              <div class="info"><label>Email:</label><input type="text" v-model="email" /></div>
            </div>
            <div class="segment">
              <h2>Shipping Address</h2>
              <div id="shippingAddress">
                <!-- <div class="info"><label>First Name:</label><input type="text" v-model="firstName" /></div> -->
                <div class="info"><label>Name:</label><input type="text" v-model="name" /></div>
                <div class="info"><label>Address:</label><input type="text" v-model="address" /></div>
                <!-- <div class="info"><label>Postal Code:</label><input type="text" v-model="postCode" /></div> -->
              </div>
            </div>
          </template>
          <template v-else>
            <div>1 - SHIPPING-Member</div>
            <div class="segment">
              <h2>Contact Information</h2>
              <div class="info">
                <label>Email:</label><label>{{ userStore.currentUser?.email }}</label>
              </div>
            </div>
            <div class="segment">
              <h2>Shipping Address</h2>
              <div id="shippingAddress">
                <!-- <div class="info"><label>First Name:</label><input type="text" v-model="firstName" /></div> -->
                <div class="info">
                  <label>Name:</label><label>{{ userStore.currentUser?.name }}</label>
                </div>
                <div class="info">
                  <label>Address:</label><label>{{ addressStore.addressDefault }}</label>
                </div>
              </div>
            </div>
            <div class="info"><a href="#" @click="toCheckoutPayment">Change</a></div>
          </template>

          <div class="checkout">
            <input
              :disabled="cartStore.carts.length === 0"
              type="submit"
              class="button"
              value="Next: Payment"
              @click="toCheckoutPayment"
            />
          </div>
        </div>
        <div v-else-if="checkoutStore.step == 2">
          <template v-if="!userStore.isAuthenticated">
            <div>2 - PAYMENT</div>
            <div class="segment">
              <h2>Contact Information</h2>
              <div class="info"><label>Credit Card:</label><input type="text" v-model="creditCard" /></div>
            </div>
          </template>
          <template v-else>
            <div>2 - PAYMENT-Member</div>
            <div class="segment">
              <h2>Contact Information</h2>
              <div class="info">
                <label>Credit Card:</label><label>{{ cardStore.cardDefault }}</label>
              </div>
              <div class="info"><a href="#" @click="toCheckoutPayment">Change</a></div>
            </div>
          </template>

          <div class="checkout">
            <input
              :disabled="cartStore.carts.length === 0"
              type="submit"
              class="button"
              value="Previous: Shipping"
              @click="checkoutStore.toCheckoutShipping"
            />
            <input
              :disabled="cartStore.carts.length === 0"
              type="submit"
              class="button"
              value="Next: Order Review"
              @click="toCheckoutReview"
            />
          </div>
        </div>
        <div v-else-if="checkoutStore.step == 3">
          <div>3 - ORDER REVIEW</div>
          <div class="segment">
            <div>
              <h2>1 Shipping address</h2>
              <div class="info">
                <label>Address:</label
                ><label> {{ userStore.isAuthenticated ? addressStore.addressDefault : order.address }}</label>
              </div>
              <div class="info">
                <a href="#" @click="toModifyAddress"
                  ><div v-show="!checkoutStore.flagForModifyAddress">Change</div>
                  <div v-show="checkoutStore.flagForModifyAddress">Cancel</div>
                </a>
              </div>
            </div>
            <div v-show="checkoutStore.flagForModifyAddress">
              <h2>1 Choose a shipping address</h2>
              <div id="modifyDiv">
                <h2>Your addresses</h2>
                <ul id="modifyUL">
                  <li v-for="(address, index) in addressStore.addresses" :key="index">
                    <label class="radio">
                      <input
                        type="radio"
                        name="address"
                        @click="addressStore.addressDefault = addressStore.getAddressFormated(index)"
                      />
                      {{ addressStore.getAddressFormated(index) }}
                    </label>
                  </li>
                </ul>

                <!-- Create new address -->
                <div>
                  <div v-if="!addingNewAddress" @click="startAddingAddress">
                    <i class="fa fa-plus" aria-hidden="true">Add a new address</i>
                  </div>

                  <!-- Display the new address form when addingNewAddress is true -->
                  <div v-if="addingNewAddress">
                    <h4>Create New Address</h4>
                    <p>
                      Address number: <input v-model="newAddress.numberAddress" /> Street address:
                      <input v-model="newAddress.streetAddress" /> Postal Code: <input v-model="newAddress.postCode" />
                      <button @click="saveNewAddress">Save</button>
                      <button @click="cancelNewAddress">Cancel</button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="segment">
            <h2>2 Payment method</h2>
            <div class="info">
              <label>Credit Card:</label
              ><label> {{ userStore.isAuthenticated ? cardStore.cardDefault : paymentMethod.cardNumber }}</label>
            </div>
            <div class="info">
              <a href="#" @click="toModifyCard"
                ><div v-show="!checkoutStore.flagForModifyCard">Change</div>
                <div v-show="checkoutStore.flagForModifyCard">Cancel</div></a
              >
            </div>
          </div>
          <div v-show="checkoutStore.flagForModifyCard">
            <h2>2 Choose a payment method</h2>
            <div id="modifyDiv">
              <h2>Your credit cards</h2>
              <ul id="modifyUL">
                <li v-for="(card, index) in cardStore.cards" :key="index">
                  <label class="radio">
                    <input type="radio" name="card" @click="cardStore.cardDefault = cardStore.getCardFormated(index)" />
                    {{ cardStore.getCardFormated(index) }}
                  </label>
                </li>
              </ul>

              <div>
                <div v-if="!addingNewCard" @click="startAddingCard">
                  <i class="fa fa-plus" aria-hidden="true"><label>Add a new card</label> </i>
                </div>
                <!-- Display the new address form when addingNewCard is true -->
                <div v-if="addingNewCard">
                  <h4>Create New Card</h4>
                  <p>
                    Name on card : <input v-model="newCard.nameOnCard" /> Card number :
                    <input v-model="newCard.cardNumber" /> expiration : <input v-model="newCard.expiration" /> CVC :
                    <input v-model="newCard.CVC" />
                    <button @click="saveNewCard">Save</button>
                    <button @click="cancelNewCard">Cancel</button>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="userStore.currentUser?.email" class="">
            The comfirmation email will be sent to {{ userStore.currentUser?.email }}
          </div>

          <div class="checkout">
            <input
              :disabled="cartStore.carts.length === 0"
              type="submit"
              class="button"
              value="Preview: Payment"
              @click="checkoutStore.toCheckoutPayment"
            />
            <input
              :disabled="cartStore.carts.length === 0"
              type="submit"
              class="button"
              value="Place Order"
              @click="placeOrder"
            />
          </div>
        </div>
        <div v-else-if="checkoutStore.step == 4">
          <div>4 - ORDER CONFIRM</div>

          <div id="confirmMessage">
            Thank you! we have sent you an email for confirm your shopping
            <p><a href="/">Continue shopping</a></p>
          </div>
        </div>
      </div>
      <div id="cart-right">
        <div></div>
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
        </div>

        <div id="cartItems">
          <div>{{ cartStore.getTotalQuantity }} Items</div>
          <div v-for="(item,index) in cartItems" :key="index" class="item">
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
    </div>
  </div>
</template>

<style scoped>
#modifyUL {
  list-style-type: none;
  padding: 0;
  margin: 0;
  margin-top: 10px;
  background-color: white;
  text-align: left;
}
#modifyUL li {
  padding-left: 10px;
  height: 30px;
}
#modifyDiv {
  width: 100%;

  border: 1px #cecccc solid;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

i {
  padding-left: 28px;
  display: flex;
  gap: 5px;
}
.segment {
  margin-bottom: 20px;
  margin-top: 10px;
}
#shippingAddress {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.info {
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  font-size: 1.2rem;
}

.info > label:nth-child(1) {
  width: 130px;
  font-size: 1.2rem;
}
.info > label:nth-child(2) {
  font-size: 1.2rem;
}
.info input {
  width: 100%;
  line-height: 40px;
  font-size: 1.2rem;
}

.info a {
  font-size: 1.2rem;
  width: 100%;
  text-align: left;
}

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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px #cecccc solid;
  padding: 30px;
}

#cartItems {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

#cartItems > div:nth-child(1) {
  background-color: #cecccc;
  font-size: 1.5rem;
  font-weight: bold;
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

#cart-left > div > div:nth-child(1) {
  text-align: center;
  background-color: #cecccc;
  height: 50px;
  line-height: 50px;
  font-size: 1.5rem;
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

.checkout {
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.button {
  width: 300px;
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

#confirmMessage {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 30px;
}
</style>
