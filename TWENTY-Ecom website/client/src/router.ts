import { createRouter, createWebHistory } from "vue-router";
import Shop from "@/components/Shop.vue";
import NotFound from "@/components/NotFound.vue";
import Product from "@/components/Products/Product.vue";
import Sale from "@/components/Products/Sale.vue";
import Cart from "@/components/Cart/Cart.vue";
import Checkout from "@/components/Cart/Checkout.vue";
import Login from "@/components/Users/Login.vue";
import Signup from "@/components/Users/Signup.vue";
import Profile from "@/components/Users/Profile.vue";
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from "@/shared/guards/auth.guards";

import { useUser } from "@/shared/stores/userStore";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", components: { default: Shop } },
    { path: "/sale", component: Sale },
    { path: "/cart", component: Cart },
    { path: "/checkout", component: Checkout },
    { path: "/login", component: Login },
    { path: "/products/:id", component: Product },
    { path: "/:notFound(.*)", component: NotFound },
    {
      path: "/signin",
      beforeEnter: [isNotAuthenticatedGuard],
      component: () => Login,
    },
    {
      path: "/signup",
      beforeEnter: [isNotAuthenticatedGuard],

      component: () => Signup,
    },
    {
      path: "/profile",
      beforeEnter: [isAuthenticatedGuard],
      component: () => Profile,
    },
  ],
});
router.beforeEach(async () => {
  const userStore = useUser();
  if (userStore.currentUser == undefined) {
    await userStore.fetchCurrentUser();
  }
});

export default router;
