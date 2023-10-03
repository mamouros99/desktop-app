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
    <q-card v-if="loaded">
      <q-card-section class="row justify-between items-center">
        <div>
          <span class="text-h4  text-grey-9"> {{ $t('ecoisland') }} {{ ecoIsland.identifier }}</span>
          <span class="text-primary text-subtitle1"> ID: <span class="text-italic">{{ ecoIsland.id }}</span></span>
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
          {{ $t('msg_create_qrcode')}}
        </q-btn>

        <QRCodeDialog v-model:show-dialog="showDialogQR" :islandid="islandId"/>
      </q-card-section>
      <div>
        <q-card-section>
          <div class="text-h6">
            <div v-if="loaded" class="row">
              {{ $t('location')}}
              <q-btn
                v-if="ecoIsland.buildingId !== '-'"
                color="primary"
                dense
                flat
                icon="location_on"
                @click="showDialogImage = true"
              />
              <EcoislandImageDialog
                v-if="showDialogImage"
                :disable="!userStore.hasEditPermissions()"
                v-model:show-dialog="showDialogImage"
                :islandid="ecoIsland.buildingId"
                :x="ecoIsland.xPos"
                :y="ecoIsland.yPos"
                :bins="ecoIsland.bins"
                @updateCoords="updateCoordinates"
                :floor="ecoIsland.floor"
                :building-name="ecoIsland.building"

              />
            </div>
          </div>
          <q-card-section class="row bg-grey-1 items-center">
            <div class="col-4 row">
              <div class="text-bold q-mr-sm">
                {{ $t('building')}} :
              </div>
              <div>
                {{ ecoIsland.building }}
              </div>
            </div>
            <div class="col-2 row items-center">
              <div class="text-bold q-mr-sm">              {{ $t('floor')}}
                :</div>
              {{ ecoIsland.floor }}

            </div>
            <div class="col-6 row items-center">
              <div class="text-bold q-mr-sm">{{ $t('description') }}:</div>
              <q-input
                :disable="!userStore.hasEditPermissions()"
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
            <div class="text-h6">{{ $t('bins') }}</div>
            <q-btn
              v-if="userStore.hasEditPermissions()"
              flat dense color="primary"
              class="text-italic"
              :label="$t('edit')"
              @click="binsDialogToggle = !binsDialogToggle"
            />
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
              :disable="!userStore.hasEditPermissions()"
              :class="colSizeFromBins"
              icon="mdi-trash-can-outline"
              :color="bin.color"
              :label="bin.name"
              @click="binsDialogToggle = !binsDialogToggle"
            />

          </q-card-section>
        </q-card-section>
        <q-card-actions class="justify-end q-mr-lg q-pb-md" v-if="hasChanges">
          <q-btn dense color="positive" :label="$t('save')" @click="updateEcoisland"/>
          <q-btn dense color="negative" :label="$t('reset')" @click="() => {
            ecoIsland = Object.assign({}, currentEcoIsland)
            hasChanges = false
          }"/>
        </q-card-actions>
      </div>
    </q-card>
    <div class="row justify-between">
      <q-btn
        v-if="userStore.hasEditPermissions()"
        class="glossy q-ml-lg q-mt-lg"
        rounded color="red-7"
        :label="$t('delete') + ' ' + $t('ecoisland')"
        @click="showDeleteDialog = !showDeleteDialog"
      />

      <q-btn
        v-if="userStore.hasEditPermissions()"
        class="glossy q-mr-lg q-mt-lg"
        rounded color="primary"
        :label="$t('archive') + ' ' + $t('alerts')"
        @click="archiveAllIslandReports()"
      />
    </div>
    <ConfirmationDialog
      :title="$t('msg_delete_ecoisland')"
      :negative-label="$t('delete')"
      :positive-label="$t('cancel')"
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
          notifySuccess('Ecoílha ' + islandId + ' foi apagada com sucesso')
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
          notifySuccess('Ecoílha ' + islandId + ' foi atualizada com sucesso')
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

    const updateCoordinates = (value) => {
      if (ecoIsland.value.xPos !== value.x && ecoIsland.value.yPos !== value.y) {
        hasChanges.value = true
        ecoIsland.value.xPos = value.x
        ecoIsland.value.yPos = value.y
      }
    }

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

    const archiveAllIslandReports = () => {
      ecoIslandStore.archiveAllIslandReports(islandId)
    }

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
      updateCoordinates,
      hasChanges,
      currentEcoIsland,

      archiveAllIslandReports
    }
  }
}
</script>
