import { defineStore } from 'pinia'
import { ref } from 'vue'
import { LocalStorage } from 'quasar'

export const useLanguageStore = defineStore('LocationStore', () => {
  const appLanguage = ref(LocalStorage.getItem('appLanguage')) || 'pt-PT'

  const storeLanguage = (language) => {
    LocalStorage.set('appLanguage', language)
  }

  return {
    storeLanguage,
    appLanguage
  }
})
