<template>
  <q-page padding>
    <q-btn
      color="primary"
      label="Back"
      icon="arrow_back"
      class="q-ma-md"
      @click="router.push('/reports')"
    />
    <q-card flat bordered class="bg-grey-2">
      <q-card-section class="row justify-between items-center">
        <div class="text-h4  text-grey-9">Relatório ID {{ reportId }}</div>
        <div class="q-pr-md text-h5  text-grey-8" v-if="report !== undefined"> {{ formatDate(report.time) }}</div>
      </q-card-section>
      <q-card-section>
        <q-card flat bordered v-if="report !== undefined">
          <q-table
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
      <EcoIslandCard v-if="report !== undefined" :report="report"/>
      <q-card v-else>
        <q-spinner
          color="primary"
          size="3em"
        />
      </q-card>
    </q-card>
  </q-page>
</template>

<script>

import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import { useReportStore } from 'stores/ReportStore'
import useFunctions from 'src/composables/UseFunctions'
import EcoIslandCard from 'components/ReportEcoIslandCard.vue'

export default {
  components: { EcoIslandCard },
  // name: 'PageName',
  props: [],
  setup () {
    const route = useRoute()
    const router = useRouter()

    const ecoIslandStore = useEcoIslandStore()
    const reportStore = useReportStore()
    const { formatDate } = useFunctions()

    const reportId = route.params.reportId

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
          console.log('row', row)
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

    onMounted(() => {
      reportStore.fetchReports()
    })

    return {
      reportId,
      router,
      report: computed(() => {
        return reportStore.getReportById(reportId)
      }),
      reportStore,
      ecoIslandStore,
      getInfoReport,
      formatDate,
      columns
    }
  }
}
</script>
