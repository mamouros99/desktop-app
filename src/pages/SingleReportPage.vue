<template>
  <q-page padding>
    <q-btn
      label="Back"
      icon="arrow"
      class="q-ma-md"
    />
    <q-card flat bordered class="bg-grey-2">
      <q-card-section class="text-h4  text-grey-9">
        Relatório ID {{ reportId }}
      </q-card-section>
      <q-card-section>
        <q-card flat bordered>
          <q-card-section>
            Caixotes
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>

import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'

export default {
  // name: 'PageName',
  props: [],
  setup () {
    const route = useRoute()
    const ecoIslandStore = useEcoIslandStore()
    const ecoIsland = ref({})
    const reportId = route.params.reportId

    onMounted(() => {
      ecoIsland.value = ecoIslandStore.getEcoIslandsById(reportId)
    })

    return {
      reportId
    }
  }
}
</script>
