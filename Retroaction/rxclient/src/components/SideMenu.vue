<script setup lang="ts">
import { ref } from 'vue';
const isSidebarOpen = ref(false);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}
</script>

<template>
  <div class="container-fluid p-0 position-relative">
    <img src="@/assets/profile.jpg" alt="Profile" class="profile-img rounded-circle" @click="toggleSidebar" />

    <div class="overlay position-fixed top-0 start-0 w-100 vh-100" :class="{ 'show': isSidebarOpen }"
      @click="toggleSidebar"></div>

    <div class="right-sidebar position-fixed top-0 end-0 vh-100 shadow" :class="{ 'show-sidebar': isSidebarOpen }"
      @click.stop>
      <button @click="toggleSidebar" class="btn-close position-absolute top-0 end-0 m-2"
        aria-label="Close sidebar"></button>

      <nav class="sidebar-content mt-5 p-3">
        <div class="d-flex align-items-center align-self-center gap-3 mb-5">
          <img src="@/assets/profile.jpg" alt="Profile" class="profile-img rounded-circle" />
          <div>
            <p class="h5 ">Oualid</p>
            <p class="h6 m-0">Oualid@gmail.com</p>
          </div>
        </div>
        <a href="#" class="nav-link text-primary mb-1">Paramètres</a>
        <a href="#" class="nav-link text-primary mb-1">Se déconnecter</a>
      </nav>
    </div>
  </div>
</template>


<style lang="sass" scoped>
.profile-img
  cursor: pointer
  width: 40px
  height: 40px
  z-index: 1050

.overlay
  background-color: rgba(0, 0, 0, 0.5)
  z-index: 1040
  transition: opacity 0.5s
  display: none 
  &.show
    display: block
.right-sidebar
  width: 250px
  background-color: white
  transition: transform 0.3s ease-in-out
  transform: translateX(100%)
  z-index: 1050

.nav-link
  &:hover
    transition: transform 0.3s ease-in-out
    color: var(--bs-dark) !important
.show-sidebar
  transform: translateX(0)
</style>

