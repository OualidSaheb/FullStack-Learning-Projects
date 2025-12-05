<script setup lang="ts"></script>
<template>
  <main>
    <div id="container">
      <div id="content">
        <div id="content-left">
          <h1>404</h1>
          <h3>Page Introuvable</h3>
          <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  height: auto;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#container {
  margin: 50px 0px;
  width: 80%;
  max-width: 1200px;
}

#content {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

h1 {
  font-size: 10rem;
  color: var(--laccent);
  font-weight: bold;
}

h3 {
  font-size: 3rem;
  color: var(--laccent);
  margin-bottom: 10px;
  font-weight: bold;
}

p {
  font-size: 1.5rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

@media (max-width: 1100px) {
  h1 {
    font-size: 16rem;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 3.75rem;
    color: var(--laccent);
    margin-bottom: 10px;
    font-weight: bold;
  }

  p {
    font-size: 1.8rem;
    line-height: 1.5;
    margin-bottom: 20px;
  }
}
</style>
