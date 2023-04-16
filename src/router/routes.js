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
        component: () => import('pages/ReportsPage.vue')
      },
      {
        path: 'ecoislands',
        name: 'ecoislands',
        component: () => import('pages/EcoIslandPage.vue')
      },
      {
        path: 'report/:reportId',
        name: 'report',
        component: () => import('pages/SingleReportPage.vue')
      },
      {
        path: 'ecoisland/:ecoislandId',
        name: 'ecoisland',
        component: () => import('pages/SingleEcoIslandPage.vue')
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
