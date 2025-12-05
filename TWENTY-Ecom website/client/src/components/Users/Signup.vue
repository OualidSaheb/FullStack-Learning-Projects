<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useUser } from "@/shared/stores/userStore";
import type { UserFormInterface } from "@/shared/interfaces/User.interface";

const state = reactive<UserFormInterface>({
  name: "Cédrik Dubogue",
  email: "email@email.com",
  password: "pass123",
});

const router = useRouter();
const userStore = useUser();

const submit = async () => {
  await userStore.createUser({ ...state });
  if (!userStore.error) router.push("/signin");
};
const login = async () => {
  router.push("/signin");
};
</script>

<template>
  <div>
    <div>
      <h2>Inscription</h2>
      <div>
        <label for="name" class="mb-5">Nom</label>
        <input id="name" v-model="state.name" type="text" />
      </div>
      <div>
        <label for="email" class="mb-5">Courriel</label>
        <input id="email" v-model="state.email" type="email" />
      </div>
      <div>
        <label for="password" class="mb-5">Password</label>
        <input id="password" v-model="state.password" type="password" />
      </div>
      <div>
        <p>
          {{ userStore.error }}
        </p>
      </div>
      <div>
        <button @click="submit">Inscription</button>
        <button @click="login">Already have an account ?</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
div > p {
  color: red;
}
</style>
