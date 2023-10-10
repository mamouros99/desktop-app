import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/axios'
import { LocalStorage } from 'quasar'

export const useUserStore = defineStore('user', () => {
  const user = ref(LocalStorage.getItem('user'))

  const users = ref([])
  const roleRequests = ref([])

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
    return user.value !== null
  }

  const logoutUser = () => {
    resetLocalStorage()
    user.value = null
  }

  const resetLocalStorage = () => {
    LocalStorage.remove('user')
    LocalStorage.remove('beforePath')
  }

  const getAuth = async (code) => {
    await api.get('/auth/fenix/desktop/' + code)
      .then((response) => {
        LocalStorage.set('user', response.data)
        user.value = LocalStorage.getItem('user')
      })
  }

  const fetchAllUsers = async () => {
    await api.get('/user/get/all')
      .then((response) => {
        users.value = response.data
      })
  }

  const updateUserRole = async (username, role) => {
    return await api.put('/user/update/' + username + '/' + role)
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

  const getRoleRequest = () => {
    return roleRequests.value
  }
  const getEditorUsers = () => {
    return users.value.filter(e => e.role === 'ADMIN' || e.role === 'EDITOR')
  }

  const fetchUserById = async (id) => {
    return await api.get('/user/get/' + id)
  }
  const findMyUser = async () => {
    return await api.get('/user/findMyUser')
  }

  const toggleReceiveQuestionById = async (id) => {
    await api.put('/user/receiveQuestion/' + id)
  }

  const addBuildingToUser = async (userBuilding, username) => {
    await api
      .post('/building/add/' + username, userBuilding)
  }

  const addRoleRequest = async (username) => {
    await api
      .post('/roleRequest/add/' + username)
  }

  const deleteRoleRequest = async (username) => {
    return await api
      .delete('/roleRequest/remove/' + username)
  }

  const fetchRoleRequest = async () => {
    await api
      .get('/roleRequest/get/all')
      .then((response) => {
        roleRequests.value = response.data
      })
  }

  const deleteBuildingFromUser = async (buildingId, username) => {
    return await api
      .delete('/building/delete/' + username + '/' + buildingId)
  }

  const fetchBuildsByUsername = async (username) => {
    return await api
      .get('/building/get/' + username)
  }

  const fetchMyBuildings = async () => {
    return await api
      .get('/building/mybuildings')
  }

  const toogleReceiveEmailStatus = async (buildingId) => {
    return await api
      .put('/building/' + buildingId + '/emailstatus')
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
    findMyUser,
    getUsers,
    getEditorUsers,
    updateUserRole,
    fetchUserById,
    toggleReceiveQuestionById,

    addBuildingToUser,
    deleteBuildingFromUser,
    fetchBuildsByUsername,
    fetchMyBuildings,
    toogleReceiveEmailStatus,

    addRoleRequest,
    deleteRoleRequest,
    getRoleRequest,
    fetchRoleRequest
  }
})
