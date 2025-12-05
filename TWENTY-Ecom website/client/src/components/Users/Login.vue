<script setup lang="ts">
import { reactive, ref } from "vue";
import type { SigninFormInterface } from "@/shared/interfaces/User.interface";
import { useRouter } from "vue-router";
import { useUser } from "@/shared/stores/userStore";
import { useCart } from "@/shared/stores/cartStore";

const state = reactive<SigninFormInterface>({
  email: "email@email.com",
  password: "pass123",
});

const router = useRouter();
const userStore = useUser();
const cartStore = useCart();

const submit = async () => {
  await userStore.signIn({ ...state });
  await cartStore.login();
  if (!userStore.error) router.push("/profile");
};
const signup = async () => {
  router.push("/signup");
};
</script>

<template>
  <div>
    <div class="card">
      <h2>Connexion</h2>
      <div>
        <label for="email" class="mb-5">Courriel</label>
        <input id="email" v-model="state.email" type="email" />
      </div>
      <div class="d-flex flex-column mb-20">
        <label for="password" class="mb-5">Password</label>
        <input id="password" v-model="state.password" type="password" />
      </div>
      <div>
        <p>
          {{ userStore.error }}
        </p>
      </div>
      <div>
        <button @click="submit">Connexion</button>
        <button @click="signup">Don't have an account ?</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
div > p {
  color: red;
}
</style>
