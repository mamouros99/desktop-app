import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/axios'
import useNotify from 'src/composables/UseNotify'
import useFunctions from 'src/composables/UseFunctions'

export const useReportStore = defineStore('report', () => {
  const { notifyError } = useNotify()
  const reports = ref([])

  const { isStringInteger } = useFunctions()

  const fetchReports = () => {
    console.log('Fetching reports...')
    api.get('http://localhost:3000/reports')
      .then((response) => {
        reports.value = response.data
        console.log('Fetched reports')
      })
      .catch((error) => {
        notifyError((error.code === 'ERR_NETWORK') ? 'Loading Failed' : 'Something Went Wrong')
        console.log('Failed fetching reports')
      })
  }

  const getReports = () => {
    return reports.value
  }

  const getReportById = (id) => {
    if (!isStringInteger(id)) {
      return
    }
    return reports.value.find(e => {
      return e.id === +id
    })
  }

  return {
    fetchReports,
    getReports,
    getReportById
  }
})
