<template>
  <q-page class="flex flex-center">

    <q-card flat >
      <q-card-section>
        <img
          alt="Quasar logo"
          src="~assets/logo.png"
          style="max-width: 400px">
      </q-card-section>
      <q-card-actions class="row justify-around" >
        <q-btn
          color="primary"
          v-if="!userStore.hasAuthenticatied()"
          label="Fenix Login"
          icon="login"
          @click="router.push('/login')"
        />
        <div class="row full-width justify-around" v-else-if="userStore.hasEditPermissions()">
          <q-btn
            color="primary"
            :label="$t('ecoislands')"
            @click="router.push('/ecoislands')"
          />
          <q-btn
            color="primary"
            class="q-ml-xl"
            :label="$t('map')"
            @click="router.push('/floormap')"
          />
          <q-btn
            color="primary"
            :label="$t('alerts')"
            class="q-mx-xl"
            @click="router.push('/reports')"
          />
          <q-btn
            v-if="userStore.hasEditPermissions()"
            color="primary"
            :label="$t('questions')"
            @click="router.push('/questions')"
          >
            <q-badge v-if="count !== 0" color="orange" rounded floating> {{ count }}
            </q-badge>
          </q-btn>
        </div>
        <div v-else-if="userStore.hasAuthenticatied()">
          <q-btn
            v-if="!sent"
            :label="$t('msg_admin_request')"
            color="primary"
            icon="send"
            @click="requestPermission()"/>
          <div v-else class="text-primary text-h6">
            {{$t('msg_please_wait')}}
          </div>
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
    const sent = ref(false)

    onMounted(() => {
      LocalStorage.remove('beforePath')
      if (userStore.hasAuthenticatied() && userStore.hasEditPermissions()) {
        questionStore.countNotArchived()
          .then((res) => {
            count.value = res.data
          })
      }
    })

    const requestPermission = () => {
      sent.value = true
      userStore.addRoleRequest(userStore.getUsername())
    }

    return {
      userStore,
      router,
      questionStore,

      count,
      sent,

      requestPermission
    }
  }
})
</script>
