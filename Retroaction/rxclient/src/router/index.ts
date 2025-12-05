import { createRouter, createWebHistory } from 'vue-router';

import Main from '@/layouts/Main.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Main,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/grids',
          name: 'grids',
          component: () => import('../features/grids/GridsPage.vue'),
          meta: { requiresAuth: true },
          props: true,
          children: [
            {
              path: ':gridId',
              name: 'grid',
              component: () => import('@/features/grids/components/GridView.vue'),
              meta: { requiresAuth: true },
              props: true,
              children: [
                {
                  path: 'sections/:sectionId',
                  name: 'section',
                  component: () => import('@/features/grids/components/SectionView.vue'),
                  meta: { requiresAuth: true },
                  props: true,
                  children: [
                    {
                      path: 'criteria/:criterionId',
                      name: 'criterion',
                      component: () => import('@/features/grids/components/CriterionView.vue'),
                      meta: { requiresAuth: true },
                      props: true,
                      children: [
                        {
                          path: 'levels/:levelId',
                          name: 'level',
                          component: () => import('@/features/grids/components/LevelView.vue'),
                          meta: { requiresAuth: true },
                          props: true
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          path: '/evaluations',
          name: 'evaluations',
          component: () => import('@/features/evaluations/EvaluationsPage.vue'),
          meta: { requiresAuth: true },
          props: true,
          children: [
            {
              path: ':evaluationId',
              name: 'evaluation',
              component: () => import('@/features/evaluations/components/EvaluationView.vue'),
              meta: { requiresAuth: true },
              props: true,
              children: [
                {
                  path: 'corrections/:correctionId',
                  name: 'correction',
                  component: () => import('@/features/evaluations/components/CorrectionView.vue'),
                  props: true,
                  meta: { requiresAuth: true }
                }
              ]
            }
          ]
        },
        {
          path: '/corrections',
          name: 'corrections',
          component: () => import('@/features/corrections/CorrectionsPage.vue'),
          meta: { requiresAuth: true },
          props: true,
          children: [
            {
              path: ':evaluationId',
              name: 'EvaluationCorrectionView',
              component: () =>
                import('@/features/corrections/components/EvaluationCorrectionView.vue'),
              meta: { requiresAuth: true },
              props: true,
              children: []
            }
          ]
        },
        {
          path: '/admin',
          name: 'admin',
          component: () => import('@/features/Admin/AdminePage.vue'),
          meta: { requiresAuth: true },
          props: true,
          children: [
            {
              path: 'departments/:departmentId',
              name: 'DepartmentAdminView',
              component: () => import('@/features/Admin/components/DepartmentAdminView.vue'),
              meta: { requiresAuth: true },
              props: true
            },
            {
              path: 'sessions/:sessionId',
              name: 'SessionAdminView',
              component: () => import('@/features/Admin/components/SessionAdminView.vue'),
              meta: { requiresAuth: true },
              props: true
            },
            {
              path: 'courses/:courseId',
              name: 'CourseAdminView',
              component: () => import('@/features/Admin/components/CourseAdminView.vue'),
              meta: { requiresAuth: true },
              props: true
            }
          ]
        },

        {
          path: '/signin',
          name: 'signin',
          component: () => import('@/features/auth/SignInPage.vue'),
          children: [
            {
              path: '',
              name: 'signin-view',
              component: () => import('@/features/auth/components/SignInView.vue')
            },
            {
              path: 'code',
              name: 'code',
              component: () => import('@/features/auth/components/CodeView.vue')
            },
            {
              path: 'password',
              name: 'password',
              component: () => import('@/features/auth/components/PasswordView.vue')
            }
          ]
        }
      ]
    }
  ]
});

export default router;
