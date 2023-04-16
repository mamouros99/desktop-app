<template>
  <q-page padding>
    <q-btn
      flat
      color="primary"
      label="Back"
      icon="arrow_back"
      class="q-ma-md"
      @click="router.push('/ecoislands')"
    />
    <q-card>
      <q-card-section class="row justify-between items-center">
        <div class="text-h4  text-grey-9">EcoIlha ID {{ islandId }}</div>
        <q-btn
          rounded
          color="secondary"
          @click="showDialog = true"
        >
          <q-icon
            class="q-mr-sm"
            name="qr_code"
          />
          Gerar QR Code
        </q-btn>

        <QRCodeDialog v-model:show-dialog="showDialog" :islandid="islandId"/>
      </q-card-section>
      <div v-if="ecoIsland !== undefined">
        <q-card-section>
          <div class="text-h6">Localização</div>
          <q-card-section class="row">
            <div class="col-4">
              <b>Edifício</b>: {{ ecoIsland.building }}
            </div>
            <div class="col-2">
              <b>Piso</b>: {{ ecoIsland.floor }}
            </div>
            <div class="col-6">
              <b>Descrição</b>: {{ ecoIsland.description }}
            </div>
          </q-card-section>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">Caixotes</div>
          <div class="row q-my-md">

            <q-btn
              :ripple="false"
              flat
              v-for="bin in getEcoIslandBins(ecoIsland.bins)"
              :key="bin.name"
              class="col-2"
              icon="mdi-trash-can-outline"
              :color="bin.color"
              :label="bin.name"
            />

          </div>
        </q-card-section>
      </div>

    </q-card>
  </q-page>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import useVariables from 'src/composables/useVariables'
import QRCodeDialog from 'components/Dialogs/QRCodeDialog.vue'

export default {
  components: { QRCodeDialog },
  // name: 'PageName',

  props: {
    report: {
      default: ''
    }
  },

  setup (props) {
    const route = useRoute()
    const router = useRouter()
    const ecoIslandStore = useEcoIslandStore()
    const { getEcoIslandBins } = useVariables()

    const islandId = route.params.ecoislandId
    const showDialog = ref(false)

    onMounted(() => {
      if (props.report === '') {
        ecoIslandStore.fetchEcoIslands()
      }
    })

    return {
      router,
      islandId,
      ecoIsland: computed(() => {
        return ecoIslandStore.getEcoIslandsById(islandId)
      }),
      getEcoIslandBins,
      showDialog
    }
  }
}
</script>
