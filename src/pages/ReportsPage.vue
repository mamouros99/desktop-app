<template>
  <q-page class="q-pa-md">
    <q-table
      card-class="bg-grey-2"
      flat bordered
      title="Relatórios"
      :rows="reportStore.getReports()"
      :columns="columns"
      row-key="id"
    >

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
        <q-tr :props="props" @click="openReport(props.row.id)">
          <q-td
            v-for="col in props.cols.filter(e => e.name !== 'caixotes')"
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
          </q-td>
        </q-tr>
      </template>

    </q-table>

    <q-card flat bordered class="q-mt-lg bg-grey-2" style="">
      <q-card-section class="q-pl-lg text-grey-8">
        Legenda Caixotes:
      </q-card-section>
      <q-separator/>
      <q-card-section class="q-pt-sm" horizontal>
        <q-list
          v-for="bin in iconBins"
          :key="bin.name"
          class="row justify-around"
        >
          <q-item
            class="col-2 items-center"
          >
            <q-icon
              class="q-pr-sm"
              name="mdi-trash-can-outline"
              size="sm"
              :color="bin.color"
            />

            <div>
              {{ bin.name }}
            </div>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { onMounted } from 'vue'
import { useReportStore } from 'stores/ReportStore'
import { useRouter } from 'vue-router'
import useFunctions from 'src/composables/UseFunctions'

export default {
  setup () {
    const reportStore = useReportStore()
    const router = useRouter()

    const columns = [
      {
        name: 'id',
        label: 'ID',
        field: 'id',
        sortable: true
      },
      {
        name: 'ecoisland',
        label: 'Island ID',
        field: 'ecoIsland',
        sortable: true,
        align: 'center',
        format: (val) => {
          return val === undefined ? '--' : val
        }
      },
      {
        name: 'time',
        label: 'Date',
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
        label: 'Caixotes Problemáticos',
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
        }
      }
    ]

    const iconBins = [
      {
        color: 'black',
        position: '4',
        name: 'Indiferenciado'
      },
      {
        color: 'yellow-8',
        position: '3',
        name: 'Embalagens'
      },
      {
        color: 'blue-7',
        position: '2',
        name: 'Papel'
      },
      {
        color: 'green-6',
        position: '1',
        name: 'Vidro'
      },
      {
        color: 'brown-5',
        position: '0',
        name: 'Biorresíduos'
      }
    ]

    const filteredIconBin = (condition) => {
      return iconBins.filter((e) => {
        return condition.charAt(e.position) === '1'
      })
    }

    onMounted(() => {
      reportStore.fetchReports()
    })

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

    return {
      columns,
      reportStore,
      iconBins,
      filteredIconBin,
      openReport

    }
  }
}
</script>
