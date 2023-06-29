import { useQuasar } from 'quasar'

export default function useNotify () {
  const quasar = useQuasar()

  const notifySuccess = (msg, position) => {
    quasar.notify({
      message: msg || 'Obrigado pela ajuda!',
      color: 'positive',
      timeout: 5000,
      position: position || 'bottom',
      icon: 'park'
    })
  }

  const notifyWarning = (msg, position) => {
    quasar.notify({
      message: msg,
      color: 'warning',
      timeout: 5000,
      position: position || 'bottom',
      icon: 'warning'
    })
  }

  const notifyError = (msg) => {
    quasar.notify({
      message: msg,
      position: 'top',
      color: 'negative',
      timeout: 5000,
      icon: 'error'
    })
  }

  return {
    notifySuccess,
    notifyError,
    notifyWarning
  }
}
