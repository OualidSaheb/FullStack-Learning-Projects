<script setup lang="ts">
import { computed, ref, onBeforeMount, watch } from "vue";
import { useProducts } from "@/shared/stores/productsStore";
import { useCart } from "@/shared/stores/cartStore";
import { useFilter } from "@/shared/stores/filterStore";
import { useSearch } from "@/shared/stores/searchStore";
import { ProductInterface } from "@/shared/interfaces/product.interface";
const searchStore = useSearch();
const cartStore = useCart();
const filterStore = useFilter();
const productsStore = useProducts();

// Ref pour le nombre de produits par page. L'utilisateur peut la modifier
const productsPerPage = ref(12);

// Création d'une référence réactive pour stocker la page actuelle
const currentPage = ref(1);

// Calcul du nombre total de pages en utilisant le nombre de produit total / le nombre de produit par page
const totalPages = computed(() => Math.ceil(productsStore.getProducts.length / productsPerPage.value));

//fonction pour changer la page
const changePage = (page: number) => {
  // Vérification que la page est dans les limites valides
  if (page >= 1 && page <= totalPages.value) {
    // Mise à jour de la valeur de la page actuelle
    currentPage.value = page;
  }
};

// Calcul des produits à afficher sur la page actuelle
const displayedProducts = computed(() => {
  // Calcul de l'index de départ pour les produits affichés sur la page, -1 car index = 0
  const startIndex = (currentPage.value - 1) * productsPerPage.value;

  // Calcul de l'index de fin pour les produits affichés sur la page
  const endIndex = startIndex + productsPerPage.value;

  // mothode slice () pour afficher les produits entre le startIndex et le endIndex
  return productsStore.getProducts.slice(startIndex, endIndex);
});

function showFilter() {
  if (searchStore.show) {
    searchStore.show = !searchStore.show;
  }
  filterStore.show = !filterStore.show;
}

async function addToCart(product: ProductInterface) {
  const cartData: {
    id: number;
    quantity: number;
    currentPrice: number;
    sku: string;
    name: string;
    sale_price: number;
    image_url: string;
    list_price: number;
  } = {
    id: product.id,
    sku: product.sku,
    name: product.name,
    list_price: product.list_price,
    sale_price: product.sale_price,
    image_url: product.image_url,
    quantity: 1, // You can set the initial quantity as needed
    currentPrice: product.list_price, // Use the appropriate price field from your product
  };

  try {
    console.log("cartData before addCart:", cartData);

    await cartStore.addCart(cartData);
    await cartStore.fetchUserCarts();
  } catch (error) {
    // Handle any errors, e.g., show an error message
    console.error("Error adding to cart:", error);
  }
}

onBeforeMount(async () => {
  productsStore.fetchProducts();
  await cartStore.fetchUserCarts();
});
// reset page if produit par page est changer
watch(
  () => productsPerPage.value,
  () => {
    changePage(1);
  }
);
</script>

<template>
  <div>
    <div id="titre">
      <h1>OUR PRODUCTS</h1>
    </div>

    <div id="filtre">
      <div>
        <i class="fa fa-sort" aria-hidden="true" v-on:click="productsStore.toggleSortDirection"></i>

        <p>SORT BY:</p>
        <input type="button" value="PRICE" v-on:click="productsStore.sortByPrice" />|
        <input type="button" value="POPULAR" v-on:click="productsStore.sortByRating" />

        <div v-show="productsStore.sortPrice">| By price</div>
        <div v-show="productsStore.sortRating">| By popular</div>
        <div v-show="productsStore.sortPrice || productsStore.sortRating">
          <div v-if="productsStore.direction">- decrease</div>
          <div v-else>+ increase</div>
        </div>
      </div>
      <div>
        <p>Page {{ currentPage }} of {{ totalPages }}</p>
        |
        <label for="productsPerPageInput">| Products per page : </label>
        <input id="productsPerPageInput" type="number" v-model="productsPerPage" min="1" />
      </div>
    </div>
    <div id="hamburger">
      <i class="fa fa-sliders" aria-hidden="true" v-on:click="showFilter"></i>

      <p>FILTER</p>
      <div v-show="productsStore.filterCategory">| By categorty: {{ productsStore.filterCategory }}</div>
      <div v-show="productsStore.filterPrice">| By price: {{ productsStore.filterPrice }}</div>
      <div v-show="productsStore.filterBrand">| By brand: {{ productsStore.filterBrand }}</div>
      <div v-show="productsStore.filterRating">| By rating: {{ productsStore.filterRating }}</div>
    </div>

    <!-- <myButton button-text="Click me" button-color="#00AA00" button-hover-color="#007000"></myButton> -->

    <ul>
      <li v-for="product of displayedProducts" :key="product.id">
        <div id="liste_produit">
          <img :src="product.image_url" alt="Product Image" />

          <div class="produit_info">
            <p class="name_produit">{{ `${product.name}` }}</p>

            <div class="produit_wrap">
              <div class="info-gauche">
                <p>{{ `${product.list_price} $` }}</p>
              </div>
              <div class="info-droit">
                <button @click="addToCart(product)">
                  <i class="fa fa-cart-plus" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="totalPages === 0" id="no-items" class="noItems">No items found.</div>

    <div id="pages">
      <button class="bottonPage" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
      <span> page {{ currentPage }} of {{ totalPages }}</span>
      <button class="bottonPage" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
#titre {
  background-color: #612940;
  color: white;
  padding: 0px 80px;
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
}

#productsPerPageInput {
  margin-left: 5px;
  width: 50px;
  border: none;
  padding-left: 5px;
}

#filtre {
  margin: 30px 0px 0px 0px;
  padding: 10px 40px 10px 0px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  background-color: #fdecef;
}

#filtre>div:nth-child(1) {
  padding-left: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 5px;
}

#filtre>div:nth-child(1) input {
  border: none;
  cursor: pointer;
  background-color: #fdecef;
}

#filtre>div:nth-child(1) input:hover {
  background-color: #612940;
  color: white;
}

#filtre>div:nth-child(1) i {
  font-size: 1.2rem;
  cursor: pointer;
}

#filtre>div:nth-child(2) {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
}

#filtre p {
  margin-right: 10px;
}

#hamburger {
  padding-left: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  gap: 5px;
  margin-top: 5px;
  margin-bottom: 30px;
}

#hamburger i {
  font-size: 1.2rem;
  cursor: pointer;
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

#pages {
  display: flex;
  justify-content: center;
  align-items: baseline;
  margin-top: 45px;
  gap: 10px;
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

.bottonPage {
  border-radius: 3px;
  padding: 5px;
  background-color: #612940;
  color: white;
}

.bottonPage:hover {
  color: #0f110c;
  background-color: #fdecef;
}

.noItems {
  display: flex;
  justify-content: center;
  font-weight: bold;
}

@media (max-width: 750px) {
  #logo {
    padding-left: 0px;
  }

  #titre {
    font-size: 20px;
    text-align: center;
    justify-content: center;
  }

  #filtre {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;

    padding: 10px 0px 10px 0px;
    height: 80px;
    background-color: #fdecef;
  }

  #filtre>div:nth-child(1) {
    padding: 10px 0px 10px 10px;
    text-align: left;
  }

  #filtre>div:nth-child(2) {
    border-bottom: 1px solid #cecccc;
    width: 100%;
    padding: 10px 10px 10px 10px;
  }

  #hamburger {
    padding-left: 10px;
  }

  #message {
    background-color: #612940 !important;
  }
}
</style>
