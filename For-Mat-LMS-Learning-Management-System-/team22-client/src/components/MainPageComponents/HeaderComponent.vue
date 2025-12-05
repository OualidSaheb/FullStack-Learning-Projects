<script setup lang="ts">
import Button from '@/components/Widgets/ButtonComp.vue'
import { SiteRole, useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
</script>

<template>
  <header class="">
    <div class="container center">
      <div class="content center">
        <router-link to="/">
          <div id="logo">For-Mat</div>
        </router-link>

        <div id="menu">
          <input id="menu__toggle" type="checkbox" />
          <label class="menu__btn" for="menu__toggle">
            <span></span>
          </label>
          <div id="menuText" class="center">
            <router-link to="/UC"><a>D</a></router-link>
            <router-link to="/cours"><a>Cours</a></router-link>
            <router-link to="/contact"><a>Contactez-nous</a></router-link>
            <router-link to="/blog"><a>Blog</a></router-link>
            <router-link v-show="userStore.siteRole == SiteRole.GUEST" to="/login"
              ><a>Se connecter</a></router-link
            >
            <router-link v-show="userStore.siteRole == SiteRole.GUEST" to="/signup">
              <Button
                btnText="S'inscrire"
                btnColor="var(--laccent)"
                btnBgColor="var(--textlight)"
                btnHoverColor="var(--textlight)"
                btnHoverBgColor="var(--laccent)"
              />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: var(--daccent);
  padding: 15px 0;
}

.content {
  width: 100%;
  justify-content: space-between;
  margin: 0 auto;
}

a {
  color: var(--background);
}

#logo {
  font-size: 3rem;
  font-weight: 700;
}

#menu,
#menuText {
  display: flex;
  align-items: center;
  gap: 25px;
}

#menuText a,
.btn {
  font-size: 1.2rem;
  font-weight: 400;
}

a:hover {
  color: var(--laccent);
  cursor: pointer;
  transition: ease 0.3s;
  transform: scale(1.1);
}

#menuHamburger {
  display: none;
}

#menu__toggle {
  opacity: 0;
}

@media (max-width: 767px) {
  #menu,
  .menu__btn > span {
    z-index: 3;
  }

  #menu__toggle:checked + .menu__btn > span {
    transform: rotate(45deg);
  }

  #menu__toggle:checked + .menu__btn > span::before {
    top: 0;
    transform: rotate(0deg);
  }

  #menu__toggle:checked + .menu__btn > span::after {
    top: 0;
    transform: rotate(90deg);
  }

  #menu__toggle:checked ~ #menuText {
    right: 0 !important;
  }

  .menu__btn {
    display: block;
    position: relative;
    top: 20px;
    width: 46px;
    height: 46px;
    cursor: pointer;
    z-index: 3;
  }

  .menu__btn > span,
  .menu__btn > span::before,
  .menu__btn > span::after {
    display: block;
    position: absolute;
    width: 100%;
    height: 5px;
    background-color: var(--background);
    transition-duration: 0.25s;
  }

  .menu__btn > span::before {
    content: '';
    top: -12px;
  }

  .menu__btn > span::after {
    content: '';
    top: 12px;
  }

  #menuText {
    flex-direction: column;
    gap: 15px;
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100%;
    background-color: var(--laccent);
    transition-duration: 0.25s;
  }

  #menuText a,
  .btn {
    font-size: 2.2rem;
    font-weight: 400;
  }

  a:hover {
    color: var(--daccent);
    cursor: pointer;
    transition: ease 0.3s;
    transform: scale(1.2);
  }
}
</style>
