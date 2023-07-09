<template>
  <q-dialog
    no-backdrop-dismiss
    :model-value="showDialog"
    @update:modelValue="(value) => emitUpdate('update:showDialog', value )"
  >
    <q-card class="col-4 bg-grey-3" style=" width: 40%">
      <q-form>
        <q-card-section class="text-center">
          <div class="text-h6 text-primary">Criar Nova Ecoílha</div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-select standout="bg-primary text-white"
                    v-model="building"
                    :options="buildingOptions"
                    :option-label="'name'"
                    label="Edificio"
                    @update:model-value="updateBuilding"
          >
            <template v-slot:append>
              <q-icon
                name="mdi-office-building"
              />
            </template>
          </q-select>
        </q-card-section>
        <q-card-section>
          <q-select
            :disable="building.length === 0"
            standout="bg-primary text-white"
            v-model="floor"
            :options="buildingFloors"
            :option-label="'name'"
            label="Piso"
            @update:modelValue="updateFloor"
          >
            <template v-slot:append>
              <q-icon
                name="mdi-stairs"
              />
            </template>
          </q-select>
          <q-card-section v-if="subBuildingFloors.length !== 0">
            <q-select
              standout="bg-primary text-white"
              v-model="subFloor"
              :options="subBuildingFloors"
              :option-label="'name'"
              label="SubPiso"
              @update:modelValue="cleanCoords()"
            />
          </q-card-section>
        </q-card-section>
        <q-card-section>
          <q-input
            :disable="building.length === 0"
            standout="bg-primary text-white"
            v-model="desc"
            label="Descrição"
            placeholder="Ex: Junto à sala V1.06">
            <template v-slot:append>
              <q-icon
                name="location_on"
              />
            </template>

          </q-input>
        </q-card-section>
        <q-card-section>
          <q-input
            :disable="building.length === 0"
            standout="bg-primary text-white"
            v-model="identifier"
            label="Identificador"
            placeholder="Ex: 1"
            type="number"
          >
            <template v-slot:append>
              <q-icon
                name="fingerprint"
              />
            </template>

          </q-input>
        </q-card-section>
        <q-card-section horizontal class="row q-mx-sm ">
          <q-card-section horizontal class="col-4 q-pl-lg">
            <q-btn
              :disable="!hasFloor"
              :color="hasCoords ? 'primary' : 'grey-8' "
              flat
              label="Posição"
              @click="toggleCoordsDialog = !toggleCoordsDialog"
            >
              <q-icon
                name="location_on"
              />
            </q-btn>
          </q-card-section>
          <q-card-section class="col">
            <q-card-section>
              <div class="q-pl-md text-h6">Caixotes Extra:</div>
              <q-card-section h>
                <q-toggle
                  label="Vidro"
                  class="text-bold"
                  v-model="toggleGlass"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="clear"
                />
                <q-toggle
                  label="Biorresíduos"
                  class="text-bold"
                  v-model="toggleBio"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="clear"
                />
              </q-card-section>

            </q-card-section>

          </q-card-section>
        </q-card-section>
        <q-card-actions class="row justify-around">
          <q-btn
            label="cancelar"
            icon="close"
            color="negative"
            @click="() => {
              resetFields
              emitUpdate('update:showDialog', false )
            }"
          />

          <q-btn
            icon="send"
            color="positive"
            label="Submeter"
            @click="() => {

              if(checkFields()){
                createNewEcoIsland()}
            }"
          >
            <q-tooltip>
              Tesst
            </q-tooltip>
          </q-btn>

        </q-card-actions>
      </q-form>

      <EcoislandImageDialog
        v-if="toggleCoordsDialog && hasFloor"
        :islandid="buildingId"
        v-model:show-dialog="toggleCoordsDialog"
        :x="coords.xPos"
        :y="coords.yPos"
        :bins="bins"
        @updateCoords="updateCoordinates"
        :floor="floor.name ? floor.name : floor"
        :building-name="building.name"
      />
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import useNotify from 'src/composables/UseNotify'
import { useUserStore } from 'stores/UserStore'
import EcoislandImageDialog from 'components/Dialogs/EcoislandImageDialog.vue'

