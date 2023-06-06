<template>
  <q-page>
    <canvas ref="c"></canvas>
  </q-page>
</template>

<script>
import { onMounted, ref } from 'vue'

export default {
  name: 'ImagePage',
  setup () {
    const c = ref(null)
    onMounted(() => {
      console.log(c)
    })
    return {
      c
    }
  }
}
</script>

<style scoped>

</style>
