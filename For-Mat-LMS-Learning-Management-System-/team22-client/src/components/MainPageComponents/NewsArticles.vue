<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/Widgets/ButtonComp.vue'
import { useBNStore } from '@/stores/BNStore'
import { onMounted } from 'vue'

const articlesStore = useBNStore()

onMounted(() => {
  articlesStore.fetchArticles()
})

const formatDate = (dateStr: string, locale: string = 'fr-CA') => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(
    date
  )
}
</script>

<template>
  <main class="center column">
    <div class="container center column">
      <h1>Nos dernière articles</h1>
      <div class="articles-container center">
        <div v-for="article in articlesStore.get3Articles" :key="article.id" class="news-article">
          <img :src="article.imageUrl" alt="Article Image" class="article-image" />
          <h2 class="article-title">{{ article.title }}</h2>
          <p class="article-date">{{ formatDate(article.date) }}</p>
          <p class="article-text">{{ article.text.slice(0, 100) }}...</p>
          <router-link to="/">
            <Button
              btnText="Lire l'article"
              btnColor="white"
              btnBgColor="var(--laccent)"
              btnHoverColor="white"
              btnHoverBgColor="var(--daccent)"
            />
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  min-height: 80dvh;
  margin: 50px auto;
}

.container {
  gap: 84px;
}

h1 {
  font-size: calc(0.5rem + 6vmin);
  line-height: 1.2;
  font-weight: 600;
}

.articles-container {
  gap: 40px;
}

.news-article {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article-title {
  font-size: calc(0.8rem + 1.1vmin);
  line-height: 1.2;
  font-weight: 600;
}

.article-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  margin-bottom: 10px;
}

.article-date {
  font-size: calc(0.5rem + 0.8vmin);
  color: #888;
}

.article-text {
  font-size: calc(0.7rem + 0.8vmin);
  font-weight: 300;
  color: var(----daccent);
}

.btn {
  font-size: calc(0.8rem + 0.8vmin);
  font-weight: 400;
}

@media (max-width: 992px) {
  .articles-container {
    flex-direction: column;
  }

  .article-title {
    font-size: calc(1.1rem + 1.1vmin);
  }

  .article-date {
    font-size: calc(0.7rem + 1vmin);
  }

  .article-text,
  .btn {
    font-size: calc(1rem + 1vmin);
  }
}
</style>
