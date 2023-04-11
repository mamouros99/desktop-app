import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/axios'
import useNotify from 'src/composables/UseNotify'
import useFunctions from 'src/composables/UseFunctions'

export const useEcoIslandStore = defineStore('island', () => {
  const {
    notifyError,
    notifySuccess
  } = useNotify()
  const ecoIslands = ref([])
  const { isStringInteger } = useFunctions()

  const fetchEcoIslands = () => {
    console.log('Fetching islands...')
    api.get('http://localhost:3000/ecoislands')
      .then((response) => {
        ecoIslands.value = response.data
      })
      .catch((error) => {
        notifyError((error.code === 'ERR_NETWORK') ? 'Loading Failed' : 'Something Went Wrong')
      })
  }

  const getEcoIslands = () => {
    if (ecoIslands.value.length === 0) {
      fetchEcoIslands()
    }
    return ecoIslands.value
  }

  const getEcoIslandsById = (id) => {
    console.log('Getting ecoisland with ', id, 'from', ecoIslands)

    if (ecoIslands.value.length === 0) {
      fetchEcoIslands()
    }
    if (!isStringInteger(id)) {
      return
    }

    return ecoIslands.value.find(e => e.id === +id)
  }

  const addEcoIsland = async (ecoIsland) => {
    // remove unchecked bins
    await api
      .post('http://localhost:3000/ecoislands', ecoIsland)
      .then(response => {
        notifySuccess()
      }
      )
      .catch(e => {
        notifyError('Alguma coisa correu mal, por favor tente mais tarde')
      }
      )
  }

  return {
    fetchEcoIslands,
    getEcoIslandsById,
    getEcoIslands,
    addEcoIsland
  }
})
