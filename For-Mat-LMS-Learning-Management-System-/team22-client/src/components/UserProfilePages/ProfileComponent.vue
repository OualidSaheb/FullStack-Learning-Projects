<!-- ca serais cool de verifier si les champs sont correct par le html... e-mail valide, username avec seulment charactere ou chiffre ... etc
possiblement devoir rajouter autre champs -->

<script setup lang="ts">
import Button from '@/components/Widgets/ButtonComp.vue'
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'
import HeaderVert from '../HeaderVert.vue'

const userStore = useUserStore()
const isEditing = ref(false) // barrer les champs par defaut

let picture = userStore.image
const edit = () => {
  isEditing.value = true
}

const save = () => {
  console.log('Data saved')
  isEditing.value = false // barrer les champs aprse sauvegarder
}

// const cancel = () => {
//   console.log(' cancel Data ')
//   isEditing.value = false // Lock the fields without saving
// }
</script>

<template>
  <HeaderVert></HeaderVert>
  <div class="container">
    <div class="profile-component">
      <!-- image -->
      <div class="image-content">
        <div class="image-section">
          <label>Image</label>
          <div class="image-box" :style="{ backgroundImage: `url(${picture})` }"></div>
        </div>

        <div class="name-section">
          <div class="input-group">
            <label>Nom d'utilisateur</label>
            <input type="text" v-model="userStore.username" :disabled="!isEditing" />
          </div>

          <!-- <div class="input-group">
            <label>Nom</label>
            <input type="text" />
          </div> -->
        </div>
      </div>

      <div class="input-group">
        <label>Email</label>
        <input type="email" v-model="userStore.email" :disabled="!isEditing" />
      </div>
      <div class="input-group">
        <label>Numéro d'employé</label>
        <input type="text" v-model="userStore.id" :disabled="!isEditing" />
      </div>
    </div>
  </div>
  <div class="actions">
    <!-- <Button
      btnText="Annuler"
      btnColor="var(--background)"
      btnBgColor="var(--laccent)"
      btnHoverColor="var(--laccent)"
      btnHoverBgColor="var(--background)"
      @click="cancel"
    ></Button> -->
    <Button
      btnText="Sauvegarder"
      btnColor="var(--background)"
      btnBgColor="var(--laccent)"
      btnHoverColor="var(--laccent)"
      btnHoverBgColor="var(--background)"
      @click="save"
    ></Button>
    <Button
      btnText="Edit"
      btnColor="var(--background)"
      btnBgColor="var(--laccent)"
      btnHoverColor="var(--laccent)"
      btnHoverBgColor="var(--background)"
      @click="edit"
    ></Button>
  </div>
</template>

<style scoped>
.profile-component {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  min-height: 100%;
  gap: 1rem;
  padding: 1rem;
  justify-content: center;
}

.image-content {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 30px;
}

.image-box {
  width: 150px;
  height: 150px;
  border: 1px solid #e0e0e0;
}

.input-section,
.image-section,
.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.gap {
  gap: 20px;
}

.name-section {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
}

label {
  font-weight: 700;
  font-size: 14px;
  color: #555;
}

input[type='text'],
input[type='email'] {
  flex: 1;
  padding: 13px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
}

input[type='text']:disabled {
  background-color: #f2f2f2;
}

.actions {
  display: flex;
  margin-top: 1rem;
  gap: 20px;
}

.btn {
  font-size: 14px;
}

.btn:hover {
  border: 1px solid var(--laccent);
}

@media (min-width: 768px) {
  .container {
    max-width: 50%;
  }

  .image-content {
    flex-direction: row;
  }
}

.profile-component {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  min-height: 100%;
  gap: 1rem;
  padding: 1rem;
  justify-content: center;
}

.image-content {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 30px;
}

.image-box {
  width: 150px;
  height: 150px;
  border: 1px solid #e0e0e0;
}

.input-section,
.image-section,
.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.gap {
  gap: 20px;
}

.name-section {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
}

label {
  font-weight: 700;
  font-size: 14px;
  color: #555;
}

input[type='text'],
input[type='email'] {
  flex: 1;
  padding: 13px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
}

input[type='text']:disabled {
  background-color: #f2f2f2;
}

.actions {
  display: flex;
  margin-top: 1rem;
  gap: 20px;
}

.btn {
  font-size: 14px;
}

.btn:hover {
  border: 1px solid var(--laccent);
}

@media (min-width: 768px) {
  .container {
    max-width: 50%;
  }

  .image-content {
    flex-direction: row;
  }
}
</style>
