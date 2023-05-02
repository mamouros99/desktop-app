import { useUserStore } from 'stores/UserStore'

export default function useFunctions () {
  function isStringInteger (str) {
    if (typeof str !== 'string') {
      return false
    }
    return Number.isInteger(+str)
  }

  const userStore = useUserStore()

  const isAuth = () => {
    return userStore.hasAuthenticatied()
  }
  const formatDateTime = (stringDate) => {
    // receives string
    const date = new Date(parseInt(stringDate))

    return (
      formatDate(stringDate) +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds())
      ].join(':')
    )

    function padTo2Digits (num) {
      return num.toString().padStart(2, '0')
    }
  }

  const formatDate = (stringDate) => {
    // receives string
    const date = new Date(parseInt(stringDate))

    return (
      [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear()
      ].join('/')
    )

    function padTo2Digits (num) {
      return num.toString().padStart(2, '0')
    }
  }

  return {
    isStringInteger,
    formatDateTime,
    formatDate,
    isAuth
  }
}
