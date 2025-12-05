<script setup lang="ts">
import Button from '@/components/Widgets/ButtonComp.vue'
</script>

<template>
  <section class="cover center column">
    <div class="container center column">
      <div class="content center column">
        <h1>For-Mat vous permet de renforcer les compétences de vos équipes</h1>
        <p>
          nous élevons votre potentiel à des sommets inégalés. Boostez les compétences de vos
          équipes, forgez une maîtrise technologique sans précédent. Avec For-Mat, transformez
          chaque objectif en une étape de réussite incontournable.
        </p>

        <Button
          btnText="Découvrez nos services"
          btnColor="var(--background)"
          btnBgColor="var(--laccent)"
          btnHoverColor="var(--laccent)"
          btnHoverBgColor="var(--background)"
        ></Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cover {
  position: relative;
  background: url(../../assets/images/bg.jpg) no-repeat center center;
  background-size: cover;
  height: 100dvh;
}

.cover::before {
  content: '';
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 0.7;
  background-color: var(--daccent);
}

html,
body {
  overflow: hidden;
  height: 100%;
}

.content {
  color: var(--background);
  gap: 30px;
  text-align: center;
  z-index: 1;
  width: 90%;
}

h1 {
  font-size: calc(0.5rem + 6vmin);
  line-height: calc(0.8rem + 6vmin);
  font-weight: 600;
}

p {
  font-size: calc(0.8rem + 1.25vmin);
  line-height: 1.2;
  font-weight: 200;
}

/* X-Small devices (portrait phones, less than 576px) */
/* No media query for `xs` since this is the default in Bootstrap*/

/*Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
}

/* Medium devices (tablets, 768px and up)*/
@media (min-width: 768px) {
  .content {
    width: 100%;
  }
}

/* Large devices (desktops, 992px and up)*/
@media (min-width: 992px) {
}

/* // X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
  .content {
    width: 70%;
  }
}
</style>
