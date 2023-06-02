<template>
  <q-page padding v-if="user">
    <q-btn
      flat
      color="primary"
      label="Back"
      icon="arrow_back"
      class="q-ma-md"
      @click="router.go(-1)"
    />
    <q-card>
      <q-card-section class="row items-end">
        <div class="text-h5 text-grey-9 q-mr-sm"> {{ user.name }}</div>
        <div class="text-subtitle1 text-grey-9"> {{ user.username }}</div>
      </q-card-section>
      <q-card-section>
        <div><span class="text-bold">Email:</span> {{ user.email }}</div>
        <div class="row items-center">
          <div class="text-bold q-mr-sm">Role:</div>
          <q-select
            class="text-green"
            v-model="user.role"
            :options="roleOptions"
            borderless
            hide-dropdown-icon>
            <template v-slot:selected>
              <div :class="lineColor(user.role)">{{ firstUpper(user.role) }}</div>
            </template>
          </q-select>
        </div>
        <div class="row items-center">
          <div class="text-bold q-mr-sm">Edifícios:</div>
          <q-btn
            icon="edit"
            label="Editar"
            color="primary"
            size="sm"
            rounded
            @click="toggleBuildings = !toggleBuildings"
          />
        </div>
        <div v-if="toggleBuildings" class="row">
          <div v-for="build in buildings" :key="build">
            <q-btn
              flat
              :class="userHasBuilding(build)? 'text-blue' : 'text-grey'"
              :label="build.name"
              @click="() => {
                if(!userHasBuilding(build)){
                  showAddDialog = !showAddDialog
                }
                else {
                  showDeleteDialog = !showDeleteDialog
                }
                buildToEdit = build}"
            />

          </div>
        </div>
        <div v-else class="row">
          <div v-for="build in userBuildings" :key="build">
            <q-btn
              flat
              class="text-blue"
              :label="build.name"
              disable
            />
          </div>
        </div>
      </q-card-section>
      <ConfirmationDialog
        title="Tem a certeza que quer adicionar o Edificio?"
        negative-label="Cancelar"
        positive-label="Adicionar"
        v-model:show-dialog="showAddDialog"
        @positive-function="addUserBuilding"
        @negative-function="buildToEdit = null"
      />
      <ConfirmationDialog
        title="Tem a certeza que quer remover o Edificio?"
        negative-label="Cancelar"
        positive-label="Remover"
        v-model:show-dialog="showDeleteDialog"
        @positive-function="removeUserBuilding"
        @negative-function="buildToEdit = null"
      />

    </q-card>
  </q-page>
</template>

<script>
import { useUserStore } from 'stores/UserStore'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useNotify from 'src/composables/UseNotify'
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import ConfirmationDialog from 'components/Dialogs/ConfirmationDialog.vue'

export default {
  name: 'SingleUserPage',
  components: { ConfirmationDialog },
  setup () {
    const userStore = useUserStore()
    const ecoIslandStore = useEcoIslandStore()
    const {
      notifyError,
      notifySuccess
    } = useNotify()
    const user = ref()
    const route = useRoute()
    const router = useRouter()
    const userId = route.params.userid
    const roleOptions = [
      'Viewer',
      'Editor',
      'Admin'
    ]
    const toggleBuildings = ref(false)

    const buildings = ref([])
    const userBuildings = ref([])

    const showDeleteDialog = ref(false)
    const showAddDialog = ref(false)
    const buildToEdit = ref()

    const firstUpper = (role) => {
      const str = role.toLowerCase()
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const updateUserRole = (user) => {
      userStore.updateUser(user)
        .catch((error) => {
          notifyError(error)
        })
    }

    const addUserBuilding = () => {
      const userBuilding = {
        name: buildToEdit.value.name,
        id: buildToEdit.value.id
      }

      userStore.addBuildingToUser(userBuilding, user.value.username)
        .catch((error) => {
          notifyError(error)
        })
        .then(() => {
          notifySuccess('Edificio adicionado com sucesso')
          // location.reload()
        })
    }

    const removeUserBuilding = () => {
      console.log('delete', buildToEdit.value.id, user.value.username)
      userStore.deleteBuildingFromUser(buildToEdit.value.id, user.value.username)
        .then(() => {
          notifySuccess('Edificio removido com sucesso')
          location.reload()
        })
    }

    const lineColor = (role) => {
      switch (role) {
        case 'ADMIN':
          return 'text-primary'
        case 'EDITOR':
          return 'text-green'
        default:
          return ''
      }
    }

    const userHasBuilding = (build) => {
      return userBuildings.value.some(e => e.id === build.id)
    }

    onMounted(async () => {
      if (userId === userStore.getUsername()) {
        user.value = userStore.getUser()
      } else {
        userStore.fetchUserById(userId)
          .then((res) => {
            user.value = res.data
          })
      }

      await ecoIslandStore.fetchAlamedaBuildings()
        .then(res => {
          buildings.value = res.data
          buildings.value.sort((a, b) => alphabeticalSort(a.name.toUpperCase(), b.name.toUpperCase()))
        })
      if (userId !== userStore.getUsername()) {
        await userStore.fetchBuildsByUsername(user.value.username)
          .then((res) => {
            userBuildings.value = res.data
          })
      } else {
        await userStore.fetchMyBuildings()
          .then((res) => {
            userBuildings.value = res.data
          })
      }
      console.log(userBuildings)
      userBuildings.value.sort((a, b) => alphabeticalSort(a.name.toUpperCase(), b.name.toUpperCase()))
    })

    function alphabeticalSort (a, b) {
      if (a < b) {
        return -1
      }
      if (a > b) {
        return 1
      }
      // names must be equal
      return 0
    }

    return {
      user,
      userStore,
      roleOptions,
      router,
      buildings,
      userBuildings,
      toggleBuildings,

      firstUpper,
      lineColor,

      updateUserRole,
      addUserBuilding,
      removeUserBuilding,
      userHasBuilding,

      showAddDialog,
      showDeleteDialog,
      buildToEdit

    }
  }
}
</script>

<style scoped>

</style>
