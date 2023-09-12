<template>
  <q-page padding>
    <q-card flat v-if="question" class="">
      <q-card-section class="text-h4">
        <q-btn
          flat
          icon="arrow_back"
          @click="router.push('/questions')"
        />
        {{ question.question }}
      </q-card-section>
      <q-separator/>
      <q-card-section>
        <q-chat-message
          :text="[question.question]"
          :stamp="functions.formatDateTime(question.time)"
        />

        <q-chat-message
          v-for="q in question.answers"
          :key="q.id"
          :text="[q.text]"
          :sent="q.fromApp"
          :stamp="functions.formatDateTime(q.time)"
        />
      </q-card-section>
      <q-card-section v-if="!question.archived" horizontal class="justify-end q-mr-sm ">
        <div class="row items-center justify-start col ">
          <q-btn
            icon="save"
            label="Arquivar"
            color="warning"
            @click="archiveQuestion()"
            dense
            rounded
            unelevated
            class="q-pa-sm q-ml-md"
          />
        </div>
        <div class="row items-center">
          <q-btn
            flat
            round
            dense
            class="q-mx-md"
            color="primary"
            icon="send"
            @click="() => {addAnswer()
            newAnswer = ''
          }"
          />
        </div>
        <q-input
          placeholder="Nova Mensagem..."
          color="secondary"
          class="q-my-md"
          style="width: 70%"
          v-model="newAnswer"
          type="text"
          rounded
          dense
          outlined
        />
      </q-card-section>
      <q-card-section v-else>
        Este chat foi arquivado.
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useQuestionStore } from 'stores/QuestionStore'
import useFunctions from 'src/composables/UseFunctions'

export default {
  // name: 'PageName',
  setup () {
    const route = useRoute()
    const router = useRouter()
    const id = route.params.questionId
    const question = ref()
    const questionStore = useQuestionStore()
    const newAnswer = ref('')
    const functions = useFunctions()

    const addAnswer = async () => {
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

    const fetch = () => {
      questionStore.fetchQuestionById(id)
        .then((result) => {
          question.value = result.data
        })
    }

    return {
      addAnswer,
      archiveQuestion,

      functions,
      question,
      id,
      newAnswer,

      router
    }
  }
}
</script>
