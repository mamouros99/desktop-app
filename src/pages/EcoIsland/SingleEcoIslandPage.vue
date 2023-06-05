<template>
  <q-page padding>
    <q-btn
      flat
      color="primary"
      label="Back"
      icon="arrow_back"
      class="q-ma-md"
      @click="router.go(-1)"
    />
    <q-card>
      <q-card-section class="row justify-between items-center">
        <div class="text-h4  text-grey-9 row">
          EcoIlha ID {{ islandId }}
          <div v-if="loaded">
            <q-btn
              v-if="ecoIsland.buildingId !== '-'"
              color="primary"
              dense
              flat
              icon="image"
              @click="showDialogImage = true"
            />
            <EcoislandImageDialog v-if="showDialogImage" v-model:show-dialog="showDialogImage"
                                  :islandid="ecoIsland.buildingId"/>
          </div>
        </div>
        <q-btn
          rounded
          color="secondary"
          @click="showDialogQR = true"
        >
          <q-icon
            class="q-mr-sm"
            name="qr_code"
          />
          Gerar QR Code
        </q-btn>

        <QRCodeDialog v-model:show-dialog="showDialogQR" :islandid="islandId"/>
      </q-card-section>
      <div v-if="loaded">
        <q-card-section>
          <div class="text-h6">Localização</div>
          <q-card-section class="row bg-grey-1 items-center">
            <div class="col-4 row">
              <div class="text-bold q-mr-sm">Edifício:</div>
              <div>
                {{ ecoIsland.building }}
              </div>
            </div>
            <div class="col-2 row items-center">
              <div class="text-bold q-mr-sm">Piso:</div>
              {{ ecoIsland.floor }}

            </div>
            <div class="col-6 row items-center">
              <div class="text-bold q-mr-sm">Descrição:</div>
              <q-input
                borderless
                dense
                v-model="ecoIsland.description"
                @update:modelValue="hasChanges = true"
              />
            </div>
          </q-card-section>
        </q-card-section>
        <q-card-section class="col-12">
          <div class="row">
            <div class="text-h6">Caixotes</div>
            <q-btn flat dense color="primary" class="text-italic" label="edit"
                   @click="binsDialogToggle = !binsDialogToggle"/>
            <BinsEditDialog :bins="ecoIsland.bins" @updateBins="a => {
              if(ecoIsland.bins !== a){
                hasChanges = true
                ecoIsland.bins = a
              }

            } " v-model:show-dialog="binsDialogToggle"/>
          </div>
          <q-card-section class="row q-my-md bg-grey-1">
            <q-btn
              :ripple="false"
              flat
              v-for="bin in getEcoIslandBins(ecoIsland.bins)"
              :key="bin.name"
              :class="colSizeFromBins"
              icon="mdi-trash-can-outline"
              :color="bin.color"
              :label="bin.name"
              @click="binsDialogToggle = !binsDialogToggle"
            />

          </q-card-section>
        </q-card-section>
        <q-card-actions class="justify-end q-mr-lg q-pb-md" v-if="hasChanges">
          <q-btn dense color="positive" label="Save" @click="updateEcoisland"/>
          <q-btn dense color="negative" label="Reset" @click="() => {
            ecoIsland = Object.assign({}, currentEcoIsland)
            hasChanges = false
          }"/>
        </q-card-actions>
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
import { computed, onMounted, ref } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import useVariables from 'src/composables/useVariables'
import QRCodeDialog from 'components/Dialogs/QRCodeDialog.vue'
import useNotify from 'src/composables/UseNotify'
import ConfirmationDialog from 'components/Dialogs/ConfirmationDialog.vue'
import { useUserStore } from 'stores/UserStore'
import BinsEditDialog from 'components/Dialogs/BinsEditDialog.vue'
import EcoislandImageDialog from 'components/Dialogs/EcoislandImageDialog.vue'

export default {
  components: {
    EcoislandImageDialog,
    BinsEditDialog,
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
    const currentEcoIsland = ref()
    const loaded = ref(false)
    const ecoIslandStore = useEcoIslandStore()
    const { getEcoIslandBins } = useVariables()
    const binsDialogToggle = ref(false)
    const hasChanges = ref(false)

    const {
      notifyError,
      notifySuccess,
      notifyWarning
    } = useNotify()

    const islandId = route.params.ecoislandId
    const showDialogQR = ref(false)
    const showDialogImage = ref(false)
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

    const updateEcoisland = () => {
      ecoIslandStore.updateEcoIsland(ecoIsland.value)
        .then(() => {
          hasChanges.value = false
          notifySuccess('Ecoilha ' + islandId + ' foi atualizada com sucesso')
        })
    }

    onMounted(async () => {
      await ecoIslandStore.getEcoIslandsById(islandId)
        .then((response) => {
          ecoIsland.value = response.data
          loaded.value = true
          currentEcoIsland.value = Object.assign({}, response.data)
        })
        .catch((errorMessage) => {
          notifyError('Error Loading Island - ' + errorMessage)
        })
    })

    const buildingOptions = [
      'Pavilhão de Civil',
      'Pavilhão de Mecânica I'
    ]

    const buildingFloors = (building) => {
      switch (building.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) {
        case 'Pavilhao de Civil':
          return ['-3', '-2', '-1', ' 0', '1', ' 2', ' 3 ', '4']
        case 'Pavilhao de Mecânica I':
          return ['1', '2', '3']
        default:
          return ['0']
      }
    }

    const colSizeFromBins = computed(() => {
      let a
      switch (ecoIsland.value.bins) {
        case '11':
          a = 'col-2'
          break
        case '10':
        case '01':
          a = 'col-3'
          break
        default:
          // eslint-disable-next-line no-unused-vars
          a = 'col-4'
      }
      return [a]
    })

    return {
      router,
      islandId,
      getEcoIslandBins,

      showDialogQR,
      showDialogImage,
      binsDialogToggle,

      deleteIsland,
      showDeleteDialog,
      ecoIsland,
      loaded,
      userStore: useUserStore(),
      buildingOptions,
      buildingFloors,

      colSizeFromBins,
      test: (a) => {
        console.log(a)
      },
      updateEcoisland,
      hasChanges,
      currentEcoIsland
    }
  }
}
</script>
