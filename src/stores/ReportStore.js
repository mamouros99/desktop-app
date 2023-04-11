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
    api.get('http://localhost:3001/reports')
      .then((response) => {
        reports.value = response.data
      })
      .catch((error) => {
        notifyError((error.code === 'ERR_NETWORK') ? 'Loading Failed' : 'Something Went Wrong')
      })
  }

  const getReports = () => {
    return reports.value
  }

  const getReportById = (id) => {
    if (!isStringInteger(id)) {
      return
    }
    const result = reports.value.find(e => {
      return e.id === +id
    })
    console.log('result', result, reports.value)
    return result
  }

  return {
    fetchReports,
    getReports,
    getReportById
  }
})
