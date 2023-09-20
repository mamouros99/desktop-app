<template>
  <q-page class="flex flex-center">

    <q-card flat>
      <q-card-section>
        <img
          alt="Quasar logo"
          src="~assets/logo.png"
          style="max-width: 400px">
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
            label="Alertas"
            class="q-mx-xl"
            @click="router.push('/reports')"
          />
          <q-btn
            v-if="userStore.hasEditPermissions()"
            color="primary"
            label="Questões"
            @click="router.push('/questions')"
          >
            <q-badge v-if="count !== 0" color="orange" rounded floating> {{ count }}
            </q-badge>
          </q-btn>
        </div>

      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useUserStore } from 'stores/UserStore'
import { useRouter } from 'vue-router'
import { LocalStorage } from 'quasar'
import { useQuestionStore } from 'stores/QuestionStore'

export default defineComponent({
  name: 'IndexPage',

  setup () {
    const userStore = useUserStore()
    const router = useRouter()
    const questionStore = useQuestionStore()
    const count = ref(0)

    onMounted(() => {
      LocalStorage.remove('beforePath')
      if (userStore.hasAuthenticatied() && userStore.hasEditPermissions()) {
        questionStore.countNotArchived()
          .then((res) => {
            count.value = res.data
          })
      }
    })

    return {
      userStore,
      router,
      questionStore,

      count,
      test: function () {
        console.log('I\'m on a development build')
      }
    }
  }
})
</script>
