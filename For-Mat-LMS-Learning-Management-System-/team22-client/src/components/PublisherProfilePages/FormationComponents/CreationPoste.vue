<script setup lang="ts"></script>

<template>
  <main>
    <div class="container">
      <h2>Création de poste</h2>
      <div class="form">
        <div class="input">
          <label for="titre">Titre</label>
          <input id="titre" type="text" />
        </div>
        <div class="input">
          <label for="description">Description</label>
          <input id="description" type="text" />
        </div>
      </div>
      <div class="btn">
        <button>Creer poste</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  width: 100% !important;
}
h2 {
  margin-top: 40px;
  padding-left: 20px;
}
.input {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  width: 70%;
}
.form {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
#description {
  height: 200px;
  margin-top: 10px;
}
#titre {
  height: 35px;
  margin-top: 10px;
}
.btn {
  display: flex;
  justify-content: flex-end;
  margin: 40px;
}
button {
  background-color: var(--laccent);
  color: white;
  font-size: 12px;
  padding: 2px 10px;
}
</style>
