import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/axios'

export const useReportStore = defineStore('report', () => {
  const reports = ref([])

  const fetchReports = async () => {
    await api.get('/report/all')
      .then((response) => {
        reports.value = response.data
      })
  }

  const getReports = () => {
    return reports.value
  }

  const deleteById = async (id) => {
    await api.delete('/report/delete/' + id)
  }

  const getReportById = async (id) => {
    return await api.get('/report/' + id)
  }

  const downloadReports = async () => {
    return await api.get('/report/export', {
      responseType: 'blob'
    })
  }

  const toggleArchiveReport = async (id) => {
    await api.put('/report/archive/' + id)
  }

  return {
    fetchReports,
    getReports,
    getReportById,
    deleteById,
    downloadReports,

    toggleArchiveReport
  }
})
