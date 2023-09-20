<template>
  <q-page padding>
    <q-card flat v-if="question" class="">
      <q-card-section class="text-h4 q-py-md justify-between" horizontal>
        <div>
          <q-btn
            flat
            icon="arrow_back"
            @click="router.push('/questions')"
          />
          {{ question.user.username }} - {{ formatDate(question.time) }}
        </div>
        <q-btn
          unelevated
          label="Apagar"
          color="negative"
          icon-right="delete"
          rounded
          class="q-mr-md"
          @click="deleteDialogToggle = ! deleteDialogToggle"
        />
        <ConfirmationDialog
          title="Tem a certeza que quer apagar a Pergunta"
          negative-label="Apagar"
          negative-icon="delete"
          positive-label="Cancelar"
          v-model:show-dialog="deleteDialogToggle"
          @negative-function="deleteQuestion()"
        />
      </q-card-section>
      <q-separator/>
      <q-card-section>
        <q-chat-message
          :text="[question.question]"
          :stamp="formatDateTime(question.time)"
        />

        <q-chat-message
          v-for="q in question.answers"
          :key="q.id"
          :text="[q.text]"
          :sent="q.fromApp"
          :stamp="formatDateTime(q.time)"
        />
      </q-card-section>
      <q-separator/>
      <q-card-section horizontal class="justify-between q-mr-sm row">
        <div class="row items-center col-3">
          <q-btn
            icon="save"
            :label="question.archived? 'Desarquivar' : 'Arquivar'"
            color="warning"
            @click="question.archived? unarchiveQuestion() : archiveQuestion()"
            dense
            rounded
            unelevated
            class="q-pa-sm q-ml-md"
          />
        </div>
        <div v-if="!question.showQuestion" class="row items-center">
          Esta mensagem foi apagado pelo autor
        </div>
        <div
          v-else-if="!question.archived"
          class="row col-9 "
        >
          <div
            class="row full-width  items-center">
            <q-btn
              flat
              round
              dense
              class="q-mx-md col-2"
              color="primary"
              icon="send"
              @click="() => {addAnswer()
            newAnswer = ''
          }"
            />
            <q-input
              placeholder="Nova Mensagem..."
              color="secondary"
              class="q-my-md col-9"

              v-model="newAnswer"
              type="text"
              rounded
              dense
              outlined
            />
          </div>

        </div>

        <q-card-section v-else>
          Este chat foi arquivado.
        </q-card-section>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useQuestionStore } from 'stores/QuestionStore'
import useFunctions from 'src/composables/UseFunctions'
import ConfirmationDialog from 'components/Dialogs/ConfirmationDialog.vue'

export default {
  components: { ConfirmationDialog },
  // name: 'PageName',
  setup () {
    const route = useRoute()
    const router = useRouter()
    const questionStore = useQuestionStore()
    const {
      formatDateTime,
      formatDate
    } = useFunctions()

    const id = route.params.questionId
    const question = ref()
    const newAnswer = ref('')
    const deleteDialogToggle = ref(false)

    const addAnswer = async () => {
      if (!newAnswer.value) {
        return
      }

      const auxAnswer = {
        text: newAnswer.value,
        fromApp: true,
        time: Date.now()
      }

      await questionStore.addNewAnswer(auxAnswer, id)
      fetch()
    }
    onMounted(async () => {
      await fetch()
    })

    const archiveQuestion = async () => {
      await questionStore.archiveQuestion(id)
      fetch()
    }

    const unarchiveQuestion = async () => {
      await questionStore.unarchiveQuestion(id)
      fetch()
    }

    const deleteQuestion = async () => {
      await questionStore.deleteQuestion(id)
      await router.push('/questions')
    }

    const fetch = () => {
      questionStore.fetchQuestionById(id)
        .then((result) => {
          question.value = result.data
        })
    }

    return {
      addAnswer,
      archiveQuestion,
      unarchiveQuestion,

      formatDate,
      formatDateTime,
      question,
      id,

      newAnswer,
      deleteQuestion,
      router,

      deleteDialogToggle
    }
  }
}
</script>
