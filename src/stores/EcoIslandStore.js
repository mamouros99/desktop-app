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
    return await api.get('/ecoisland/' + id)
  }

  const addEcoIsland = async (ecoIsland) => {
    console.log('ecoIsland', ecoIsland)
    return await api
      .post('/ecoisland/add', ecoIsland)
      .then(() => {
        fetchEcoIslands()
          .catch((errorMessage) => {
            console.log(errorMessage)
          })
      })
  }

  const uploadEcoIslands = async (file) => {
    await api.post('/ecoisland/upload', {
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

  const updateEcoIsland = async (ecoIsland) => {
    return await api
      .put('/ecoisland/update', ecoIsland)
      .then(() => {
        fetchEcoIslands()
          .catch((errorMessage) => {
            console.log(errorMessage)
          })
      })
  }

  const fetchAlamedaBuildings = async () => {
    return await api.get('/building/all')
  }

  const fetchBuilding = async (id) => {
    return await api.get('/building/' + id)
  }

  const fetchBuildingImage = async (id) => {
    if (id !== undefined) {
      return await api.get('/building/image/' + id)
    }
  }

  const downloadEcoislands = async () => {
    return await api.get('/ecoisland/export', {
      responseType: 'blob'
    })
  }

  return {
    fetchEcoIslands,
    getEcoIslandsById,
    getEcoIslands,
    addEcoIsland,
    uploadEcoIslands,
    updateEcoIsland,
    deleteById,

    fetchAlamedaBuildings,
    fetchBuilding,
    fetchBuildingImage,

    downloadEcoislands
  }
})
