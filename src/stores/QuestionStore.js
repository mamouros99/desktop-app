import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import useNotify from 'src/composables/UseNotify'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export const useQuestionStore = defineStore('QuestionStore', () => {
  const questions = ref([])

  const getQuestions = () => {
    return questions.value
  }
  const addNewQuestion = async (question) => {
    console.log(question)

    return await api
      .post('question/add', question)
      .then(() => {
        notification.notifySuccess('Pergunta foi gravado com sucesso')
        router.push({ name: 'home' })
      })
      .catch(() => {
        notification.notifyError()
      })
  }

  const fetchQuestions = async () => {
    await api.get('/question/get/all')
      .then((response) => {
        questions.value = response.data
        console.log(questions.value)
      })
  }

  const fetchQuestionById = async (id) => {
    return await api.get('/question/get/' + id)
  }

  const archiveQuestion = async (id) => {
    await api.put('/question/archive/' + id)
  }

  const addNewAnswer = async (answer, questionId) => {
    console.log(questionId, '-', answer)

    return await api.post('/question/answer/' + questionId, answer)
      .then(() => {
        notification.notifySuccess('Mensagem foi enviada com sucesso')
      })
      .catch(() => {
        notification.notifyError()
      })
  }

  const notification = useNotify()
  const router = useRouter()

  return {
    addNewQuestion,
    archiveQuestion,
    fetchQuestions,
    getQuestions,

    addNewAnswer,

    fetchQuestionById
  }
})
