import { route } from 'quasar/wrappers'
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import routes from './routes'
import { useUserStore } from 'stores/UserStore'
import { LocalStorage } from 'quasar'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
let router = null
export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  router = createRouter({
    scrollBehavior: () => ({
      left: 0,
      top: 0
    }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  router.beforeEach((to, from, next) => {
    // eslint-disable-next-line no-unused-vars
    const userstore = useUserStore()

    if ((to.meta.requiresAdmin && !userstore.hasAdminPermissions()) || (to.meta.requiresEditor && !userstore.hasEditPermissions())) {
      next('/')
    } else if (to.name === 'user' && (to.params.userid !== userstore.getUsername() && !userstore.hasAdminPermissions())) {
      next('/')
    } else if (to.name === 'autherror') {
      LocalStorage.set('beforePath', from.path)
      next()
    } else {
      next()
    }
  })

  return router
})

export { router }
