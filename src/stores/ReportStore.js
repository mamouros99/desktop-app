import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/axios'
import useNotify from 'src/composables/UseNotify'

export const useReportStore = defineStore('report', () => {
  const { notifyError } = useNotify()
  const reports = ref([])

  const fetchReports = () => {
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

  return {
    fetchReports,
    getReports
  }
})
