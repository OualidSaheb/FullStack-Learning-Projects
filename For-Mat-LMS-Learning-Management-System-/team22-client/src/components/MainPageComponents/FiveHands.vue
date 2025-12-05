<script setup lang="ts"></script>

<template>
  <div class="parent">
    <div class="div1"></div>
    <div class="div2"></div>
    <div class="div3"></div>
    <div class="div4"></div>
    <div class="div5"></div>
  </div>
</template>

<style scoped>
.parent {
  display: grid;
  grid-template-columns: repeat(4, 1fr) 0.1fr repeat(2, 1fr);
  grid-template-rows: repeat(10, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  width: 80%;
  height: 80dvh;
}

.div1,
.div2,
.div3,
.div4,
.div5 {
  background-image: url('/src/assets/images/4hands.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.div1 {
  grid-area: 1 / 3 / 5 / 5;
}

.div2 {
  grid-area: 2 / 5 / 5 / 8;
}

.div3 {
  grid-area: 5 / 6 / 10 / 8;
}

.div4 {
  grid-area: 5 / 1 / 8 / 6;
}

.div5 {
  grid-area: 8 / 3 / 11 / 6;
}
</style>
