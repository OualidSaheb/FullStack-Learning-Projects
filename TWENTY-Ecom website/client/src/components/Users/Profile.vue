<script setup lang="ts">
import { useUser } from "@/shared/stores/userStore";
import { useAddress } from "@/shared/stores/addressStore";
import { useCard } from "@/shared/stores/cardStore";

import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import type { AddressInterface } from "@/shared/interfaces/address.interface";
import { CardInterface } from "@/shared/interfaces/card.interface";
import { useCart } from "@/shared/stores/cartStore";

const userStore = useUser();
const router = useRouter();
const cartStore = useCart();

const signOut = async () => {
  await userStore.signOut();
  await cartStore.logout();
  router.push("/signin");
};

const editingInfo = ref(""); //
const editedData = ref<Record<string, string | null>>({});

// Edit method
const editInfo = (infoName: string) => {
  editingInfo.value = infoName;
  editedData.value[infoName] = userStore.currentUser?.[infoName] || "";
};

const saveInfo = async (infoName: string) => {
  try {
    const updatedData = { [infoName]: editedData.value[infoName] };
    await userStore.editProfile(updatedData);

    if (userStore.currentUser) {
      userStore.currentUser[infoName] = editedData.value[infoName] || null; // Use null as default value
    }

    editingInfo.value = ""; // Clear editing mode
  } catch (error) {
    console.error("Error updating info:", error);
  }
};

/////////////// CREATE ADDRESSS ///////////////
const addressStore = useAddress();

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
    //await addressStore.getUserAddresses();
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

