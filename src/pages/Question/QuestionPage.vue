<template>
  <q-page padding>
    <q-table
      card-class="bg-grey-2"
      :columns="columnsI18n"
      :rows="questionStore.getQuestions()"
      row-key="id"
      flat bordered
      :title="$t('questions')"
      title-class="text-primary text-h4  q-pl-lg"
      :filter="filterObject"
      :filter-method="customFilter"

    >

      <template v-slot:top-right>
        <q-toggle
          :label="$t('archived')"
          left-label
          v-model="filterObject.showArchived"
        />
      </template>

      <template v-slot:body="props">
        <q-tr :props="props"
              class="bg-grey-1"
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
import { computed, onMounted, ref } from 'vue'
import { useQuestionStore } from 'stores/QuestionStore'
import useFunctions from 'src/composables/UseFunctions'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTablesStore } from 'stores/TablesStore'

export default {

  setup () {
    const { formatDateTime } = useFunctions()

    const router = useRouter()
    const questionStore = useQuestionStore()
    const filterObject = ref({ showArchived: false })
    const tablesStore = useTablesStore()

    const initialPagination = ref({ rowsPerPage: tablesStore.questionRows || 10 })

    const { t } = useI18n()

    const columnsI18n = computed(() => {
      return [
        {
          name: 'time',
          required: true,
          label: t('date'),
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
          label: t('question'),
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
          label: t('author'),
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
          label: t('archived'),
          field: row => row.archived,
          align: 'center',
          format: val => {
            return val
          },
          sortable: true
        }
      ]
    })

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
      initialPagination,
      tablesStore,

      questionStore,
      formatDateTime,
      columnsI18n,
      test: (va) => {
        console.log(va)
      },
      filterObject,
      customFilter
    }
  }
}
</script>
