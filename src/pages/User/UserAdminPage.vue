<template>
  <q-page padding>

    <q-table
      v-if="userStore.getRoleRequest().length"
      flat
      bordered
      class="bg-grey-2 q-mb-lg"
      :rows="userStore.getRoleRequest()"
      :columns="columnsI18nRequest"
    >
      <template v-slot:top-left>
        <div class="text-primary text-h4 q-pl-lg">
          {{
            $t('requests')
          }}        </div>
      </template>
      <template v-slot:body="props">
          <q-tr class="bg-white">
              <q-td class="text-center"> {{ props.row.username }}</q-td>
              <q-td class="text-center"> {{ props.row.name }}</q-td>
              <q-td class="text-center"> {{ props.row.email }}</q-td>
              <q-td class="justify-between row ">
                <q-btn
                    class="q-ml-md"
                    icon="close"
                    color="negative"
                    flat
                    dense
                    @click="deleteRequest(props.row.username)"
                />
                <q-btn
                    class="q-mr-md"
                    dense
                    flat
                    icon="done"
                    color="positive"
                    @click="updateUserRole(props.row.username)"
                />
              </q-td>
          </q-tr>
      </template>

    </q-table>

    <q-table
      flat
      bordered
      class="bg-grey-2 "
      :rows="userStore.getEditorUsers()"
      :columns="columnsI18n"
      row-key="username"
      :filter="filter"
    >

      <template v-slot:top-right>
        <q-input dense v-model="filter" placeholder="Search" class="q-pr-md">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>

      <template v-slot:top-left>
        <div class="text-primary text-h4 q-pl-lg">
          {{
            $t('users')
          }}        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :class="userStore.getUsername() === props.row.username ? 'bg-blue-1' : 'bg-white'"
              @click="router.push('user/'+ props.row.username)">
          <q-td class="text-center"> {{ props.row.username }}</q-td>
          <q-td class="text-center"> {{ props.row.name }}</q-td>
          <q-td class="text-center"> {{ props.row.email }}</q-td>
          <q-td class="text-center" :class="lineColor(props.row.role)">
            {{ firstUpper(props.row.role) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from 'stores/UserStore'
import useNotify from 'src/composables/UseNotify'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
  // name: 'PageName',
  setup () {
    const router = useRouter()
    const userStore = useUserStore()
    const { notifyError } = useNotify()

    const { t } = useI18n()

    const columnsI18n = computed(() => {
      return [
        {
          name: 'username',
          label: t('username'),
          field: 'username',
          sortable: true,
          align: 'center'
        },
        {
          name: 'name',
          label: t('name'),
          field: 'name',
          align: 'center'
        },
        {
          name: 'email',
          label: t('email'),
          field: 'email',
          align: 'center'
        },
        {
          name: 'Role',
          label: t('role'),
          field: 'role',
          align: 'center',
          sortable: true
        }
      ]
    })

    const columnsI18nRequest = computed(() => {
      return [
        {
          name: 'username',
          label: t('username'),
          field: 'username',
          sortable: true,
          align: 'center'
        },
        {
          name: 'name',
          label: t('name'),
          field: 'name',
          align: 'center'
        },
        {
          name: 'email',
          label: t('email'),
          field: 'email',
          align: 'center'
        },
        {
          name: 'actions',
          label: '',
          align: 'center'
        }
      ]
    })

    const filter = ref('')

    onMounted(() => {
      fetch()
    })

    const fetch = async () => {
      await userStore.fetchAllUsers()
        .catch((errorMessage) => {
          notifyError(errorMessage)
        })
      await userStore.fetchRoleRequest()
        .catch((errorMessage) => {
          notifyError(errorMessage)
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

    const updateUserRole = (username) => {
      userStore.updateUserRole(username, 'EDITOR')
        .then(() => {
          deleteRequest(username)
        })
        .catch((error) => {
          notifyError(error)
        })
    }

    const deleteRequest = (username) => {
      userStore.deleteRoleRequest(username)
        .then(() => {
          fetch()
        })
        .catch((error) => {
          notifyError(error)
        })
    }

    return {
      userStore,
      router,

      columnsI18n,
      columnsI18nRequest,
      lineColor,
      firstUpper: role => {
        const str = role.toLowerCase()
        return str.charAt(0).toUpperCase() + str.slice(1)
      },
      updateUserRole,
      deleteRequest,
      filter
    }
  }
}
</script>
