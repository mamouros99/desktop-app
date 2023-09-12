<template>
  <q-page padding>
    <q-table
      :columns="columns"
      :rows="questionStore.getQuestions()"
      row-key="id"
      title="Dúvidas e Questões"
      title-class="text-primary text-h4"
    >

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
          <q-td auto-width key="question" :props="props">
            <q-icon
              class="q-ml-md"
              v-if="props.row.archived"
              name="check"
              color="positive"
            />
            <q-icon
              class="q-ml-md"
              v-else
              name="pending"
              color="negative"
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
        name: 'archived',
        required: true,
        label: 'Archived',
        field: row => row.archived,
        align: 'center',
        format: val => {
          return val
        },
        sortable: true
      }
    ]

    const questionStore = useQuestionStore()
    onMounted(async () => {
      await questionStore.fetchQuestions()
        .catch(() => {
          console.log('Something went wrong')
        })
    }
    )

    const hideArchived = ref(false)

    return {
      router,

      questionStore,
      formatDateTime,
      columns,
      test: (va) => {
        console.log(va)
      },
      hideArchived
    }
  }
}
</script>
