import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { useLanguageStore } from 'stores/LanguageStore'

export default boot(({ app }) => {
  const languageStore = useLanguageStore()

  const i18n = createI18n({
    locale: languageStore.appLanguage,
    globalInjection: true,
    legacy: false,
    messages
  })

  // Set i18n instance on app
  app.use(i18n)
})
