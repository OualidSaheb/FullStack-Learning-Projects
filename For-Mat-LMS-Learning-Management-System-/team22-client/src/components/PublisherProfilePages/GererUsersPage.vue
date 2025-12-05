<script setup lang="ts">
import { ref } from 'vue'
import HeaderVert from '@/components/HeaderVert.vue'

const showAddUserForm = ref(false)

const userName = ref('')
const password = ref('')
const isAdmin = ref('')
const employeeId = ref('')
const email = ref('')
const image = ref('')
const role = ref('')

const addUser = () => {}

const toggleAddUserForm = () => {
  showAddUserForm.value = !showAddUserForm.value
}
</script>

<template>
  <HeaderVert></HeaderVert>
  <main>
    <div class="container">
      <h2>Utilisateurs</h2>
      <div class="contenu">
        <form>
          <table>
            <tr>
              <td>Nom de l'utilisateur</td>
              <td>Password</td>
              <td>isAdmin</td>
              <td>Id employé</td>
              <td>Email</td>
              <td>Image</td>
              <td>Role</td>
            </tr>
            <tr>
              <td>Carlos Morazan</td>
              <td>xxx</td>
              <td>Non</td>
              <td>15457954</td>
              <td>123@email.com</td>
              <td>xxxxxx</td>
              <td>Mécanique</td>
            </tr>
          </table>
        </form>
        <button @click="toggleAddUserForm" v-if="!showAddUserForm" class="btn-appear">
          + Ajouter Utilisateur
        </button>

        <form v-if="showAddUserForm">
          <table class="table-input">
            <tr>
              <td>Nom de l'utilisateur</td>
              <td>Password</td>
              <td>isAdmin</td>
              <td>Id employé</td>
              <td>Email</td>
              <td>Image</td>
              <td>Role</td>
            </tr>
            <tr>
              <td><input type="text" v-model="userName" /></td>
              <td><input type="text" v-model="password" /></td>
              <td><input type="text" v-model="isAdmin" /></td>
              <td><input type="text" v-model="employeeId" /></td>
              <td><input type="text" v-model="email" /></td>
              <td><input type="text" v-model="image" /></td>
              <td><input type="text" v-model="role" /></td>
            </tr>
            <tr>
              <td colspan="1">
                <button @click.prevent="addUser" class="btn-ajouter">Ajouter</button>
                <button @click="toggleAddUserForm" class="btn-cancel">Cancel</button>
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>
  </main>
</template>
<style scoped>
.container {
  margin-top: 40px;
}
h2 {
  font-weight: 600;
  margin-bottom: 20px;
}
.contenu {
  margin-left: 40px;
}
table {
  width: 100%;
  border: 1px solid black;
  margin-bottom: 5px;
}

td {
  text-align: center;
}

.table-input {
  border: none;
  margin-top: 20px;
}
.table-input td {
  text-align: left;
}
input {
  width: 100%;
  border: 1px solid black;
  outline: none;
}
.btn-appear {
  background-color: transparent;
  border: none;
  color: var(--laccent);
}
.btn-appear:hover {
  cursor: pointer;
  color: var(--daccent);
}
.btn-ajouter {
  font-weight: 600;
  padding: 5px;
  border: none;
  background-color: var(--laccent);
  color: white;
}
.btn-cancel {
  margin-left: 5px;
  font-weight: 600;
  padding: 5px;
  border: none;
  background-color: transparent;
  color: black;
  box-shadow: inset 0 0 0 1px black;
}
.btn-ajouter:hover {
  cursor: pointer;
}
.btn-cancel:hover {
  cursor: pointer;
}
</style>
