import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ContactView from '@/views/ContactView.vue'
import SignupView from '@/views/SignupView.vue'
import BlogsView from '@/views/BlogsPage.vue'
import NotfoundView from '@/views/NotfoundView.vue'
import CourseList from '@/components/CourseList.vue'
import CoursePlayer from '@/components/CoursePlayer.vue'
import CourseCreator from '@/components/CourseCreator.vue'
import ProfileComponent from '@/components/UserProfilePages/ProfileComponent.vue'
import GererUsersPage from '@/components/PublisherProfilePages/GererUsersPage.vue'
import GererFormation from '@/components/PublisherProfilePages/GererFormation.vue'
import UserCreator from '@/components/utils/UserCreator.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: ContactView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    },

    {
      path: '/login',
      name: 'login',
      component: ContactView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogsView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileComponent
    },
    {
      path: '/utilisateurs',
      name: 'utilisateurs',
      component: GererUsersPage
    },
    {
      path: '/organisation',
      name: 'organisation',
      component: GererFormation
    },
    {
      path: '/cours',
      name: 'CourseList',
      component: CourseList
    },
    {
      path: '/cours/:id',
      name: 'CoursePlayer',
      component: CoursePlayer
    },
    // {
    //   path: '/cours/edit/:id',
    //   name: 'CourseEdit',
    //   component: CourseEdit
    // },
    {
      path: '/coursecreator/:courseId?',
      name: 'coursecreator',
      component: CourseCreator
    },
    {
      path: '/cours/:id/section/:sectionId/chapter/:chapterId',
      name: 'CourseContent',
      component: CoursePlayer
    },
    {
      path: '/UC',
      name: 'UC',
      component: UserCreator
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotfoundView
    }
  ]
})

export default router
