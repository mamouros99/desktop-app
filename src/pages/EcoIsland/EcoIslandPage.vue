<template>
  <q-page padding>

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
          <div>{{ $t('new_island') }}</div>

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
      :columns="columnsI18n"
      row-key="id"
      :filter="currentFilter"
      :filter-method="customFilter"

    >

      <template v-slot:no-data>
        <q-item>
          {{ $t('msg_no_islands')}} &nbsp;
          <span
            @click="router.push('/user/' + userStore.getUsername())"
            class="text-primary text-bold"
          > {{ $t('profile') }}
            </span>

        </q-item>
      </template>

      <template v-slot:top>
        <div class="row full-width justify-between">
          <div class="text-h4 q-pl-lg col-3 text-primary">
            {{ $t('ecoislands') }}
            <q-btn
              icon="download"
              color="secondary"
              round
              flat
              @click="downloadEcoislands()"
            />
          </div>

          <q-scroll-area class=" col-7">
            <div class="row no-wrap">
              <q-chip
                v-for="(id,index) in currentFilter.id"
                :key="id"
                removable
                @remove="currentFilter.id.splice(index, 1)"
                color="blue-5"
                icon="tag"
                :label="id"
              />
              <q-chip
                v-for="(ident,index) in currentFilter.identifier"
                :key="ident"
                removable
                @remove="currentFilter.identifier.splice(index, 1)"
                color="green-5"
                icon="fingerprint"
                :label="ident"
              />
              <q-chip
                v-for="(build,index) in currentFilter.building"
                :key="build"
                removable
                @remove="currentFilter.building.splice(index, 1)"
                color="yellow-5"
                icon="mdi-office-building"
                :label="build"
              />
              <q-chip
                v-for="(floor,index) in currentFilter.floor"
                :key="floor"
                removable
                @remove="currentFilter.floor.splice(index, 1)"
                color="orange-5"
                icon="mdi-stairs"
                :label="floor"
              />
            </div>
          </q-scroll-area>

          <div class="col-2 row justify-end items-center">
            <q-btn
              flat
              color="primary"
              :label="$t('filter')"
              icon="filter_alt"
              @click="showFilterDialog = !showFilterDialog"
            />
            <EcoislandFilterDialog :old-filter="currentFilter"
                                   v-model:show-dialog="showFilterDialog"
                                   @update-filters="updateFilters"/>
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
  </q-page>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import useVariables from 'src/composables/useVariables'
import NewIslandDialog from 'components/Dialogs/NewIslandDialog.vue'
import { useRouter } from 'vue-router'
import useNotify from 'src/composables/UseNotify'
import { useUserStore } from 'stores/UserStore'
import { saveAs } from 'file-saver'
import EcoislandFilterDialog from 'components/Dialogs/EcoislandFilterDialog.vue'
import { useI18n } from 'vue-i18n'
import { useTablesStore } from 'stores/TablesStore'

export default {
  components: {
    EcoislandFilterDialog,
    NewIslandDialog
  },
  // name: 'PageName',
  setup () {
    const ecoIslandStore = useEcoIslandStore()
    const {
      iconBinsExtra,
      iconBinsBase
    } = useVariables()

    const { t } = useI18n()

    const showFilterDialog = ref(false)

    const tablesStore = useTablesStore()
    const initialPagination = ref({ rowsPerPage: tablesStore.ecoislandRows || 10 })

    const currentFilter = ref({
      id: [],
      identifier: [],
      building: [],
      floor: []
    })

    const router = useRouter()
    const {
      notifyError,
      notifySuccess
    } = useNotify()
    const showDialog = ref(false)
    const file = ref(null)
    const search = ref('')

    const tagFilter = ref('None')

    const myUrl = process.env.VUE_APP_MY_URL

    const filteredIconBin = (condition) => {
      return [...iconBinsBase, ...iconBinsExtra.filter((e) => {
        return condition.charAt(e.position) === '1'
      })]
    }

    const test = (a) => {
      console.log(a)
    }

    const updateFilters = ({
      name,
      value
    }) => {
      currentFilter.value[name].push(value)
    }

    const downloadEcoislands = () => {
      ecoIslandStore.downloadEcoislands()
        .then((res) => {
          saveAs(res.data, 'ecoIslands.csv')
        })
    }

    const customFilter = (rows) => {
      const filterIDRows = currentFilter.value.id.length === 0 ? rows : rows.filter(e => {
        for (const id of currentFilter.value.id) {
          if (e.id.includes(id)) {
            return true
          }
        }
        return false
      })

      const filterIdentifierRows = currentFilter.value.identifier.length === 0 ? filterIDRows : filterIDRows.filter(e => {
        for (const id of currentFilter.value.identifier) {
          if (e.identifier.includes(id)) {
            return true
          }
        }
        return false
      })

      const filteredBuildingRows = currentFilter.value.building.length === 0 ? filterIdentifierRows : filterIdentifierRows.filter(e => {
        for (const id of currentFilter.value.building) {
          if (e.building.toLowerCase().includes(id)) {
            return true
          }
        }
        return false
      })

      return currentFilter.value.floor.length === 0 ? filteredBuildingRows : filteredBuildingRows.filter(e => {
        for (const id of currentFilter.value.floor) {
          if (e.floor.includes(id)) {
            return true
          }
        }
        return false
      })
    }

    const columnsI18n = computed(() => {
      return [
        {
          name: 'identifier',
          label: t('identifier'),
          field: 'identifier',
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
          align: 'center'

        },
        {
          name: 'building',
          label: t('building'),
          field: 'building',
          sortable: true,
          align: 'center'
        },
        {
          name: 'floor',
          label: t('floor'),
          field: 'floor',
          sortable: true,
          align: 'center'
        },
        {
          name: 'bins',
          label: t('bins'),
          field: 'bins',
          sortable: true,
          align: 'center'
        }
      ]
    })

    const uploadFiles = (a) => {
      ecoIslandStore.uploadEcoIslands(a)
        .then(() => {
          notifySuccess(t('msg_good_upload'))
        })
        .catch((errorMessage) => {
          notifyError(t('msg_bad_upload') + errorMessage)
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
      tablesStore,
      columnsI18n,

      showDialog,

      showFilterDialog,
      currentFilter,

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
      updateFilters,

      downloadEcoislands,
      myUrl,

      initialPagination
    }
  }
}
</script>
