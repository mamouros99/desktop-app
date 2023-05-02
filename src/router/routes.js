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
        component: () => import('pages/ReportsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'ecoislands',
        name: 'ecoislands',
        component: () => import('pages/EcoIslandPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'report/:reportId',
        name: 'report',
        component: () => import('pages/SingleReportPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'ecoisland/:ecoislandId',
        name: 'ecoisland',
        component: () => import('pages/SingleEcoIslandPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue')
      },

      {
        path: 'autherror',
        name: 'autherror',
        component: () => import('pages/AuthError.vue')
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('pages/UserAdminPage.vue'),
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
