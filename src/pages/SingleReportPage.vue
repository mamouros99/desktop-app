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
          <q-card-section>

            <q-list>
              <q-item-label class="text-h6 text-grey-7">
                Caixotes
              </q-item-label>
              <q-item v-for="bin in getInfoReport(report)" :key="bin.name">
                <q-item-section>
                  <div>
                    <em>{{ bin.name }}</em>
                    <q-icon
                      class="q-pl-sm"
                      name="mdi-trash-can-outline"
                      :color="bin.color"
                    />
                  </div>
                  - {{ bin.problems }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
        <q-card v-else

        >
          <q-spinner
            color="primary"
            size="3em"
          />
        </q-card>
      </q-card-section>
      <q-card-section>
        <q-card flat bordered v-if="report !== undefined">
          <q-card-section>
            EcoIlha {{ report.ecoIsland }}
          </q-card-section>
        </q-card>
        <q-card v-else

        >
          <q-spinner
            color="primary"
            size="3em"
          />
        </q-card>

      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>

import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import { useReportStore } from 'stores/ReportStore'
import useFunctions from 'src/composables/UseFunctions'

export default {
  // name: 'PageName',
  props: [],
  setup () {
    const route = useRoute()
    const router = useRouter()

    const ecoIslandStore = useEcoIslandStore()
    const reportStore = useReportStore()
    const { formatDate } = useFunctions()

    const reportId = route.params.reportId

    const getInfoReport = (report) => {
      const result = [
        {
          name: 'Indiferenciado',
          color: 'black',
          problems: '',
          pos: 4
        },
        {
          name: 'Embalagens',
          color: 'yellow-8',
          problems: '',
          pos: 3
        },
        {
          name: 'Papel',
          color: 'blue-7',
          problems: '',
          pos: 2
        },
        {
          name: 'Plástico',
          color: 'green-6',
          problems: '',
          pos: 1
        },
        {
          name: 'Biorresiduos',
          color: 'brown-5',
          problems: '',
          pos: 0
        }
      ]

      for (const bin of result) {
        if (report.dirty.charAt(bin.pos) === '1') {
          bin.problems = bin.problems + 'Sujo '
        }
        if (report.separation.charAt(bin.pos) === '1') {
          bin.problems = bin.problems + 'Má Separação '
        }
        if (report.full.charAt(bin.pos) === '1') {
          bin.problems = bin.problems + 'Cheio '
        }
      }

      console.log('result', result)

      return result.filter(e => e.problems.length > 0)
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
      formatDate
    }
  }
}
</script>
