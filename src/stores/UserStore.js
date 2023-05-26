import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/axios'

export const useUserStore = defineStore('user', () => {
  const user = ref('')
  const users = ref([])

  const getUser = () => {
    return user.value
  }

  const getUsername = () => {
    return user.value.username
  }

  const getName = () => {
    return user.value.name
  }

  const hasEditPermissions = () => {
    return user.value.role === 'EDITOR' || hasAdminPermissions()
  }

  const hasAdminPermissions = () => {
    return user.value.role === 'ADMIN'
  }

  const getFirstName = () => {
    const names = user.value.name.split(' ')
    return names[0]
  }
  const getLastName = () => {
    const names = user.value.name.split(' ')
    return names[names.length - 1]
  }

  const getRole = () => {
    return user.value.role
  }

  const getToken = () => {
    return user.value.token
  }

  const hasAuthenticatied = () => {
    return user.value !== ''
  }

  const setUser = (newInfo) => {
    user.value = newInfo
  }

  const logoutUser = () => {
    setUser('')
  }

  const getAuth = async (code) => {
    await api.get('/auth/fenix/' + code)
      .then((response) => {
        user.value = response.data
      })
  }

  const fetchAllUsers = async () => {
    await api.get('/user/get/all')
      .then((response) => {
        users.value = response.data
      })
  }

  const updateUser = async (user) => {
    await api.put('/user/update', user)
      .then(() => {
        fetchAllUsers()
          .catch((errorMessage) => {
            console.log(errorMessage)
          })
      })
  }

  const getUsers = () => {
    return users.value
  }

  const fetchUserById = async (id) => {
    return await api.get('/user/get/' + id)
  }

  const addBuildingToUser = async (userBuilding) => {
    console.log('userBuilding', userBuilding)
    return await api
      .post('/building/add', userBuilding)
  }

  const fetchBuildsByUsername = async (username) => {
    return await api
      .get('/building/get/' + username)
  }

  return {
    getUser,
    checkAuth: getAuth,
    hasAuthenticatied,
    getUsername,
    getName,
    getFirstName,
    getLastName,
    getToken,
    getRole,
    logoutUser,
    hasEditPermissions,
    hasAdminPermissions,
    fetchAllUsers,
    getUsers,
    updateUser,
    fetchUserById,
    addBuildingToUser,
    fetchBuildsByUsername
  }
})