/////////////// UPDATE ADDRESSS ///////////////
const saveEditedAddress = async (index: number) => {
  try {
    const editedAddress = addressStore.addresses[index];
    console.log("editedAddress:", editedAddress); // Log editedAddress
    await addressStore.editAddress(index, editedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
  }
};

/////////////// DELETE ADDRESSS ///////////////

const deleteAddress = async (index: number) => {
  try {
    await addressStore.deleteAddress(index);
  } catch (error) {
    console.error("Error deleting address:", error);
  }
};

/////////////// CREATE ADDRESSS ///////////////
const cardStore = useCard();

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

/////////////// UPDATE CARD ///////////////
const saveEditedCard = async (index: number) => {
  try {
    const editedCard = cardStore.cards[index];
    console.log("editedCard:", editedCard);
    await cardStore.editCard(index, editedCard);
  } catch (error) {
    console.error("Error updating card :", error);
  }
};

/////////////// DELETE ADDRESSS ///////////////

const deleteCard = async (index: number) => {
  try {
    await cardStore.deleteCard(index);
  } catch (error) {
    console.error("Error deleting card :", error);
  }
};

// GET ADDRESSES AND CARDS FROM USERS
onMounted(async () => {
  await addressStore.getUserAddresses();
  await cardStore.getUserCards();
  await userStore.getOrders();
});
</script>

<template>
  <div id="profile">
    <form class="card">
      <h2>Mon profil</h2>

      <div id="header">
        <p v-if="editingInfo === 'name'">
          Name: <input v-model="editedData.name" />
          <button @click="saveInfo('name')">Save</button>
        </p>
        <p v-else>
          Name: {{ userStore.currentUser?.name }}
          <button @click="editInfo('name')">Edit</button>
        </p>

        <p v-if="editingInfo === 'email'">
          Email: <input v-model="editedData.email" />
          <button @click="saveInfo('email')">Save</button>
        </p>
        <p v-else>
          Email: {{ userStore.currentUser?.email }}
          <button @click="editInfo('email')">Edit</button>
        </p>
      </div>

      <hr />
      <h3>Addresses</h3>
      <div v-show="addressStore.addresses.length === 0">There are no address in your account.</div>
      <ul>
        <li v-for="(address, index) in addressStore.addresses" :key="index">
          <h4>Address {{ index + 1 }}</h4>
          <p>Stress Number: <input v-model="addressStore.addresses[index].numberAddress" /></p>
          <p>Street: <input v-model="addressStore.addresses[index].streetAddress" /></p>
          <p>Postal Code: <input v-model="addressStore.addresses[index].postCode" /></p>

          <!-- Save and Cancel buttons -->
          <div class="button">
            <button @click="saveEditedAddress(index)">Save</button>
            <button @click="deleteAddress(index)">Delete</button>
          </div>
        </li>
      </ul>
      <!-- Create new address -->
      <div>
        <div v-if="!addingNewAddress" @click="startAddingAddress">
          <i class="fa fa-plus" aria-hidden="true"><label>Add a new address</label> </i>
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
      <hr />
      <h3>Cards</h3>
      <div v-show="cardStore.cards.length === 0">There are no card in your account.</div>
      <ul>
        <li v-for="(card, index) in cardStore.cards" :key="index">
          <h4>Cards {{ index + 1 }}</h4>
          <p><label>Name on card :</label> <input v-model="cardStore.cards[index].nameOnCard" /></p>
          <p><label>Number card :</label> <input v-model="cardStore.cards[index].cardNumber" /></p>
          <p><label>Expiration :</label> <input v-model="cardStore.cards[index].expiration" /></p>
          <p><label>CVC :</label> <input v-model="cardStore.cards[index].CVC" /></p>

          <!-- Save and Cancel buttons -->
          <div class="button">
            <button @click="saveEditedCard(index)">Save</button>
            <button @click="deleteCard(index)">Delete</button>
          </div>
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
      <hr />
      <h3>Orders</h3>
      <ul id="orders">
        <div v-show="userStore.orders.length === 0">There are no order history.</div>
        <li v-for="(order, index) in userStore.orders" :key="index">
          <h4>Order {{ index + 1 }}</h4>
          <p>Mailing Address: <input v-model="userStore.orders[index].address" /></p>
          <ul id="carts">
            <li v-for="(cart, index1) in userStore.orders[index].lines">
              <h4>Item {{ index1 + 1 }}</h4>
              <p>Name: <input v-model="userStore.orders[index].lines[index1].product.name" /></p>
              <img :src="cart.product.image_url" alt="Product Image" />

              <p>Each: <input v-model="userStore.orders[index].lines[index1].currentPrice" /></p>
              <p>Quantity: <input v-model="userStore.orders[index].lines[index1].quantity" /></p>
            </li>
          </ul>

          <p>Subtotal: <input v-model="userStore.orders[index].subtotal" /></p>
          <p>Gst: <input v-model="userStore.orders[index].gst" /></p>
          <p>Qst: <input v-model="userStore.orders[index].qst" /></p>
          <p>Total: <input v-model="userStore.orders[index].total" /></p>

          <!-- Save and Cancel buttons -->
          <!-- <button @click="saveEditedAddress(index)">Save</button>
          <button @click="deleteAddress(index)">Delete</button> -->
        </li>
      </ul>
      <hr />
      <h2>Deconnexion</h2>
      <button @click="signOut">Déconnexion</button>
    </form>
  </div>
</template>

<style scoped>
#profile {
  margin: 0px 20px;

  line-height: 25px;
  padding: 10px;

  border: 1px #cecccc solid;
}
ul {
  padding-left: 10px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
}
ul li {
  list-style: none;
}

li p {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

button {
  background-color: #612940;
  border: none;
  color: white;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5px;
}

.button {
  margin: 5px auto;
}

i {
  margin: 15px auto 0px auto;
  cursor: pointer;
  font-size: 1.2rem;
}

i label {
  margin: auto 5px;
  cursor: pointer;
}
hr {
  margin: 15px auto;
  border: #cecccc 1px solid;
}

img {
  width: 80px;
  float: left;
  margin-top: 10px;
  margin-right: 3px;
}

#header {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 10px;
}
#header p {
  display: flex;
  flex-direction: row;
  width: 220px;
  justify-content: space-between;
}
</style>
