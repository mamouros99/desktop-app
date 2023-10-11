import { defineStore } from 'pinia'
import { ref } from 'vue'
import { LocalStorage } from 'quasar'

export const useTablesStore = defineStore('TablesStore', () => {
  const ecoislandRows = ref(LocalStorage.getItem('ecoislandRows'))
  const questionRows = ref(LocalStorage.getItem('questionRows'))
  const reportsRows = ref(LocalStorage.getItem('reportsRows'))
  const usersRows = ref(LocalStorage.getItem('usersRows'))

  const storeTableRows = (table, value) => {
    LocalStorage.set(table, value)
  }

  return {
    storeTableRows,
    ecoislandRows,
    reportsRows,
    usersRows,
    questionRows
  }
})
