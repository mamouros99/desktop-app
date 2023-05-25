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
          />
          <div v-for="build in buildings" :key="build"> {{ build }}</div>
        </div>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script>
import { useUserStore } from 'stores/UserStore'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useNotify from 'src/composables/UseNotify'

export default {
  name: 'SingleUserPage',
  setup () {
    const userStore = useUserStore()
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

    const buildings = ref([])

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

    onMounted(() => {
      if (userId === userStore.getUsername()) {
        user.value = userStore.getUser()
      } else {
        userStore.fetchUserById(userId).then((res) => {
          user.value = res.data
        })
      }
    })

    return {
      user,
      roleOptions,
      router,
      buildings,

      firstUpper,
      lineColor,

      updateUserRole
    }
  }
}
</script>

<style scoped>

</style>
