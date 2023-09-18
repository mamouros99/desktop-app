<template>
  <q-page padding>
    <q-table
      :columns="columns"
      :rows="questionStore.getQuestions()"
      row-key="id"
      title="Dúvidas e Questões"
      title-class="text-primary text-h4"
      :filter="filterObject"
      :filter-method="customFilter"
      :rows-per-page-options="[10,20,0]"
    >

      <template v-slot:top-right>
        <q-toggle
          label="Arquivados"
          left-label
          v-model="filterObject.showArchived"
        />
      </template>

      <template v-slot:body="props">
        <q-tr :props="props"
              @click="router.push('/question/' + props.row.id) "
        >
          <q-td auto-width key="question" :props="props">
            {{ formatDateTime(props.row.time) }}
          </q-td>
          <q-td key="question" :props="props">
            {{ props.row.question }}
          </q-td>
          <q-td key="question" :props="props">
            {{ props.row.user.username }}
          </q-td>
          <q-td auto-width key="question" :props="props">
            <q-icon
              class="q-ml-md"
              v-if="props.row.archived"
              name="lock"
              color="warning"
            />
            <q-icon
              class="q-ml-md"
              v-else
              name="pending"
              color="positive"
            />

          </q-td>
        </q-tr>

      </template>

    </q-table>
  </q-page>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useQuestionStore } from 'stores/QuestionStore'
import useFunctions from 'src/composables/UseFunctions'
import { useRouter } from 'vue-router'

export default {

  setup () {
    const { formatDateTime } = useFunctions()

    const router = useRouter()
    const questionStore = useQuestionStore()
    const filterObject = ref({ showArchived: false })

    const columns = [
      {
        name: 'time',
        required: true,
        label: 'Data',
        field: row => row.time,
        align: 'left',

        format: val => {
          return formatDateTime(val)
        },
        sortable: true
      },
      {
        name: 'question',
        required: true,
        label: 'Pergunta',
        align: 'left',
        field: row => row.question,
        format: val => {
          return val
        },
        sortable: true
      },
      {
        name: 'user',
        required: true,
        label: 'Autor',
        field: row => row.user.username,
        align: 'left',
        format: val => {
          return val
        },
        sortable: true
      },
      {
        name: 'archived',
        required: true,
        label: 'Arquivados',
        field: row => row.archived,
        align: 'center',
        format: val => {
          return val
        },
        sortable: true
      }
    ]

    const customFilter = (rows) => {
      if (!filterObject.value.showArchived) {
        return rows.filter(e => !e.archived)
      } else {
        return rows
      }
    }

    onMounted(async () => {
      await questionStore.fetchQuestions()
        .catch(() => {
          console.log('Something went wrong')
        })
    }
    )

    return {
      router,

      questionStore,
      formatDateTime,
      columns,
      test: (va) => {
        console.log(va)
      },
      filterObject,
      customFilter
    }
  }
}
</script>