export default {
  name: 'NewIslandDialog',
  components: { EcoislandImageDialog },
  emits: ['update:showDialog'],
  props: {
    showDialog: {
      type: Boolean,
      required: true
    }
  },

  setup (prop, { emit }) {
    const ecoIslandStore = useEcoIslandStore()
    const {
      notifyError,
      notifyWarning,
      notifySuccess
    } = useNotify()

    const building = ref('')
    const floor = ref('')
    const subFloor = ref('')
    const desc = ref('')
    const toggleGlass = ref(false)
    const toggleBio = ref(false)
    const coords = ref({
      xPos: null,
      yPos: null
    })

    const userStore = useUserStore()

    const toggleCoordsDialog = ref(false)

    const buildingOptions = ref([])

    const buildingFloors = ref([])
    const subBuildingFloors = ref([])

    const identifier = ref('')

    const hasCoords = computed(() => {
      return coords.value.xPos !== null && coords.value.yPos !== null
    })

    const hasFloor = computed(() => {
      return floor.value !== ''
    })

    const buildingId = computed(() => {
      if (subFloor.value) {
        return subFloor.value.id
      } else {
        return floor.value.id == null ? building.value.id : floor.value.id
      }
    })

    const createNewEcoIsland = async () => {
      const result = {
        id: createId(building.value.name) + identifier.value,
        building: building.value.name,
        buildingId: buildingId.value,
        floor: subFloor.value ? subFloor.value.name : (floor.value.name == null ? floor.value : floor.value.name),
        description: desc.value,
        bins: '',
        xPos: coords.value.xPos,
        yPos: coords.value.yPos,
        identifier: identifier.value
      }

      result.bins = bins.value

      await ecoIslandStore.addEcoIsland(result)
        .then(() => {
          notifySuccess('Ecoílha adicionada com sucesso')
        }
        )
        .catch(e => {
          notifyError('Alguma coisa correu mal - ' + e)
        })

      emit('update:showDialog', false)
      resetFields()
    }

    const cleanFloorAndDesc = () => {
      floor.value = ''
      desc.value = ''
    }

    const cleanSubFloor = () => {
      subFloor.value = ''
      subBuildingFloors.value = []
    }

    const bins = computed(() => {
      if (toggleBio.value && toggleGlass.value) {
        return '11'
      } else if (toggleBio.value) {
        return '10'
      } else if (toggleGlass.value) {
        return '01'
      } else {
        return '00'
      }
    })

    const emitUpdate = (event, value) => {
      emit(event, value)
    }

    const resetFields = () => {
      building.value = ''
      cleanFloorAndDesc()
      cleanSubFloor()
      cleanCoords()
      cleanBins()
    }

    const cleanCoords = () => {
      coords.value.yPos = null
      coords.value.xPos = null
    }

    const cleanBins = () => {
      toggleBio.value = false
      toggleGlass.value = false
    }

    const checkFields = () => {
      if (building.value.length === 0) {
        notifyWarning('Selecione um edifício', 'top')
        return false
      } else if (floor.value.length === 0) {
        notifyWarning('Selecione um piso', 'top')
        return false
      } else if (identifier.value.length === 0) {
        notifyWarning('Insira um identificador', 'top')
        return false
      } else if (subBuildingFloors.value.length > 0 && !subFloor.value) {
        notifyWarning('Selecione um subpiso', 'top')
        return false
      } else {
        return true
      }
    }

    const updateBuilding = async () => {
      cleanFloorAndDesc()
      cleanCoords()
      cleanSubFloor()
      cleanBins()

      await ecoIslandStore.fetchBuilding(building.value.id)
        .then((res) => {
          const build = res.data.containedSpaces.sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()

            return nameA - nameB
          }).filter(e => e.name !== '' && !isNaN(e.name) && !e.name.includes('.'))
          if (build.length !== 0) {
            buildingFloors.value = build
          } else {
            buildingFloors.value = ['-']
          }
        })
    }

    const updateFloor = async () => {
      cleanSubFloor()
      cleanCoords()
      if (floor.value === '-') {
        return
      }

      await ecoIslandStore.fetchBuilding(floor.value.id)
        .then((res) => {
          const build = res.data.containedSpaces.sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()

            return nameA - nameB
          })

          if (build.length !== 0) {
            subBuildingFloors.value = build.filter(e => e.name !== '' && !isNaN(e.name) && !e.name.includes('.'))
          }
        })
    }

    /**
     * Takes the building name and creates the basis of the identifier for the Ecoisland
     * @param buildingName - Name of the currently selected building
     * @returns {string}
     */
    const createId = (buildingName) => {
      const newBuildingName = buildingName
        .normalize('NFD').replace(/\p{Diacritic}/gu, '') // removes accents and other weird characters
        .toLowerCase()
        .split(' ')
        .map((value) => {
          return value.slice(0, 3) // gets first 3 letters of each word
        })
        .filter(e => !(e === 'da' || e === 'de' || e === 'dos' || e === 'do' || e.length === 0)) // remove certain words
        .join('_')

      return 'E_' + newBuildingName + '_'
    }

    const updateCoordinates = (newValue) => {
      coords.value.xPos = newValue.x
      coords.value.yPos = newValue.y
    }

    onMounted(async () => {
      if (!userStore.hasAdminPermissions()) {
        await userStore.fetchMyBuildings()
          .then(res => {
            buildingOptions.value = res.data
          })
      } else {
        await ecoIslandStore.fetchAlamedaBuildings()
          .then(res => {
            const campus = res.data
            const validKeys = ['id', 'name']
            buildingOptions.value = campus.map((build) => {
              Object.keys(build).forEach((key) => validKeys.includes(key) || delete build[key])
              return build
            })
          })
      }

      buildingOptions.value.sort((a, b) => {
        const nameA = a.name.toUpperCase() // ignore upper and lowercase
        const nameB = b.name.toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        // names must be equal
        return 0
      })
    })

    return {
      building,
      subFloor,
      floor,
      desc,
      toggleBio,
      toggleGlass,
      coords,
      identifier,

      hasCoords,
      buildingId,
      hasFloor,
      toggleCoordsDialog,
      bins,

      buildingFloors,
      subBuildingFloors,
      buildingOptions,
      emitUpdate,
      resetFields,
      createNewEcoIsland,

      updateBuilding,
      updateFloor,
      cleanFloorAndDesc,
      cleanSubFloor,
      cleanCoords,
      updateCoordinates,

      checkFields,

      test: (a, b) => {
        console.log(a, b)
      }
    }
  }
}
</script>

<style scoped>

</style>
