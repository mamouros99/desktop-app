<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>

      <div class="text-h2" style="opacity:.8">
        A sua sessão terminou, por favor faça login outra vez
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        @click="reload()"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ErrorNotFound',
  setup () {
    const router = useRouter()
    const reload = () => {
      router.push({ name: 'home' })
    }
    return { reload }
  }
})
</script>
