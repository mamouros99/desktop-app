<template>
  <q-page padding>
    <q-btn
      flat
      color="primary"
      label="Back"
      icon="arrow_back"
      class="q-ma-md"
      @click="router.push('/reports')"
    />
    <q-card flat bordered class="bg-grey-2">
      <q-card-section class="row justify-between items-center">
        <div class="text-h4  text-grey-9">Relatório ID {{ reportId }}</div>
        <div class="q-pr-md text-h5  text-grey-8" v-if="loaded"> {{ formatDateTime(report.time) }}</div>
      </q-card-section>
      <div class="q-ml-lg text-subtitle2 text-grey-7" style="cursor: pointer; display: inline-block" v-if="loaded">
        <div @click="router.push('/ecoisland/' + report.ecoIsland.id)">
          Ecoílha {{ report.ecoIsland.id + ' - ' }}
          {{ report.ecoIsland.building + ',' }}
          {{ report.ecoIsland.floor + ',' }}
          {{ report.ecoIsland.description }}
        </div>
      </div>
      <q-card-section>
        <q-card flat bordered v-if="loaded">
          <q-table
            v-if="getInfoReport(report).length > 0"
            :rows="getInfoReport(report)"
            :columns="columns"
            row-key="name"
            :pagination="{
              page: 1,
              rowsPerPage: 0
            }"
            :hide-pagination="true"
          >

            <template v-slot:header="props">
              <q-tr :props="props" class="bg-teal-3">
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
              <q-tr :props="props">
                <q-td
                  class="text-center"
                >
                  <div
                    v-for="bin in props.cols.filter(e => e.name === 'bin')"
                    :key="bin.name">
                    {{ bin.value }}
                    <q-icon
                      name="mdi-trash-can-outline"
                      :color="props.row.color"
                    />
                  </div>

                </q-td>
                <q-td
                  v-for="col in props.cols.filter(e => e.name !== 'bin')"
                  :key="col.name"
                  :props="props"
                >
                  <q-icon
                    v-if="col.value"
                    name="cancel"
                    color="primary"
                  />
                  <div v-else>
                    -
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
        <q-card v-else>
          <q-spinner
            color="primary"
            size="3em"
          />
        </q-card>
      </q-card-section>
      <q-card-section
        v-if="loaded"
      >
        <q-card
          flat
          bordered
          v-if="report.message"
        >
          <q-card-section class="bg-teal-3 text-subtitle2">
            Observações
          </q-card-section>
          <q-card-section>
            {{ report.message }}
          </q-card-section>

        </q-card>
      </q-card-section>
    </q-card>
    <q-btn
      v-if="userStore.hasEditPermissions()"
      class="q-ml-lg q-mt-lg"
      rounded color="red-7"
      label="Apagar Relatório"
      @click="showDeleteDialog = !showDeleteDialog"
    />
    <ConfirmationDialog
      title="Tem a certeza que quer apagar o relatório?"
      negative-label="Apagar"
      positive-label="Cancelar"
      v-model:show-dialog="showDeleteDialog"
      @negative-function="deleteReport()"
    />
  </q-page>
</template>

<script>

import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useReportStore } from 'stores/ReportStore'
import useFunctions from 'src/composables/UseFunctions'
import useNotify from 'src/composables/UseNotify'
import ConfirmationDialog from 'components/Dialogs/ConfirmationDialog.vue'
import { useUserStore } from 'stores/UserStore'

export default {
  components: { ConfirmationDialog },
  // name: 'PageName',
  props: [],
  setup () {
    const route = useRoute()
    const router = useRouter()

    const {
      notifyError,
      notifySuccess,
      notifyWarning
    } = useNotify()
    const reportStore = useReportStore()
    const { formatDateTime } = useFunctions()

    const reportId = route.params.reportId

    const report = ref()
    const loaded = ref(false)
    const showDeleteDialog = ref(false)

    const deleteReport = () => {
      reportStore.deleteById(reportId)
        .then(() => {
          notifySuccess('Report ' + reportId + ' foi apagada com sucesso')
          router.push('/reports')
        })
        .catch((e) => {
          notifyWarning(e)
        })
    }

    const columns = [
      {
        name: 'bin',
        required: true,
        label: 'Caixote',
        field: row => row.name,
        align: 'center'
      },
      {
        name: 'dirty',
        required: true,
        label: 'Sujo',
        field: row => row.problems.dirty,
        align: 'center'
      },
      {
        name: 'full',
        required: true,
        label: 'Cheio',
        field: row => row.problems.full,
        align: 'center'
      },
      {
        name: 'separation',
        required: true,
        label: 'Má Separação',
        field: row => {
          return row.problems.separation
        },
        align: 'center'
      }
    ]
    const getInfoReport = (report) => {
      const result = [
        {
          name: 'Indiferenciado',
          color: 'black',
          problems: {
            dirty: 0,
            full: 0,
            separation: 0
          },
          pos: 4
        },
        {
          name: 'Embalagens',
          color: 'yellow-8',
          problems: {
            dirty: 0,
            full: 0,
            separation: 0
          },
          pos: 3
        },
        {
          name: 'Papel',
          color: 'blue-7',
          problems: {
            dirty: 0,
            full: 0,
            separation: 0
          },
          pos: 2
        },
        {
          name: 'Vidro',
          color: 'green-6',
          problems: {
            dirty: 0,
            full: 0,
            separation: 0
          },
          pos: 1
        },
        {
          name: 'Biorresiduos',
          color: 'brown-5',
          problems: {
            dirty: 0,
            full: 0,
            separation: 0
          },
          pos: 0
        }
      ]

      for (const bin of result) {
        if (report.dirty.charAt(bin.pos) === '1') {
          bin.problems.dirty = 1
        }
        if (report.separation.charAt(bin.pos) === '1') {
          bin.problems.separation = 1
        }
        if (report.full.charAt(bin.pos) === '1') {
          bin.problems.full = 1
        }
      }

      return result.filter((e) => {
        return e.problems.dirty || e.problems.full || e.problems.separation
      })
    }

    onMounted(async () => {
      await reportStore.getReportById(reportId)
        .then((response) => {
          report.value = response.data
          loaded.value = true
        })
        .catch((error) => {
          notifyError('Error Loading Report' + error)
        })
    })

    return {
      reportId,
      router,
      report,
      reportStore,
      getInfoReport,
      formatDateTime,
      columns,
      loaded,
      showDeleteDialog,
      deleteReport,
      userStore: useUserStore()
    }
  }
}
</script>
