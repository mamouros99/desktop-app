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
              @click="() => {
                  props.expand = !props.expand
                   test(props.expand)
              }"
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
        <q-tr v-if="props.expand" :props="props">
          <q-td colspan="100%" class="bg-grey-2">
            <q-card flat class="bg-transparent">
              <q-card-section horizontal class="justify-between">
                <div class="text-primary text-subtitle2 q-pr-lg">Resposta</div>
                <q-btn
                  v-if="props.row.answer && !props.row.archived"
                  right
                  dense
                  flat
                  icon="send"
                  color="secondary"
                  @click="submitAnswer(props.row)"
                />
                <div
                  v-else>
                  {{ props.row.answer }}
                </div>
              </q-card-section>
              <q-item-label class="q-ml-sm">
                <q-input
                  v-if="!props.row.archived"
                  label="Escreva aqui a resposta..."
                  v-model="props.row.answer"
                  type="text"
                />

              </q-item-label>
            </q-card>
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

export default {

  setup () {
    const { formatDateTime } = useFunctions()

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
        .catch(res => {
          console.log('Something went wrong')
        })
    }
    )

    const submitAnswer = async (question) => {
      await questionStore.submitAnswer(question)
    }

    const hideArchived = ref(false)

    return {
      questionStore,
      formatDateTime,
      columns,
      test: (va) => {
        console.log(va)
      },
      submitAnswer,
      hideArchived
    }
  }
}
</script>
