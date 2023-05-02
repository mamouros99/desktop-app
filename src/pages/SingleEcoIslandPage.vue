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
      <div v-if="loaded">
        <q-card-section>
          <div class="text-h6">Localização</div>
          <q-card-section class="row bg-grey-1">
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
          <div class="row q-my-md bg-grey-1">

            <q-btn
              :ripple="false"
              flat
              v-for="bin in getEcoIslandBins(ecoIsland.bins)"
              :key="bin.name"
              class="col-8 col-sm-3"
              icon="mdi-trash-can-outline"
              :color="bin.color"
              :label="bin.name"
            />

          </div>
        </q-card-section>
      </div>
    </q-card>
    <q-btn
      v-if="userStore.hasEditPermissions()"
      class="glossy q-ml-lg q-mt-lg"
      rounded color="red-7"
      label="Apagar Ecoilha"
      @click="showDeleteDialog = !showDeleteDialog"
    />
    <ConfirmationDialog
      title="Tem a certeza que quer apagar a ecoilha?"
      negative-label="Apagar"
      positive-label="Cancelar"
      v-model:show-dialog="showDeleteDialog"
      @negative-function="deleteIsland()"
    />
  </q-page>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import useVariables from 'src/composables/useVariables'
import QRCodeDialog from 'components/Dialogs/QRCodeDialog.vue'
import useNotify from 'src/composables/UseNotify'
import ConfirmationDialog from 'components/Dialogs/ConfirmationDialog.vue'
import { useUserStore } from 'stores/UserStore'

export default {
  components: {
    ConfirmationDialog,
    QRCodeDialog
  },
  // name: 'PageName',

  props: {
    report: {
      default: ''
    }
  },

  setup () {
    const route = useRoute()
    const router = useRouter()
    const ecoIsland = ref()
    const loaded = ref(false)
    const ecoIslandStore = useEcoIslandStore()
    const { getEcoIslandBins } = useVariables()

    const {
      notifyError,
      notifySuccess,
      notifyWarning
    } = useNotify()

    const islandId = route.params.ecoislandId
    const showDialog = ref(false)
    const showDeleteDialog = ref(false)

    const deleteIsland = () => {
      ecoIslandStore.deleteById(islandId)
        .then(() => {
          notifySuccess('Ecoilha ' + islandId + ' foi apagada com sucesso')
          router.push('/ecoislands')
        })
        .catch((e) => {
          notifyWarning(e)
        })
    }

    onMounted(async () => {
      await ecoIslandStore.getEcoIslandsById(islandId)
        .then((response) => {
          ecoIsland.value = response.data
          loaded.value = true
        })
        .catch((errorMessage) => {
          notifyError('Error Loading Island - ' + errorMessage)
        })
    })

    return {
      router,
      islandId,
      getEcoIslandBins,
      showDialog,
      deleteIsland,
      showDeleteDialog,
      ecoIsland,
      loaded,
      userStore: useUserStore()
    }
  }
}
</script>
