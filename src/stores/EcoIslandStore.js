import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/axios'
import useNotify from 'src/composables/UseNotify'

export const useEcoIslandStore = defineStore('island', () => {
  const { notifyError } = useNotify()
  const ecoIslands = ref([])

  const fetchEcoIslands = () => {
    api.get('http://localhost:3000/islands')
      .then((response) => {
        ecoIslands.value = response.data
      })
      .catch((error) => {
        notifyError((error.code === 'ERR_NETWORK') ? 'Loading Failed' : 'Something Went Wrong')
      })
  }

  const getEcoIslands = () => {
    return ecoIslands.value
  }

  const getEcoIslandsById = (id) => {
    return ecoIslands.value.find(e => e.id === id)
  }

  return {
    fetchEcoIslands,
    getEcoIslandsById,
    getEcoIslands
  }
})
