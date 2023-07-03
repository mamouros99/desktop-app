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
            :disable="!userStore.hasAdminPermissions()"
            class="text-green"
            v-model="role"
            :options="roleOptions"
            borderless
            hide-dropdown-icon>
            <template v-slot:selected>
              <div :class="lineColor(role)">{{ firstUpper(role) }}</div>
            </template>
          </q-select>

        </div>
        <div class="row items-center">
          <div class="text-bold q-mr-sm">Edifícios:</div>
          <q-btn
            v-if="userStore.hasAdminPermissions() && !toggleBuildings"
            icon="edit"
            label="Editar"
            color="primary"
            size="sm"
            rounded
            @click="toggleBuildings = !toggleBuildings"
          />
          <q-btn
            v-if="userStore.hasAdminPermissions() && toggleBuildings"
            icon="stop"
            label="Cancelar"
            color="secondary"
            size="sm"
            rounded
            @click="toggleBuildings = !toggleBuildings"
          />
        </div>
        <div v-if="toggleBuildings" class="q-px-lg">
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
        <div v-else class="q-px-lg">
          <div class="row justify-start" v-for="build in userBuildings" :key="build">
            <div class="col-4">
              <q-btn
                flat
                class="text-blue"
                :label="build.name"
                @click="toogleReceiveEmail(build.id)"
              />
            </div>
            <q-icon
              class="col-2"
              size="md"
              name="email"
              :color="build.receiveEmails ? 'primary' : 'red-5'"
              @click="toogleReceiveEmail(build.id)"
            />
          </div>
        </div>
        <div class="row justify-end" v-if="rolehasChanged && userStore.hasAdminPermissions()">
          <q-btn
            class="q-mr-lg"
            dense
            label="save"
            color="positive"
            @click="updateUserRole()"
          />
          <q-btn
            dense
            label="reset"
            color="negative"
            @click="role = user.role"
          />
        </div>
      </q-card-section>
      <ConfirmationDialog
        v-if="showAddDialog"
        :title="'Tem a certeza que quer adicionar o edificio ' + buildToEdit.name+'?'"
        negative-label="Cancelar"
        positive-label="Adicionar"
        v-model:show-dialog="showAddDialog"
        @positive-function="addUserBuilding"
        @negative-function="buildToEdit = null"
      />
      <ConfirmationDialog
        v-if="showDeleteDialog"

        :title="'Tem a certeza que quer remover o edificio ' + buildToEdit.name+'?'"
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
import { computed, onMounted, ref } from 'vue'
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
    const role = ref()
    const route = useRoute()
    const router = useRouter()
    const userId = computed(() => route.params.userid)
    const roleOptions = [
      'VIEWER',
      'EDITOR',
      'ADMIN'
    ]
    const toggleBuildings = ref(false)

    const buildings = ref([])
    const userBuildings = ref([])

    const showDeleteDialog = ref(false)
    const showAddDialog = ref(false)
    const buildToEdit = ref()

    const rolehasChanged = computed(() => {
      return role.value !== user.value.role
    })

    const firstUpper = (role) => {
      const str = role.toLowerCase()
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const updateUserRole = () => {
      userStore.updateUserRole(user.value.username, role.value)
        .then(() => {
          location.reload()
        })
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
          location.reload()
        })
    }

    const removeUserBuilding = () => {
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
      return userBuildings.value.some(e => e.id.id === build.id)
    }

    onMounted(async () => {
      if (userId.value === userStore.getUsername()) {
        user.value = Object.assign({}, userStore.getUser())
        role.value = user.value.role
      } else {
        userStore.fetchUserById(userId.value)
          .then((res) => {
            user.value = Object.assign({}, res.data)
            role.value = user.value.role
          })
      }

      await ecoIslandStore.fetchAlamedaBuildings()
        .then(res => {
          buildings.value = res.data
          buildings.value.sort((a, b) => alphabeticalSort(a.name.toUpperCase(), b.name.toUpperCase()))
        })
      if (userId.value !== userStore.getUsername()) {
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
      userBuildings.value.sort((a, b) => alphabeticalSort(a.name.toUpperCase(), b.name.toUpperCase()))
    })

    const toogleReceiveEmail = async (buildingId) => {
      await userStore.toogleReceiveEmailStatus(buildingId.id)

      if (userId.value !== userStore.getUsername()) {
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

      userBuildings.value.sort((a, b) => alphabeticalSort(a.name.toUpperCase(), b.name.toUpperCase()))
    }

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
      userStore,
      router,

      user,
      rolehasChanged,
      role,

      roleOptions,
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
      buildToEdit,

      toogleReceiveEmail

    }
  }
}
</script>

<style scoped>

</style>
