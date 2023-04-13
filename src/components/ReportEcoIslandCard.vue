<template>
  <q-card-section>
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 text-grey-7">EcoIlha {{ report.ecoisland }}</div>
        <q-list v-if="ecoIslandStore.currentEcoIsland.id !== undefined">
          <q-item class="row items-start">
            <q-item-section class="col-5">
              <q-item-label class="text-subtitle1">
                Localização
              </q-item-label>
              <q-item-section class="q-pl-md q-pt-sm">
                Edifício: {{ ecoIslandStore.currentEcoIsland.building }} <br>
                Piso: {{ ecoIslandStore.currentEcoIsland.floor }} <br>
                Descrição: {{ ecoIslandStore.currentEcoIsland.description }}
              </q-item-section>
            </q-item-section>
            <q-item-section class="col-5">
              <q-item-label class="text-subtitle1">
                Caixotes
              </q-item-label>
              <q-item-section
                class="row q-pl-md q-pt-sm items-start"
                v-for="bin in getEcoIslandBins(ecoIslandStore.currentEcoIsland.bins)"
                :key="bin.name">
                <q-icon
                  class="col"
                  name="mdi-trash-can-outline"
                  :color="bin.color"
                >
                  {{ bin.name }}
                </q-icon>

              </q-item-section>
            </q-item-section>
          </q-item>
        </q-list>
        <div
          v-else
        >

          <q-spinner
            color="primary"
          />
        </div>
      </q-card-section>
    </q-card>

  </q-card-section>
</template>
<script>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import useVariables from 'src/composables/useVariables'

export default {
  name: 'ReportEcoIslandCard',
  props: ['report'],
  setup (props) {
    const router = useRouter()
    const ecoIslandStore = useEcoIslandStore()

    const { getEcoIslandBins } = useVariables()

    onMounted(() => {
      ecoIslandStore.setEcoIslandsByID(props.report.ecoisland)
    })

    return {
      router,
      getEcoIslandBins,
      ecoIslandStore,

      test: (val) => {
        console.log('test', val)
      }
    }
  }
}
</script>
