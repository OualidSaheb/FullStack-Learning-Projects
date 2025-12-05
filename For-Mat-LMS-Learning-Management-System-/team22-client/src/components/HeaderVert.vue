<script setup lang="ts">
import { ref, computed } from 'vue'
import 'font-awesome/css/font-awesome.min.css'
import ProfileIcon from './Widgets/ProfileIcon.vue'

import { SiteRole, useUserStore } from '@/stores/userStore'
const userStore = useUserStore()

const smallLogo = '4Mat'
const fullLogo = 'For-Mat'

// const logoStyle = computed(() => ({
//   backgroundImage: `url(${isExpanded.value ? fullLogo : smallLogo})`
// }))

const menuItemsPub = ref([
  {
    text: 'Organisation',
    iconClass: 'fa fa-institution',
    isCollapsed: true,
    route: '/organisation',
    subItems: []
  },
  {
    text: 'Utilisateurs',
    iconClass: 'fa fa-users',
    isCollapsed: true,
    route: '/utilisateurs',
    subItems: []
  },
  {
    text: 'Cours',
    iconClass: 'fa fa-list-alt',
    isCollapsed: true,
    route: '/cours',
    subItems: []
  },
  {
    text: 'Analyse',
    iconClass: 'fa fa-line-chart',
    isCollapsed: true,
    route: '/analyse',
    subItems: []
  }
])

const menuItemsAdmin = ref([
  {
    text: 'Roles',
    iconClass: 'fa fa-gears',
    isCollapsed: true,
    route: '/roles',
    subItems: [
      {
        text: 'Creation role',
        route: ''
      },
      {
        text: 'Gerer role',
        route: ''
      }
    ]
  },
  {
    text: 'Utilisateurs',
    iconClass: 'fa fa-users',
    isCollapsed: true,
    route: '/utilisateurs',
    subItems: []
  },
  {
    text: 'Cours',
    iconClass: 'fa fa-list-alt',
    isCollapsed: true,
    route: '/cours',
    subItems: []
  },
  {
    text: 'Analyse',
    iconClass: 'fa fa-line-chart',
    isCollapsed: true,
    route: '/analyse',
    subItems: []
  }
])

const menuItemsUser = ref([
  {
    text: 'Cours',
    iconClass: 'fa fa-list-alt',
    isCollapsed: true,
    route: '/Cours',
    subItems: []
  },
  {
    text: 'Calendrier',
    iconClass: 'fa fa-calendar',
    isCollapsed: true,
    route: '/utilisateurs',
    subItems: []
  }
])

const menuItems =
  userStore.siteRole == SiteRole.PUB
    ? menuItemsPub
    : userStore.siteRole == SiteRole.ADMIN
    ? menuItemsAdmin
    : menuItemsUser
const isExpanded = ref(false)
const expandMenu = () => (isExpanded.value = true)
const collapseMenu = () => (isExpanded.value = false)
</script>

<template>
  <div class="menu-container" @mouseover="expandMenu" @mouseleave="collapseMenu">
    <div class="menu" :class="{ expanded: isExpanded }">
      <router-link to="#">
        <div id="logo" v-text="isExpanded ? fullLogo : smallLogo"></div>
      </router-link>
      <ul>
        <li v-for="item in menuItems" :key="item.text">
          <router-link :to="item.subItems.length > 0 ? '' : item.route">
            <button @click="item.isCollapsed = !item.isCollapsed">
              <i :class="item.iconClass"></i>
              <span v-show="isExpanded">
                <div class="menuItem">
                  <div>{{ item.text }}</div>
                  <div v-show="item.subItems.length > 0">
                    <i v-show="!item.isCollapsed" class="fa fa-chevron-up" aria-hidden="true"></i
                    ><i v-show="item.isCollapsed" class="fa fa-chevron-down" aria-hidden="true"></i>
                  </div>
                </div>
              </span>
            </button>
          </router-link>
          <ul class="subMenuItems" v-show="!item.isCollapsed && isExpanded">
            <li v-for="(subItem, index) in item.subItems" :key="index">
              <router-link :to="item.route">
                {{ subItem.text }}
              </router-link>
            </li>
          </ul>
        </li>
        <router-link to="/UC"><a>D</a></router-link>
        <router-link to="/profile">
          <ProfileIcon class="icon-profile"></ProfileIcon>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.menu-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.menu {
  height: 100%;
  transition: width 0.3s ease;
  background: var(--daccent);
  color: var(--background);
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.menu.expanded {
  width: 100%;
}

.menuItem {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.subMenuItems {
  text-align: left;
  margin-left: 30px;
}

#logo {
  font-size: 2rem;
  font-weight: 700;
  transition: all 0.3s ease;
  padding: 1rem 1rem 0.4rem 1rem;
}

a {
  color: var(--laccent);
}

a:hover {
  color: var(--background);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 1rem;
  color: var(--background);
}

button:hover {
  background-color: var(--laccent);
}

i {
  font-size: 1.2rem;
  margin-right: 10px;
}

span {
  display: inline;
}
.icon-profile {
  position: absolute;
  bottom: 20px;
  left: 15px;
}

.choosed {
  background-color: var(--laccent);
}
</style>
