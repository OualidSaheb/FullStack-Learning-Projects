<script setup lang="ts">
import HeaderVert from '@/components/HeaderVert.vue'
import Button from '@/components/Widgets/ButtonComp.vue'
const save = () => {
  console.log('Data saved')
}

const cancel = () => {
  console.log(' cancel Data ')
}
</script>

<template>
  <HeaderVert></HeaderVert>
  <div class="container">
    <div class="profile-component">
      <div class="image-content">
        <div class="image-section">
          <label>Image</label>
          <div class="image-box"></div>
        </div>

        <div class="name-section">
          <div class="input-group">
            <label>Prénom</label>
            <input type="text" />
          </div>

          <div class="input-group">
            <label>Nom</label>
            <input type="text" />
          </div>
        </div>
      </div>

      <div class="input-section gap">
        <div class="input-group">
          <label>Email</label>
          <input type="email" />
        </div>
        <div class="input-group">
          <label>Organisation</label>
          <input type="text" />
        </div>
      </div>
      <div class="actions">
        <Button
          btnText="Annuler"
          btnColor="var(--background)"
          btnBgColor="var(--laccent)"
          btnHoverColor="var(--laccent)"
          btnHoverBgColor="var(--background)"
          @click="cancel"
        ></Button>
        <Button
          btnText="Sauvegarder"
          btnColor="var(--background)"
          btnBgColor="var(--laccent)"
          btnHoverColor="var(--laccent)"
          btnHoverBgColor="var(--background)"
          @click="save"
        ></Button>
      </div>
    </div>
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
