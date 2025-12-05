<script setup lang="ts"></script>

<template>
  <div></div>
</template>

<style scoped></style>
<!-- <script setup lang="ts">
import { ref } from 'vue'
import { useBNStore } from '@/stores/BNStore'
import type { ArticleIface } from '@/interfaces/BNS.interface'
const userStore = useBNStore()

const article = ref<ArticleIface>({
  image: null,
  date: new Date(),
  title: '',
  content: ''
})

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    article.value.image = input.files[0]
  }
}

const submitArticle = () => {
  userStore.addArticle(article.value)
  //fonction pour envoyer au backend
  alert('Article added successfully!')
}
</script>

<template>
  <div>
    <h2>Creer nouvel article</h2>
    <form @submit.prevent="submitArticle">
      <div>
        <label for="image">Image Upload:</label>
        <input type="file" id="image" @change="handleImageUpload" />
      </div>
      <div>
        <label for="title">Titre:</label>
        <input type="text" id="title" v-model="article.title" />
      </div>
      <div>
        <label for="content">Contenu</label>
        <textarea id="content" v-model="article.content"></textarea>
      </div>
      <button type="submit">Envoyer</button>
    </form>
  </div>
</template> -->
