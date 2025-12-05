<script setup lang="ts">
import { ref } from 'vue'
import HeaderVert from '@/components/HeaderVert.vue'

import CreationPoste from './FormationComponents/CreationPoste.vue'
import CreationRole from './FormationComponents/CreationRole.vue'
import CreationCompetence from './FormationComponents/CreationCompetence.vue'

import GererPostes from './FormationComponents/GererPostes.vue'
import GererRoles from './FormationComponents/GererRoles.vue'
import GererCompetences from './FormationComponents/GererCompetences.vue'

const activeComponent = ref('CreationPoste') // Le composant actif par défaut
</script>

<template>
  <HeaderVert></HeaderVert>
  <main>
    <div class="container">
      <div class="gerer">
        <GererPostes v-if="activeComponent === 'CreationPoste'"></GererPostes>
        <GererRoles v-if="activeComponent === 'CreationRole'"></GererRoles>
        <GererCompetences v-if="activeComponent === 'CreationCompetence'"></GererCompetences>
      </div>
      <div class="creation">
        <div class="menu">
          <a
            @click="activeComponent = 'CreationPoste'"
            :class="{ activeMenu: activeComponent === 'CreationPoste' }"
            >Poste</a
          >
          <a
            @click="activeComponent = 'CreationRole'"
            :class="{ activeMenu: activeComponent === 'CreationRole' }"
            >Role</a
          >
          <a
            @click="activeComponent = 'CreationCompetence'"
            :class="{ activeMenu: activeComponent === 'CreationCompetence' }"
            >Compétence</a
          >
        </div>
        <CreationPoste v-if="activeComponent === 'CreationPoste'"></CreationPoste>
        <CreationRole v-if="activeComponent === 'CreationRole'"></CreationRole>
        <CreationCompetence v-if="activeComponent === 'CreationCompetence'"></CreationCompetence>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  display: flex;
  margin: 0 !important;
  height: 100vh;
}
.gerer {
  width: 50%;
}
.creation {
  background-color: #d9d9d9;
  width: 50%;
}
.menu {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
a {
  border: 1px solid black;
  width: 33.3%;
  text-align: center;
  font-size: 20px;
}
a:hover {
  cursor: pointer;
}
.activeMenu {
  background-color: var(--laccent);
  color: white;
}
</style>
