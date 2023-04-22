import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/axios'

export const useEcoIslandStore = defineStore('island', () => {
  const ecoIslands = ref([])

  async function fetchEcoIslands () {
    await api.get('http://localhost:3001/ecoisland/all')
      .then((response) => {
        ecoIslands.value = response.data
      })
  }

  const getEcoIslands = () => {
    return ecoIslands.value
  }

  const deleteById = async (id) => {
    return await api.delete('http://localhost:3001/ecoisland/delete/' + id)
  }

  const getEcoIslandsById = async (id) => {
    const result = {
      data: ecoIslands
        .value.find(e => e.id === +id)
    }
    if (result.data !== undefined) {
      return result
    }
    return await api.get('http://localhost:3001/ecoisland/' + id)
  }

  const addEcoIsland = async (ecoIsland) => {
    return await api
      .post('http://localhost:3001/ecoisland/add', ecoIsland)
      .then(() => {
        fetchEcoIslands()
          .catch((errorMessage) => {
            console.log(errorMessage)
          })
      })
  }

  const uploadEcoIslands = async (file) => {
    await api.post('http://localhost:3001/ecoisland/upload', {
      file
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(() => {
        fetchEcoIslands()
          .catch((errorMessage) => {
            console.log(errorMessage)
          })
      })
  }

  return {
    fetchEcoIslands,
    getEcoIslandsById,
    getEcoIslands,
    addEcoIsland,
    uploadEcoIslands,
    deleteById
  }
})
