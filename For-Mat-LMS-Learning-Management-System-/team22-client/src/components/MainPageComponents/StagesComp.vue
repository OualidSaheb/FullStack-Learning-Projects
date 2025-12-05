<script setup lang="ts">
import { ref } from 'vue'
import FiveHands from '@/components/MainPageComponents/FiveHands.vue'

let activeSlide = ref<number>(1)

function changeSlide(slidenumber: number) {
  activeSlide.value = slidenumber
}
</script>

<template>
  <main class="center">
    <div class="container">
      <div id="content" class="center">
        <div id="content-left">
          <div v-if="activeSlide === 1" :class="{ activeAnimation: activeSlide === 1 }">
            <h1>01</h1>
            <h3>Transformez vos employés</h3>
            <p>
              Au commencement, focalisez-vous sur l'éducation de vos employés. Offrez-leur des
              formations percutantes qui non seulement élargissent leur base de connaissances mais
              les rendent également des défenseurs fervents de votre marque.
            </p>
          </div>

          <div v-if="activeSlide === 2" :class="{ activeAnimation: activeSlide === 2 }">
            <h1>02</h1>
            <h3>Édifiez une Base Solide pour une Croissance Explosive</h3>
            <p>
              Ce stage met l'accent sur la construction d'une base solide capable de soutenir une
              croissance explosive, laissant entrevoir l'innovation et la scalabilité dynamique.
            </p>
          </div>
          <div v-if="activeSlide === 3" :class="{ activeAnimation: activeSlide === 3 }">
            <h1>03</h1>
            <h3>Personnalisez l'Apprentissage</h3>
            <p>
              Ici, les parcours d'apprentissage uniques sont mis en avant, promettant une expérience
              d'apprentissage captivante et efficace qui garantit des résultats exceptionnels.
            </p>
          </div>
          <div v-if="activeSlide === 4" :class="{ activeAnimation: activeSlide === 4 }">
            <h1>04</h1>
            <h3>Élargissez l'Impact Commercial</h3>
            <p>
              Cette partie se concentre sur une transformation profonde et l'établissement de
              l'entreprise en tant que leader incontesté dans l'industrie, présentant une vision de
              leadership et un impact significatif sur le marché.
            </p>
          </div>
          <div v-if="activeSlide === 5" :class="{ activeAnimation: activeSlide === 5 }">
            <h1>05</h1>
            <h3>Élevez l'organisation</h3>
            <p>
              Cette dernière étape parle de transcender les normes établies et de positionner
              l'entreprise comme une étoile montante dans l'industrie, promettant une redéfinition
              des normes de l'industrie.
            </p>
          </div>
          <div id="buttons">
            <button class="slider-button" @click="changeSlide(1)" :class="{ active: activeSlide === 1 }"></button>
            <button class="slider-button" @click="changeSlide(2)" :class="{ active: activeSlide === 2 }"></button>
            <button class="slider-button" @click="changeSlide(3)" :class="{ active: activeSlide === 3 }"></button>
            <button class="slider-button" @click="changeSlide(4)" :class="{ active: activeSlide === 4 }"></button>
            <button class="slider-button" @click="changeSlide(5)" :class="{ active: activeSlide === 5 }"></button>
          </div>
        </div>
        <FiveHands id="content-right" />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  margin: 20px auto;
  height: 100dvh;
}


#content {
  gap: 30px
}

h1 {
  font-size: 4rem;
  color: var(--laccent);
  font-weight: 700;
  margin: 10px 0;
}

h3 {
  font-size: 1.8rem;
  color: var(--laccent);
  margin-bottom: 15px;
  font-weight: 700;
}

p {
  font-size: 1.5rem;
  line-height: 1.5;
  margin-bottom: 25px;
}

#content-left {
  width: 80%;
  overflow: auto;
}

.slider-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 15px;
  border: 4px solid var(--laccent);
  background-color: white;

}

.active {
  background-color: var(--laccent);
}

.activeAnimation {
  opacity: 0;
  transform: translateY(-20px);
  animation: bounce 0.8s forwards;
}

#buttons {
  margin-bottom: 50px;
}

@keyframes bounce {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  60% {
    opacity: 0.6;
    transform: translateY(-10px);
  }

  80% {
    opacity: 0.8;

    transform: translateY(5px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1200px) {
  h1 {
    font-size: 16rem;
    line-height: 1;
    margin: 10px 0;
  }

  h3 {
    font-size: 3.75rem;
  }

  p {
    font-size: 1.8rem;
  }

  #content-right {
    display: none;
  }
}

@media (max-width: 576px) {
  main {
    height: auto;
  }

  #content-left {
    width: 100%;
  }

  h1 {
    line-height: 1.2;
  }

  h3 {
    line-height: 1.2;
  }

  p {
    font-size: 1.5rem;
  }




}
</style>
