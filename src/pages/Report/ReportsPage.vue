<template>
  <q-page padding>

    <q-table
      card-class="bg-grey-2"
      flat bordered
      title="Alertas"
      :rows="reportStore.getReports()"
      :columns="columnsI18n"
      :filter="filter"
      :filter-method="customFilter"
      row-key="id"
      v-model:pagination="initialPagination"
      @update:pagination="tablesStore.storeTablePagination('reportsPagination', initialPagination)"
    >
      <template v-slot:top>
        <div class="row full-width justify-between">
          <div class="text-h4 text-primary q-pl-lg">
            {{ $t('alerts')}}
            <q-btn
              flat
              round
              icon="download"
              color="secondary"
              @click="downloadReports()"
            />
          </div>

          <div class="row">
            <q-input dense rounded v-model="filter.search" label="Search">
              <template v-slot:append>
                <q-icon
                  name="search"
                />
              </template>
            </q-input>
            <q-card flat class="bg-transparent q-pl-md text-primary">
              <q-toggle
                :label="$t('archived')"
                left-label
                v-model="filter.archived"
              />
            </q-card>
            <q-btn
              flat
              color="primary"
              :label="$t('filter')"
              icon="filter_alt"
              @click="toggleDialog"
            />
          </div>

        </div>

        <FilterDialog
          v-model:show-dialog="showDialog"
          @update-filters="(value) => updateFilter(value)"
          :old-filter="filter"
        />

      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" @click="() =>
          {
          openReport(props.row.id)
          }" class="bg-grey-1">
          <q-td
            v-for="col in props.cols.filter(e => e.name !== 'caixotes' && e.name !== 'archived')"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
          <q-td
            class="text-center"
          >
            <q-icon
              v-for="bin in filteredIconBin(props.cols.find(e => e.name === 'caixotes').value)"
              :key="bin.name"
              name="mdi-trash-can-outline"
              :color="bin.color"
              size="sm"
            />
            <q-icon
              v-if="props.row.message.length !== 0"
              name="chat"
              size="sm"
              color="grey-5"
            />
          </q-td>
          <q-td class="text-center">
            <q-icon
              :name="props.row.archived? 'lock' : 'schedule'"
              size="sm"
              :color="props.row.archived? 'positive' : 'warning'"
            />
          </q-td>
        </q-tr>
      </template>

    </q-table>

    <BinsLegendCard :icon-bins="iconBins"/>
  </q-page>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useReportStore } from 'stores/ReportStore'
import { useRouter } from 'vue-router'
import useFunctions from 'src/composables/UseFunctions'
import useVariables from 'src/composables/useVariables'
import BinsLegendCard from 'components/BinsLegendCard.vue'
import FilterDialog from 'components/Dialogs/ReportFilterDialog.vue'
import useNotify from 'src/composables/UseNotify'
import { saveAs } from 'file-saver'
import { useI18n } from 'vue-i18n'
import { useTablesStore } from 'stores/TablesStore'

