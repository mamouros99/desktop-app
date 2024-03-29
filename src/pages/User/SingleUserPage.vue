<template>
  <q-page padding v-if="user">
    <q-btn
      flat
      color="primary"
      label="Back"
      icon="arrow_back"
      class="q-ma-md"
      @click=" router.push(userStore.hasAdminPermissions()? '/admin' : '/') "
    />
    <q-card>
      <q-card-section class="row items-end">
        <div class="text-h5 text-grey-9 q-mr-sm"> {{ user.name }}</div>
        <div class="text-subtitle1 text-grey-9"> {{ user.username }}</div>
      </q-card-section>
      <q-card-section>
        <div><span class="text-bold">{{ $t('email') }}:</span> {{ user.email }}</div>
        <div class="row items-center">
          <div class="text-bold q-mr-sm">{{ $t('role') }}:</div>
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
        <div class="row items-center" v-if="userStore.hasEditPermissions()">
          <div class="text-bold q-mr-sm">{{ $t('receive_questions') }}:</div>
          <q-toggle
            v-model="currentQuestion"
            color="secondary"
            checked-icon="check"
            unchecked-icon="clear"
            @update:model-value="updateReceiveQuestions"
          />
        </div>
        <div class="row items-center">
          <div class="text-bold q-mr-sm">{{ $t('buildings') }}:</div>
          <q-btn
            v-if=" !toggleBuildings"
            icon="edit"
            :label="$t('edit')"
            color="primary"
            size="sm"
            rounded
            @click="toggleBuildings = !toggleBuildings"
          />
          <q-btn
            v-if=" toggleBuildings"
            icon="stop"
            :label="$t('cancel')"
            color="secondary"
            size="sm"
            rounded
            @click="toggleBuildings = !toggleBuildings"
          />
        </div>
        <div v-if="toggleBuildings" class="q-px-lg">
          <div class=" q-mb-sm" v-for="build in buildings" :key="build">
            <q-btn
              flat
              :icon="userHasBuilding(build)? 'remove' : 'add'"
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
          <div class="row justify-start q-mb-sm" v-for="build in userBuildings" :key="build">
            <div class="column col-4 justify-center ">
              <div
                class="text-primary text-h6"
                @click="toogleReceiveEmail(build.id)"
              >
                {{build.name}}
              </div>
            </div>
            <div class="row items-center">

              <q-toggle
                v-model="build.receiveEmails"
                icon="email"
                :label="build.receiveEmails ? $t('msg_active_emails') : $t('msg_desactive_emails')"
                size="lg"
                @click="toogleReceiveEmail(build.id)"
              />
            </div>
          </div>
        </div>
        <div class="row justify-end" v-if="rolehasChanged && userStore.hasAdminPermissions()">
          <q-btn
            class="q-mr-lg"
            dense
            :label="$t('save')"
            color="positive"
            @click="updateUserRole()"
          />
          <q-btn
            dense
            :label="$t('reset')"
            color="negative"
            @click="role = user.role"
          />
        </div>
      </q-card-section>
      <ConfirmationDialog
        v-if="showAddDialog"
        :title=" $t('msg_add_building') + ' ' + buildToEdit.name+'?'"
        :negative-label="$t('cancel')"
        :positive-label="$t('add')"
        v-model:show-dialog="showAddDialog"
        @positive-function="addUserBuilding"
        @negative-function="resetBuildToEdit"
      />
      <ConfirmationDialog
        v-if="showDeleteDialog"

        :title=" $t('msg_remove_building') + ' ' + buildToEdit.name+'?'"
        :negative-label="$t('cancel')"
        :positive-label="$t('remove')"
        v-model:show-dialog="showDeleteDialog"
        @positive-function="removeUserBuilding"
        @negative-function="resetBuildToEdit"
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
    const buildToEdit = ref({
      name: '',
      id: ''
    })

    const currentQuestion = ref()

    const rolehasChanged = computed(() => {
      return role.value !== user.value.role
    })

    const firstUpper = (role) => {
      const str = role.toLowerCase()
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const resetBuildToEdit = () => {
      buildToEdit.value = {
        name: '',
        id: ''
      }
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
        .then(() => {
          notifySuccess('Edificio adicionado com sucesso')
          location.reload()
        })
        .catch((error) => {
          notifyError(error)
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
      fetchUser()

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

    const fetchUser = () => {
      if (userStore.hasAdminPermissions()) {
        userStore.fetchUserById(userId.value)
          .then((res) => {
            user.value = Object.assign({}, res.data)
            role.value = user.value.role
            currentQuestion.value = user.value.receiveQuestions
          })
      } else {
        userStore.findMyUser()
          .then((res) => {
            user.value = Object.assign({}, res.data)
            role.value = user.value.role
            currentQuestion.value = user.value.receiveQuestions
          })
      }
    }

    const updateReceiveQuestions = async () => {
      await userStore.toggleReceiveQuestionById(user.value.username)
      fetchUser()
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

      toogleReceiveEmail,
      currentQuestion,
      fetchUser,
      updateReceiveQuestions,

      resetBuildToEdit
    }
  }
}
</script>

<style scoped>

</style>
