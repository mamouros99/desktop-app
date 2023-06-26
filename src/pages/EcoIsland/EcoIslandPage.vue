<template>
  <q-page padding>
    <q-card flat class="q-pa-md">

      <NewIslandDialog v-model:showDialog="showDialog" v-if="showDialog"/>

      <div
        v-if="userStore.hasEditPermissions()"
        class="q-my-md row justify-between"
      >
        <div>
          <q-btn
            class="q-ml-lg q-px-md"
            rounded
            dense
            color="secondary"
            @click="showDialog = true"
          >
            <q-icon
              name="add"
              class="q-pr-sm"
            />
            <div>Nova Ecoílha</div>

          </q-btn>
        </div>

        <q-file
          ref="fileInput"
          class="q-mr-lg col-2"
          rounded
          bg-color="primary"
          dense
          label-color="white"
          outlined
          v-model="file"
          label="Upload .CSV"
        >
          <template v-slot:before>
            <q-icon
              v-if="file!== null"
              color="secondary"
              name="send"
              @click=" uploadFiles(file)"
            />
          </template>

          <template v-slot:append>
            <q-icon v-if="file !== null" color="white" name="close" @click.stop.prevent="file = null"
                    class="cursor-pointer"/>
          </template>
        </q-file>

      </div>

      <q-table
        class="col-8"
        card-class="bg-grey-2"
        flat bordered
        :rows="ecoIslandStore.getEcoIslands()"
        :columns="columns"
        row-key="id"
        :filter="search"
        :filter-method="customFilter"
      >

        <template v-slot:top>
          <div class="row full-width justify-between">
            <div class="text-h5 q-pl-lg col-4 text-primary">
              Ecoílhas
              <q-btn
                icon="download"
                color="secondary"
                round
                flat
                @click="downloadEcoislands()"
              />
            </div>

            <div class="col-6 row justify-end items-center">
              <q-select
                class="col-3 q-pr-lg"
                :options="options"
                v-model="tagFilter"
                rounded
                standout="bg-primary"
                hide-dropdown-icon
                dense
              />
              <q-input
                class="col-3"
                rounded
                v-model="search"
                label="Search"
              >
                <template v-slot:append>
                  <q-icon
                    name="search"
                  />
                </template>
              </q-input>
            </div>
          </div>

        </template>

        <template v-slot:body="props">
          <q-tr :props="props"
                class="bg-grey-1"
                @click="router.push('/ecoisland/'+ props.row.id)"
          >
            <q-td
              v-for="col in props.cols.filter(e => e.name !== 'bins')"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>
            <q-td
              class="text-center"
            >
              <q-icon
                v-for="bin in filteredIconBin(props.cols.find(e => e.name === 'bins').value)"
                :key="bin.name"
                name="mdi-trash-can-outline"
                :color="bin.color"
                size="sm"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import useVariables from 'src/composables/useVariables'
import NewIslandDialog from 'components/Dialogs/NewIslandDialog.vue'
import { useRouter } from 'vue-router'
import useNotify from 'src/composables/UseNotify'
import { useUserStore } from 'stores/UserStore'
import { saveAs } from 'file-saver'

export default {
  components: {
    NewIslandDialog
  },
  // name: 'PageName',
  setup () {
    const ecoIslandStore = useEcoIslandStore()
    const {
      iconBinsExtra,
      iconBinsBase
    } = useVariables()

    const router = useRouter()
    const {
      notifyError,
      notifySuccess
    } = useNotify()
    const showDialog = ref(false)
    const file = ref(null)
    const search = ref('')

    const tagFilter = ref('None')

    const filteredIconBin = (condition) => {
      return [...iconBinsBase, ...iconBinsExtra.filter((e) => {
        return condition.charAt(e.position) === '1'
      })]
    }

    const test = (a) => {
      console.log(a)
    }

    const downloadEcoislands = () => {
      ecoIslandStore.downloadEcoislands()
        .then((res) => {
          saveAs(res.data, 'ecoIslands.csv')
        })
    }

    const customFilter = (rows) => {
      if (!search.value) {
        return rows
      }

      switch (tagFilter.value.toLowerCase()) {
        case 'Piso':
          return rows.filter(e => {
            return e.floor.toLowerCase().includes(search.value)
          })
        case 'Id':
          return rows.filter(e => {
            return e.id.toString().toLowerCase().includes(search.value)
          })
        case 'Edifício':
          return rows.filter(e => {
            return e.building.toLowerCase().includes(search.value)
          })
        default:
          return rows.filter(e => {
            return e.id.toString().includes(search.value) ||
              e.building.toLowerCase().includes(search.value) ||
              e.floor.toLowerCase().includes(search.value) ||
              e.bins.includes(search.value)
          })
      }
    }

    const columns = [
      {
        name: 'identifier',
        label: 'ID',
        field: 'identifier',
        sortable: true,
        align: 'center'

      },
      {
        name: 'building',
        label: 'Edifício',
        field: 'building',
        sortable: true,
        align: 'center'
      },
      {
        name: 'floor',
        label: 'Piso',
        field: 'floor',
        sortable: true,
        align: 'center'
      },
      {
        name: 'bins',
        label: 'Caixotes',
        field: 'bins',
        sortable: true,
        align: 'center'
      }
    ]

    const uploadFiles = (a) => {
      ecoIslandStore.uploadEcoIslands(a)
        .then(() => {
          notifySuccess('Upload foi bem-sucedido')
        })
        .catch((errorMessage) => {
          notifyError('Problema com o upload - ' + errorMessage)
        })

      file.value = null
    }

    onMounted(() => {
      fetch()
    })

    const options = [
      'None',
      'Id',
      'Edifício',
      'Piso'
    ]

    const fetch = () => {
      ecoIslandStore.fetchEcoIslands()
        .catch((errorMessage) => {
          notifyError(errorMessage)
        })
    }

    return {
      ecoIslandStore,
      columns,
      showDialog,
      router,
      file,
      filteredIconBin,
      uploadFiles,
      test,
      userStore: useUserStore(),
      options,

      search,
      tagFilter,
      customFilter,

      downloadEcoislands

    }
  }
}
</script>
