<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ArticlesData from '../data/blogs.json'
import HeaderComponent from '@/components/MainPageComponents/HeaderComponent.vue'
import FooterComponent from '@/components/MainPageComponents/FooterComponent.vue'
import { useBNStore } from '@/stores/BNStore'
import { formatDate } from '@/components/utils/Utils'

const articlesStore = useBNStore()

interface Article {
  id: number
  title: string
  imageUrl: string
  subtitle: string
  date: string
  text: string
}

const articles = ref<Article[]>([])

onMounted(() => {
  try {
    articles.value = ArticlesData
  } catch (error) {
    console.error('Error fetching articles:', error)
  }
  articlesStore.fetchArticles()
})

const getRandomArticles = computed(() => {
  const randomArticles = []
  const numRandomArticles = 3
  const articleCount = articles.value.length

  if (articleCount <= numRandomArticles) {
    return articles.value
  }

  const usedIndexes = new Set()
  while (randomArticles.length < numRandomArticles) {
    const randomIndex = Math.floor(Math.random() * articleCount)
    if (!usedIndexes.has(randomIndex)) {
      randomArticles.push(articles.value[randomIndex])
      usedIndexes.add(randomIndex)
    }
  }

  return randomArticles
})
</script>

<template>
  <main>
    <HeaderComponent></HeaderComponent>
    <div class="container">
      <div class="header">
        <div class="random-articles">
          <div
            v-for="randomArticle in getRandomArticles"
            :key="randomArticle.id"
            class="random-article"
          >
            <img :src="randomArticle.imageUrl" alt="Article Image" />
            <div class="title-overlay">
              <h3 class="randomTitle">{{ randomArticle.title }}</h3>
              <p class="text-overlay">{{ randomArticle.text }}</p>
              <button class="btn-overlay">Read more</button>
            </div>
          </div>
        </div>
      </div>
      <div class="articles-center">
        <h1>Nos articles</h1>
        <div class="articles-container">
          <div v-for="article in articlesStore.getArticles" :key="article.id" class="news-article">
            <img :src="article.imageUrl" alt="Article Image" />
            <div>
              <h3>{{ article.title }}</h3>
              <p class="date">{{ formatDate(article.date) }}</p>
              <p>{{ article.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent></FooterComponent>
  </main>
</template>

<style scoped>
.container {
  max-width: 100%;
}

h1 {
  font-size: 36px;
  margin-bottom: 25px;
}
.header {
  width: 100%;
  text-align: center;
  height: 70vh;
  position: relative;
}
.random-articles {
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
}

.random-article {
  width: calc(33.33%);
  height: 100%;
  position: relative;
  overflow: hidden;
}

.random-article img {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: cover;
  background-repeat: no-repeat;
  background-position: center center;
  transition: filter 0.3s; /* Add a transition for the background darkening effect */
}

.title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(31, 34, 59, 0.7);
  color: #fff;
  padding: 10px;
  text-align: center;
  transition:
    transform 0.3s,
    opacity 0.3s;
  transform: translateY(0);
  opacity: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.text-overlay {
  display: none;
  font-size: 12px;
  max-width: 50%;
  margin-top: 10px;
}
.btn-overlay {
  display: none;
  padding: 10px 20px;
  color: white;
  border: 1px solid white;
  background-color: transparent;
  font-size: 12px;
  text-transform: uppercase;
  text-decoration: none;
  margin-top: 20px;
  transition: 0.3s;
}
.btn-overlay:hover {
  background-color: white;
  color: var(--daccent);
  cursor: pointer;
}
.random-article:hover .btn-overlay {
  display: block;
}
.random-article:hover .text-overlay {
  display: block;
}
.random-article:hover img {
  filter: brightness(0.5); /* Darken the background on hover */
}

.random-article:hover .title-overlay {
  transform: translateY(-20%);
  opacity: 0.9;
}
.randomTitle {
  margin: 20px 0px;
  font-weight: 600;
  color: white;
}

.random-article p {
  font-size: 14px;
}
.articles-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
}
.articles-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  max-width: 1355px;
}

.news-article {
  width: calc(33% - 30px);
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.news-article:hover {
  transform: translateY(-5px);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
}

.news-article h3 {
  font-size: 16px;
  font-weight: 600;
}

.news-article img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.date {
  margin-bottom: 10px;
}
.news-article p {
  font-size: 12px;
  line-height: 1.5;
}
@media (max-width: 1200px) {
  .random-article:hover .text-overlay {
    display: none;
  }
}
@media (max-width: 992px) {
  .news-article {
    width: calc(50% - 30px);
  }
}
@media (max-width: 768px) {
  .random-article:nth-of-type(3) {
    display: none;
  }

  .random-article {
    width: calc(50%);
  }
  .news-article {
    display: flex;
    width: 90%;
  }

  .news-article img {
    width: 20%;
    height: 100%;
    margin-right: 20px;
  }
}
@media (max-width: 576px) {
  .random-article:not(:first-of-type) {
    display: none;
  }
  .random-article {
    width: 100%;
  }
  .news-article {
    display: flex;
    width: 90%;
    flex-direction: column;
  }
  .news-article img {
    width: 100%;
    height: 200px;
    margin-bottom: 20px;
  }
}
</style>
