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
      })
  }

  const submitAnswer = async (answer) => {
    await api.put('/question/put', answer)
      .then((response) => {
        notification.notifySuccess('Resposta submetida com sucesso')
        fetchQuestions()
      })
      .catch(() => {
        notification.notifyError('Houve um problema na subnissão da resposta')
      })
  }

  const notification = useNotify()
  const router = useRouter()

  return {
    addNewQuestion,
    fetchQuestions,
    getQuestions,
    submitAnswer
  }
})
