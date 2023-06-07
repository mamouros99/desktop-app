<template>
  <q-dialog
    :model-value="showDialog"
    @update:modelValue="(value) => emitUpdate('update:showDialog', value )"
  >
    <q-card class="col-4 bg-grey-3" style=" width: 40%">
      <q-form>
        <q-card-section class="text-center">
          <div class="text-h6 text-primary">Criar Nova Ecoilha</div>
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
            @update:modelValue="test(floor, building)"
          >
            <template v-slot:append>
              <q-icon
                name="mdi-stairs"
              />
            </template>
          </q-select>
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
        <q-card-section class="col q-mx-sm ">
          <q-btn
            flat
            icon="location_on"
            label="Posição"
            @click="toggleCoordsDialog = !toggleCoordsDialog"
          >
            <q-icon
              v-if="hasCoords"
              class="q-pl-sm"
              name="check"
              size="sm"
              color="positive"
            />
            <q-icon
              v-else
              class="q-pl-sm"
              name="close"
              size="sm"
              color="negative"
            />
          </q-btn>
          <q-card-section horizontal>
            <q-card-section>
              <div class="q-pl-md text-h6">Caixotes Extra:</div>
              <q-card-section>
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
            :disable="building.length === 0 || floor.length === 0"
            label="submit"
            icon="send"
            color="positive"
            @click="createNewEcoIsland"
          />
        </q-card-actions>
      </q-form>

      <EcoislandImageDialog
        v-if="toggleCoordsDialog && hasFloor"
        islandid="" v-model:show-dialog="toggleCoordsDialog"/>
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
      notifySuccess
    } = useNotify()

    const building = ref('')
    const floor = ref('')
    const desc = ref('')
    const toggleGlass = ref(false)
    const toggleBio = ref(false)
    const coords = ref({
      xPos: null,
      yPos: null
    })

    const toggleCoordsDialog = ref(false)

    const buildingOptions = ref([])

    const buildingFloors = ref([])

    const hasCoords = computed(() => {
      return coords.value.xPos !== null && coords.value.yPos !== null
    })

    const hasFloor = computed(() => {
      return floor.value !== ''
    })

    const createNewEcoIsland = async () => {
      const result = {
        building: building.value.name,
        buildingId: floor.value.id == null ? building.value.id : floor.value.id,
        floor: floor.value.name == null ? floor.value : floor.value.name,
        description: desc.value,
        bins: '',
        xPos: coords.value.xPos,
        yPos: coords.value.yPos
      }

      if (toggleGlass.value) {
        result.bins = '1' + result.bins
      } else {
        result.bins = '0' + result.bins
      }

      if (toggleBio.value) {
        result.bins = '1' + result.bins
      } else {
        result.bins = '0' + result.bins
      }

      await ecoIslandStore.addEcoIsland(result)
        .then(() => {
          notifySuccess('Ecoilha adicionada com sucesso')
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

    const emitUpdate = (event, value) => {
      emit(event, value)
    }

    const resetFields = () => {
      toggleBio.value = false
      toggleGlass.value = false
      building.value = ''
      floor.value = ''
      desc.value = ''
    }

    const updateBuilding = async () => {
      cleanFloorAndDesc()
      await ecoIslandStore.fetchBuilding(building.value.id)
        .then((res) => {
          const build = res.data.containedSpaces.filter(floor => {
            return floor.type === 'FLOOR'
          }).sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()

            return nameA - nameB
          })

          if (build.length !== 0) {
            buildingFloors.value = build
          } else {
            buildingFloors.value = ['-']
          }
        })
    }
    const userStore = useUserStore()

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
      floor,
      desc,
      toggleBio,
      toggleGlass,
      coords,

      hasCoords,
      hasFloor,
      toggleCoordsDialog,

      buildingFloors,
      buildingOptions,
      emitUpdate,
      resetFields,
      createNewEcoIsland,

      updateBuilding,
      cleanFloorAndDesc,

      test: (a, b) => {
        console.log(a, b)
      }
    }
  }
}
</script>

<style scoped>

</style>
