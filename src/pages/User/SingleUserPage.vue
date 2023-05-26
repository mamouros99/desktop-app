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
            icon="add"
            color="primary"
            size="sm"
            round
            @click="toggleBuildings = !toggleBuildings"
          />
        </div>
        <div v-if="toggleBuildings" class="row">
          <div v-for="build in buildings" :key="build">
            <q-btn
              flat
              :class="userHasBuilding(build)? 'text-blue' : 'text-grey'"
              :label="build.name"
              @click="() => {showConfiramtionDialog = !showConfiramtionDialog
              buildingToAdd = build}"
            />

          </div>
        </div>
      </q-card-section>
      <ConfirmationDialog
        title="Tem a certeza que quer adicionar o Edificio?"
        negative-label="Cancelar"
        positive-label="Adicionar"
        v-model:show-dialog="showConfiramtionDialog"
        @positive-function="addUserBuilding"
        @negaative-function="buildingToAdd = null"
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
    const { notifyError } = useNotify()
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

    const showConfiramtionDialog = ref(false)
    const buildingToAdd = ref()

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
      console.log('build', buildingToAdd)
      const userBuilding = {
        buildingName: buildingToAdd.value.name,
        buildingId: buildingToAdd.value.id,
        username: user.value.username
      }

      userStore.addBuildingToUser(userBuilding)
        .catch((error) => {
          notifyError(error)
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
      for (const building in userBuildings) {
        if (build.id === building.id) {
          return true
        }
      }
      return false
    }

    onMounted(async () => {
      if (userId === userStore.getUsername()) {
        user.value = userStore.getUser()
      } else {
        userStore.fetchUserById(userId).then((res) => {
          user.value = res.data
        })
      }

      await ecoIslandStore.fetchAlamedaBuildings()
        .then(res => {
          const campus = res.data
          const validKeys = ['id', 'name']
          buildings.value = campus.map((build) => {
            Object.keys(build).forEach((key) => validKeys.includes(key) || delete build[key])
            return build
          })
          buildings.value.sort((a, b) => {
            const nameA = a.name.toUpperCase() // ignore upper and lowercase
            const nameB = b.name.toUpperCase() // ignore upper and lowercase
            if (nameA < nameB) {
              return -1
            }
            if (nameA > nameB) {
              return 1
            }
            // names must be equal
            return 0
          })
        })

      await userStore.fetchBuildsByUsername(user.value.username)
        .then((res) => {
          userBuildings.value = res.data
          console.log('user', userBuildings.value)
        })
    })

    return {
      user,
      roleOptions,
      router,
      buildings,
      toggleBuildings,

      firstUpper,
      lineColor,

      updateUserRole,
      addUserBuilding,
      userHasBuilding,

      showConfiramtionDialog,
      buildingToAdd

    }
  }
}
</script>

<style scoped>

</style>