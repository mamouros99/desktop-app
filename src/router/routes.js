const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/MainPage.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('pages/Report/ReportsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'ecoislands',
        name: 'ecoislands',
        component: () => import('pages/EcoIsland/EcoIslandPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'report/:reportId',
        name: 'report',
        component: () => import('pages/Report/SingleReportPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'ecoisland/:ecoislandId',
        name: 'ecoisland',
        component: () => import('pages/EcoIsland/SingleEcoIslandPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue')
      },
      {
        path: 'questions',
        name: 'questions',
        component: () => import('pages/QuestionPage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'question/:questionId',
        name: 'question',
        component: () => import('pages/QuestionChatPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'autherror',
        name: 'autherror',
        component: () => import('pages/Error/AuthError.vue')
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('pages/User/UserAdminPage.vue'),
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'user/:userid',
        name: 'user',
        component: () => import('pages/User/SingleUserPage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'image',
        name: 'image',
        component: () => import('pages/ImagePage.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error/ErrorNotFound.vue')
  }
]

export default routes
