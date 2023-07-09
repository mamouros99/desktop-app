<template>
  <q-page class="bg-primary">
    <q-card flat class="text-center">
      <h3 class="text-bold text-primary">Fenix Login</h3>
      <q-spinner-gears
        size="30%"
        color="grey-7"
      />
    </q-card>
  </q-page>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useUserStore } from 'stores/UserStore'
import useNotify from 'src/composables/UseNotify'
import { LocalStorage } from 'quasar'

export default {
  // name: 'PageName',

  setup () {
    const route = useRoute()
    const href = window.location.href
    const router = useRouter()
    const userStore = useUserStore()
    const {
      notifyError,
      notifySuccess
    } = useNotify()
    const code = computed(() => {
      return route.query.code
    })

    onMounted(async () => {
      if (!code.value) {
        window.location = process.env.VUE_APP_FENIX_URL + href
      } else {
        await userStore.checkAuth(code.value)
          .then(() => {
            notifySuccess('Login was Successful')
          })
          .catch((errorMessage) => {
            notifyError(errorMessage)
          })
          .finally(() => {
            if (LocalStorage.has('beforePath')) {
              const path = LocalStorage.getItem('beforePath')
              LocalStorage.remove('beforePath')
              router.push(path)
            } else {
              router.push({ name: 'home' })
            }
          })
      }
    })

    return {
      test: function () {
        console.log('user', userStore.getUser())
      },
      code,
      router

    }
  }
}
</script>
