import { defineStore } from 'pinia'
import { ref } from 'vue'
import { LocalStorage } from 'quasar'

export const useTablesStore = defineStore('TablesStore', () => {
  const ecoislandPagination = ref(LocalStorage.getItem('ecoislandPagination'))
  const questionPagination = ref(LocalStorage.getItem('questionPagination'))
  const reportsPagination = ref(LocalStorage.getItem('reportsPagination'))
  const usersPagination = ref(LocalStorage.getItem('usersPagination'))

  const storeTablePagination = (table, value) => {
    LocalStorage.set(table, value)
  }

  return {
    storeTablePagination,
    ecoislandPagination,
    reportsPagination,
    usersPagination,
    questionPagination
  }
})
