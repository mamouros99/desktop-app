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
        meta: { requiresEditor: true }
      },
      {
        path: 'ecoislands',
        name: 'ecoislands',
        component: () => import('pages/EcoIsland/EcoIslandPage.vue'),
        meta: { requiresEditor: true }
      },
      {
        path: 'report/:reportId',
        name: 'report',
        component: () => import('pages/Report/SingleReportPage.vue'),
        meta: { requiresEditor: true }
      },
      {
        path: 'ecoisland/:ecoislandId',
        name: 'ecoisland',
        component: () => import('pages/EcoIsland/SingleEcoIslandPage.vue'),
        meta: { requiresEditor: true }
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue')
      },
      {
        path: 'questions',
        name: 'questions',
        component: () => import('pages/Question/QuestionPage.vue'),
        meta: {
          requiresEditor: true
        }
      },
      {
        path: 'question/:questionId',
        name: 'question',
        component: () => import('pages/Question/QuestionChatPage.vue'),
        meta: {
          requiresEditor: true
        }
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
          requiresAdmin: true
        }
      },
      {
        path: 'user/:userid',
        name: 'user',
        component: () => import('pages/User/SingleUserPage.vue'),
        meta: {
          requiresEditor: true
        }
      },
      {
        path: 'image',
        name: 'image',
        component: () => import('pages/EcoIsland/ImagePage.vue'),
        meta: {
          requiresEditor: true
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
