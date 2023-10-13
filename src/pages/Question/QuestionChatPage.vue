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
          {{ question.user.name }} - {{ formatDate(question.time) }}
        </div>
        <q-btn
          unelevated
          :label="$t('delete')"
          color="negative"
          icon-right="delete"
          rounded
          class="q-mr-md"
          @click="deleteDialogToggle = ! deleteDialogToggle"
        />
        <ConfirmationDialog
          :title="$t('msg_delete_question')"
          :negative-label="$t('delete')"
          negative-icon="delete"
          :positive-label="$t('cancel')"
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
          :name="q.author"
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
            :label="question.archived? $t('unarchive') : $t('archive')"
            color="warning"
            @click="question.archived? unarchiveQuestion() : archiveQuestion()"
            dense
            rounded
            unelevated
            class="q-pa-sm q-ml-md"
          />
        </div>
        <div v-if="!question.showQuestion" class="row items-center">
          {{ $t('msg_deleted') }}
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
          {{ $t('msg_archived') }}
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
import { useUserStore } from 'stores/UserStore'

export default {
  components: { ConfirmationDialog },
  // name: 'PageName',
  setup () {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
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
        time: Date.now(),
        author: userStore.getFirstName() + ' ' + userStore.getLastName() + ' - ' + userStore.getUsername()
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
      userStore,

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
