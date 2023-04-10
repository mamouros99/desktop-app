import { useQuasar } from 'quasar'

export default function useNotify () {
  const quasar = useQuasar()

  const notifySuccess = (msg) => {
    quasar.notify({
      message: msg || 'Obrigado pela ajuda!',
      color: 'positive',
      timeout: 3000,
      icon: 'park'
    })
  }

  const notifyWarning = (msg) => {
    quasar.notify({
      message: msg,
      color: 'warning',
      timeout: 3000,
      icon: 'warning'
    })
  }

  const notifyError = (msg) => {
    quasar.notify({
      message: msg,
      location: top,
      color: 'negative',
      timeout: 3000,
      icon: 'error'
    })
  }

  return {
    notifySuccess,
    notifyError,
    notifyWarning
  }
}