export default {
  components: {
    FilterDialog,
    BinsLegendCard
  },
  setup () {
    const reportStore = useReportStore()
    const router = useRouter()
    const { notifyError } = useNotify()

    const { t } = useI18n()

    const tablesStore = useTablesStore()
    const initialPagination = ref(tablesStore.reportsPagination)

    const filter = ref({
      search: '',
      startDate: '',
      endDate: '',
      binsSelected: [],
      problemsSelected: [],
      archived: false
    })

    const showDialog = ref(false)

    const columnsI18n = computed(() => {
      return [
        {
          name: 'ecoisland',
          label: t('building'),
          field: 'ecoIsland',
          sortable: true,
          align: 'center',
          format: (val) => {
            return val.building
          }
        },
        {
          name: 'ecoisland',
          label: t('ecoisland') + ' ID',
          field: 'ecoIsland',
          sortable: true,
          align: 'center',
          format: (val) => {
            return val.identifier
          }
        },
        {
          name: 'time',
          label: t('date'),
          field: 'time',
          sortable: true,
          align: 'center',
          format: (val) => {
            return val === undefined ? '--' : formatDate(val)
          },
          headerStyle: 'text-align: center'
        },
        {
          name: 'caixotes',
          label: t('problem_bins'),
          field: row => {
            let final = '00000'
            const dirty = row.dirty === undefined ? '00000' : row.dirty
            const separation = row.separation === undefined ? '00000' : row.separation
            const full = row.full === undefined ? '00000' : row.full

            for (let i = 0; i < 5; i++) {
              if (dirty.charAt(i) === '1' || full.charAt(i) === '1' || separation.charAt(i) === '1') {
                final = setCharAt(final, i, '1')
              } else {
                final = setCharAt(final, i, '0')
              }
            }
            return final
          },
          align: 'center',
          format: (val) => {
            return val === undefined ? '--' : val
          },
          sortable: true,
          sort: (a, b) => {
            return (a.match(/1/g) || []).length - (b.match(/1/g) || []).length
          }
        },
        {
          name: 'archived',
          label: t('archived'),
          field: 'archived',
          sortable: true,
          align: 'center'
        }
      ]
    })

    const { iconBins } = useVariables()
    const customFilter = (rows) => {
      const archivedFilter = !filter.value.archived ? rows.filter(e => {
        return !e.archived
      }) : rows

      const startDateFilter = filter.value.startDate !== '' ? rows.filter(e => {
        return +e.time > Date.parse(filter.value.startDate)
      }) : archivedFilter

      const endOfDay = Date.parse(filter.value.endDate) + 86399999 // 23 hours, 59 minutes, 59seconds, 999ms
      const endDateFilter = filter.value.endDate !== '' ? startDateFilter.filter(e => {
        return +e.time < endOfDay
      }) : startDateFilter

      const problemsFilter = filter.value.problemsSelected.length > 0 ? endDateFilter.filter(e => {
        return (filter.value.problemsSelected.includes('dirty') && e.dirty !== '00000') ||
          (filter.value.problemsSelected.includes('full') && e.full !== '00000') ||
          (filter.value.problemsSelected.includes('separation') && e.separation !== '00000')
      }) : endDateFilter

      const binsFilter = filter.value.binsSelected.length > 0 ? problemsFilter.filter(e => {
        return (filter.value.binsSelected.includes('undifferentiated') && reportContainBin(e, 'undifferentiated')) ||
          (filter.value.binsSelected.includes('plastic') && reportContainBin(e, 'plastic')) ||
          (filter.value.binsSelected.includes('paper') && reportContainBin(e, 'paper')) ||
          (filter.value.binsSelected.includes('glass') && reportContainBin(e, 'glass')) ||
          (filter.value.binsSelected.includes('bio') && reportContainBin(e, 'bio'))
      }) : problemsFilter

      return filter.value.search !== '' ? binsFilter.filter(e => {
        return e.ecoIsland.id.toString().includes(filter.value.search) ||
          e.id.toString().includes(filter.value.search) ||
          formatDate(e.time).includes(filter.value.search) ||
          (reportContainBin(e, 'undifferentiated') && 'indiferenciado'.includes(filter.value.search.toLowerCase())) ||
          (reportContainBin(e, 'plastic') && 'embalagens'.includes(filter.value.search.toLowerCase())) ||
          (reportContainBin(e, 'paper') && 'papel'.includes(filter.value.search.toLowerCase())) ||
          (reportContainBin(e, 'glass') && 'vidro'.includes(filter.value.search.toLowerCase())) ||
          (reportContainBin(e, 'bio') && 'biorresiduos'.includes(filter.value.search.toLowerCase()))
      }) : binsFilter

      function reportContainBin (report, bin) {
        function containAtPosition (report, pos) {
          return report.dirty.charAt(pos) === '1' || report.separation.charAt(pos) === '1' || report.full.charAt(pos) === '1'
        }

        switch (bin) {
          case 'undifferentiated':
            return containAtPosition(report, 4)
          case 'plastic':
            return containAtPosition(report, 3)
          case 'paper':
            return containAtPosition(report, 2)
          case 'glass':
            return containAtPosition(report, 1)
          case 'bio':
            return containAtPosition(report, 0)
          default:
            return false
        }
      }
    }

    const filteredIconBin = (condition) => {
      return iconBins.filter((e) => {
        return condition.charAt(e.position) === '1'
      })
    }

    const updateFilter = (value) => {
      filter.value.endDate = value.endDate
      filter.value.startDate = value.startDate
      filter.value.problemsSelected = value.problemsSelected
      filter.value.binsSelected = value.binsSelected
    }

    onMounted(() => {
      fetch()
    })

    const fetch = () => {
      reportStore.fetchReports()
        .catch((errorMessage) => {
          notifyError(errorMessage)
        })
    }

    const downloadReports = () => {
      reportStore.downloadReports()
        .then((res) => {
          saveAs(res.data, 'reports.csv')
        })
    }

    const { formatDate } = useFunctions()

    function setCharAt (str, index, chr) {
      if (index > str.length - 1) return str
      return str.substring(0, index) + chr + str.substring(index + 1)
    }

    const openReport = (id) => {
      router.push({
        name: 'report',
        params: { reportId: id }
      })
    }

    const toggleDialog = () => {
      showDialog.value = !showDialog.value
    }

    return {
      columnsI18n,

      reportStore,
      initialPagination,
      tablesStore,

      iconBins,
      filteredIconBin,
      openReport,

      customFilter,
      updateFilter,

      toggleDialog,
      showDialog,
      filter,

      downloadReports,
      test: (a) => {
        console.log(a)
      }

    }
  }
}
</script>
