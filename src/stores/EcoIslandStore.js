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
  const currentEcoIsland = ref({})
  const { isStringInteger } = useFunctions()

  async function fetchEcoIslands () {
    console.log('Fetching islands...')
    await api.get('http://localhost:3000/ecoislands')
      .then((response) => {
        console.log('Fetched islands...')
        ecoIslands.value = response.data
      })
      .catch((error) => {
        notifyError((error.code === 'ERR_NETWORK') ? 'Loading Failed' : 'Something Went Wrong')
        console.log('Failed Fetching islands')
      })
  }

  const getEcoIslands = () => {
    return ecoIslands.value
  }

  const getCurrentEcoIsland = () => {
    return currentEcoIsland.value
  }

  const getEcoIslandsById = (id) => {
    if (!isStringInteger(id)) {
      return
    }

    console.log('getEcoIslandsById', ecoIslands)

    return ecoIslands.value.find(e => {
      console.log(e.id, ' ===', +id, e.id === +id)
      return e.id === +id
    })
  }

  const setEcoIslandsByID = async (id) => {
    if (ecoIslands.value.length !== 0) {
      console.log('Setting with value1', ecoIslands.value.find(e => e.id === +id))
      currentEcoIsland.value = ecoIslands.value.find(e => e.id === +id)
    } else {
      fetchEcoIslands()
        .then(() => {
          console.log('Setting with value2', ecoIslands.value.find(e => e.id === +id))
          currentEcoIsland.value = ecoIslands.value.find(e => e.id === +id)
        }
        )
        .catch(
          () => {
            console.log('something went wrong')
          }
        )
    }
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
    addEcoIsland,
    getCurrentEcoIsland,
    setEcoIslandsByID,
    currentEcoIsland
  }
})
