import { defineStore } from 'pinia'
import type { ArticleInterface } from '@/interfaces/BNS.interface'
import articles from '@/data/blogs.json'

export interface ArticlesState {
  articles: ArticleInterface[]
  nextId: number
}

export const useBNStore = defineStore('articles', {
  state: (): ArticlesState => ({
    articles: [],
    nextId: 0
  }),
  getters: {
    getArticles(state: ArticlesState): ArticleInterface[] {
      return state.articles.sort((x, y) => x.id - y.id)
    },
    get3Articles(state: ArticlesState): ArticleInterface[] {
      return state.articles.slice(articles.length - 3, articles.length)
    }
  },
  actions: {
    async fetchArticles() {
      setTimeout(async () => {
        this.articles = articles
        this.nextId = Math.max(...this.articles.map((a) => a.id)) + 1
      }, 1000)
    }
  }
})
