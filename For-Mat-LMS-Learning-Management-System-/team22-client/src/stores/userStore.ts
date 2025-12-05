// stores/userStore.ts
import { defineStore } from 'pinia'

export enum SiteRole {
  ADMIN = 'Admin',
  PUB = 'Publisher',
  USER = 'User',
  GUEST = 'Guest'
}

export interface User {
  username: string
  password: string
  id: string
  email: string
  image: string | File
  siteRole: SiteRole
  role: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    password: '',
    id: '',
    email: '',
    image: '',
    siteRole: SiteRole.GUEST,
    role: ''
  }),
  actions: {
    setTemporaryUser(user: User) {
      Object.assign(this, user)
    }
  }
})
