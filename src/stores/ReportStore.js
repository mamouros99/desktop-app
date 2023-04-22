import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/axios'

export const useReportStore = defineStore('report', () => {
  const reports = ref([])

  const fetchReports = async () => {
    console.log('fetching')
    await api.get('http://localhost:3001/report/all')
      .then((response) => {
        reports.value = response.data
      })
  }

  const getReports = () => {
    return reports.value
  }

  const deleteById = async (id) => {
    await api.delete('http://localhost:3001/report/delete/' + id)
  }

  const getReportById = async (id) => {
    const result = {
      data: reports
        .value.find(e => e.id === +id)
    }
    if (result.data !== undefined) {
      return result
    }
    return await api.get('http://localhost:3001/report/' + id)
  }

  return {
    fetchReports,
    getReports,
    getReportById,
    deleteById
  }
})
