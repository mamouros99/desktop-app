<template>
  <q-page class="flex flex-center">

    <q-card flat>
      <q-card-section>
        <img
          alt="Quasar logo"
          src="~assets/ecologo.png"
          style="max-width: 300px">
      </q-card-section>
      <q-card-actions class="row justify-around">
        <q-btn
          color="primary"
          v-if="!userStore.hasAuthenticatied()"
          label="Fenix Login"
          icon="login"
          @click="router.push('/login')"
        />
        <div v-else class="row full-width justify-around">
          <q-btn
            color="primary"
            label="Ecoílhas"
            @click="router.push('/ecoislands')"
          />
          <q-btn
            color="primary"
            label="Relatórios"
            @click="router.push('/reports')"
          />
        </div>

      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useUserStore } from 'stores/UserStore'
import { useRouter } from 'vue-router'
import { LocalStorage } from 'quasar'

export default defineComponent({
  name: 'IndexPage',

  setup () {
    const userStore = useUserStore()
    const router = useRouter()

    onMounted(() => {
      LocalStorage.remove('beforePath')
    })

    return {
      userStore,
      router,
      test: function () {
        console.log('I\'m on a development build')
      }
    }
  }
})
</script>
