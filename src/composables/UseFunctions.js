export default function useFunctions () {
  function isStringInteger (str) {
    if (typeof str !== 'string') {
      return false
    }
    return Number.isInteger(+str)
  }

  const formatDate = (stringDate) => {
    // receives string
    const date = new Date(parseInt(stringDate))

    return (
      [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear()
      ].join('/') +
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

  return {
    isStringInteger,
    formatDate
  }
}
