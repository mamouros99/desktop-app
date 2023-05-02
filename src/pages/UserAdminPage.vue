<template>
  <q-page padding>
    <q-table
      flat
      bordered
      class="bg-grey-2 q-mx-md q-mt-lg"
      :rows="userStore.getUsers()"
      :columns="columns"
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
        <div class="text-primary text-h5 q-pl-md">
          Utilizadores
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :class="userStore.getUsername() === props.row.username ? 'bg-blue-1' : 'bg-white'">
          <q-td class="text-center"> {{ props.row.username }}</q-td>
          <q-td class="text-center"> {{ props.row.name }}</q-td>
          <q-td class="text-center"> {{ props.row.email }}</q-td>
          <q-td class="text-center" :class="lineColor(props.row.role)">
            {{ firstUpper(props.row.role) }}
            <q-popup-edit v-model="props.row.role" v-slot="scope" buttons label-set="Save" label-cancel="Cancel"
                          @update:model-value="() => {
                            props.row.role = props.row.role.toUpperCase()
                          updateUserRole(props.row)
                        }">
              <q-select v-model="scope.value" :options="options" label="Role"/>

            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useUserStore } from 'stores/UserStore'
import useNotify from 'src/composables/UseNotify'

export default {
  // name: 'PageName',
  setup () {
    const userStore = useUserStore()
    const { notifyError } = useNotify()

    const columns = [
      {
        name: 'username',
        label: 'Username',
        field: 'username',
        sortable: true,
        align: 'center'
      },
      {
        name: 'name',
        label: 'Name',
        field: 'name',
        align: 'center'
      },
      {
        name: 'email',
        label: 'Email',
        field: 'email',
        align: 'center'
      },
      {
        name: 'Role',
        label: 'Role',
        field: 'role',
        align: 'center',
        sortable: true
      }
    ]

    const options = [
      'Viewer',
      'Editor',
      'Admin'
    ]

    const filter = ref('')

    onMounted(() => {
      fetch()
    })

    const fetch = () => {
      userStore.fetchAllUsers()
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

    const updateUserRole = (user) => {
      userStore.updateUser(user)
        .catch((error) => {
          notifyError(error)
        })
    }

    return {
      userStore,
      columns,
      lineColor,
      firstUpper: role => {
        const str = role.toLowerCase()
        return str.charAt(0).toUpperCase() + str.slice(1)
      },
      options,
      test: (a) => {
        console.log('test', a)
      },
      updateUserRole,
      filter
    }
  }
}
</script>
