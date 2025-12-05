<script setup lang="ts">
import { ref } from 'vue'
import featuresData from '@/data/features.json'
import { Icon } from '@iconify/vue'

const features = ref(featuresData)
const IconifyIcon = Icon
</script>

<template>
  <section class="features center column">
    <div class="container center column">
      <h1>Nos Fonctionnalités</h1>
      <div class="featureCentent center column">
        <div class="feature center column" v-for="feature in features" :key="feature.title">
          <div class="icon center column">
            <iconify-icon :icon="feature.icon" class="feature-icon"></iconify-icon>
          </div>
          <h2>{{ feature.title }}</h2>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  background-color: var(--daccent);
  padding: 10px;
}

.features h1 {
  font-size: calc(0.5rem + 6vmin);
  line-height: 1.2;
  font-weight: 600;
}

.container {
  color: var(--background);
  text-align: center;
  gap: 50px !important;
  margin: 40px 20px;
}


.featureCentent,
.icon {
  gap: 25px;
}

.feature {
  gap: 10px !important;
}

h2 {
  font-size: calc(0.9rem + 1.8vmin);
  line-height: 1.2;
  font-weight: 400;
}

p {
  font-size: calc(0.9rem + 1.25vmin);
  line-height: 1.2;
  font-weight: 200;
  color: var(--secondary);
}

.icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
}

.feature-icon {
  width: 35px;
  height: 35px;
}

.feature:nth-child(1) .icon {
  background-color: #fef6ee;
  color: #f49c4e;
}

.feature:nth-child(2) .icon {
  background-color: #fef6ee;
  color: #5d99f4;
}

.feature:nth-child(3) .icon {
  background-color: #ecf8fe;
  color: #b84dc5;
}

.feature:nth-child(4) .icon {
  background-color: #ede8f7;
  color: #5526b3;
}

.feature:nth-child(5) .icon {
  background-color: #ffeff3;
  color: #f65d88;
}

.feature:nth-child(6) .icon {
  background-color: #e8fafa;
  color: #006934;
}

/* X-Small devices (portrait phones, less than 576px)*/
/* No media query for `xs` since this is the default in Bootstrap*/

/*Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {}

@media (min-width: 768px) {}

/* Large devices (desktops, 992px and up)*/
@media (min-width: 992px) {
  .features {
    height: 100dvh;
    max-width: 100%;
  }

  .featureCentent {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    align-items: start;
  }

  .feature {
    align-items: flex-start;
  }

  .container {
    text-align: left;
  }

  h2 {
    font-size: var(--fs-200);
  }

  p {
    font-size: var(--fs-100);
  }
}

/* // X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  .featureCentent {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {}

@media (max-height: 600px) {
  .features h1 {
    font-size: calc(1rem + 7vmin);
  }

  .features {
    height: 100%;
  }
}
</style>
