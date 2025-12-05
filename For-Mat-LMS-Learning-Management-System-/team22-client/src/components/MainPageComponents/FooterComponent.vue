<template>
  <div id="footer">
    <div class="container center column">
      <div id="footerLinks">
        <div class="segment">
          <div class="title">
            À propos
            <div class="iconOpen" @click="companyShow = !companyShow">
              <div v-if="companyShow">
                <i class="fa fa-chevron-up" aria-hidden="true"></i>
              </div>
              <div v-else><i class="fa fa-chevron-down" aria-hidden="true"></i></div>
            </div>
          </div>
          <div class="items" v-show="companyShow">
            <div v-for="(link, index) in companyLinks" :key="index" class="sub-title">
              <a :href="link.link">{{ link.title }}</a>
            </div>
          </div>
        </div>
        <div class="segment">
          <div class="title">
            Service à la clientèle
            <div class="iconOpen" @click="supportShow = !supportShow">
              <div v-if="supportShow">
                <i class="fa fa-chevron-up" aria-hidden="true"></i>
              </div>
              <div v-else><i class="fa fa-chevron-down" aria-hidden="true"></i></div>
            </div>
          </div>
          <div class="items" v-show="supportShow">
            <div v-for="(link, index) in supportLinks" :key="index" class="sub-title">
              <a :href="link.link">{{ link.title }}</a>
            </div>
          </div>
        </div>
        <div class="segment">
          <div class="title">
            Conditions d'utilisation
            <div class="iconOpen" @click="legalShow = !legalShow">
              <div v-if="legalShow">
                <i class="fa fa-chevron-up" aria-hidden="true"></i>
              </div>
              <div v-else><i class="fa fa-chevron-down" aria-hidden="true"></i></div>
            </div>
          </div>
          <div class="items" v-show="legalShow">
            <div v-for="(link, index) in legalLinks" :key="index" class="sub-title">
              <a :href="link.link">{{ link.title }}</a>
            </div>
          </div>
        </div>
        <div class="segment">
          <div class="title">
            App mobile
            <div class="iconOpen" @click="appShow = !appShow">
              <div v-if="appShow">
                <i class="fa fa-chevron-up" aria-hidden="true"></i>
              </div>
              <div v-else><i class="fa fa-chevron-down" aria-hidden="true"></i></div>
            </div>
          </div>
          <div class="items" v-show="appShow">
            <div v-for="(link, index) in appLinks" :key="index" class="sub-title">
              <a :href="link.link"><img :src="link.icon" alt="" class="iconApps" /></a>
            </div>
          </div>
        </div>
      </div>
      <div id="copyRight">
        <div>© 2023 Tous droits réservés</div>
        <div>
          <i class="fa fa-instagram" aria-hidden="true"></i><i class="fa fa-reddit" aria-hidden="true"></i><i
            class="fa fa-facebook-square" aria-hidden="true"></i><i class="fa fa-youtube-play" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
}

#footer {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  background-color: var(--daccent);
  color: var(--background);
  align-items: center;
}

#footerLinks {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 50px 20px 20px 20px;
  border-bottom: 1px solid grey;
  align-items: flex-start;
  width: 100%;
}

.segment {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 10px;
}

.sub-title a {
  display: block;
  font-size: 0.8rem;
  font-weight: 300;
  margin: 15px 0px;
}

.sub-title a:hover {
  color: var(--laccent);
  cursor: pointer;
  transition: ease 0.3s;
  transform: scale(1.05);
}

#copyRight {
  width: 100%;
  display: flex;
  justify-content: space-between;
  text-align: center;
  color: var(--background);
  font-size: 0.8rem;
  font-weight: 300;
  padding: 20px 20px 50px 20px;
}

#copyRight>div:nth-child(2) {
  display: flex;
  gap: 15px;
}

a {
  color: var(--background);
}

p {
  font-size: calc(0.7rem + 0.8vmin);
  font-weight: 300;
}

img {
  width: 100px;
  margin-top: 5px;
}

i {
  cursor: pointer;
}

.iconOpen {
  display: none;
}

@media (max-width: 600px) {
  #copyRight>div:nth-child(2) {
    display: none;
  }

  #footerLinks {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .title {
    display: flex;
    justify-content: space-between;
  }

  .iconOpen {
    display: block;
  }

  .items {
    padding-left: 10px;
  }
}
</style>

<script setup lang="ts">
// import 'font-awesome/css/font-awesome.min.css'
import { ref, onMounted } from 'vue'
interface FooterLinks {
  title?: string
  link: string
  icon?: string
}

const companyLinks: FooterLinks[] = [
  {
    title: 'À propos',
    link: '/'
  },
  {
    title: 'Blog',
    link: '/'
  },
  {
    title: 'Carrières',
    link: '/'
  },
  {
    title: 'Nous joindre',
    link: '/'
  }
]

const supportLinks: FooterLinks[] = [
  {
    title: 'FAQ',
    link: '/'
  },
  {
    title: 'Aide',
    link: '/'
  },
  {
    title: 'Communauté',
    link: '/'
  }
]

const legalLinks: FooterLinks[] = [
  {
    title: 'Règlements des promotions',
    link: '/'
  },
  {
    title: 'Conditions & confidentialité',
    link: '/'
  },
  {
    title: "Termes & conditions",
    link: '/'
  }
]

const appLinks: FooterLinks[] = [
  {
    title: 'Google',
    link: '/',
    icon: '/src/components/icons/Gplayfr.svg'
  },
  {
    title: 'Apple',
    link: '/',
    icon: '/src/components/icons/Appstorefr.svg'
  }
]

const companyShow = ref(true)
const supportShow = ref(true)
const legalShow = ref(true)
const appShow = ref(true)

onMounted(() => {
  window.onresize = () => {
    if (document.documentElement.clientWidth <= 600) {
      companyShow.value = false
      supportShow.value = false
      legalShow.value = false
      appShow.value = false
    } else {
      companyShow.value = true
      supportShow.value = true
      legalShow.value = true
      appShow.value = true
    }
  }
})
</script>
