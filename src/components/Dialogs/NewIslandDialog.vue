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
          <q-select standout="bg-primary text-white" v-model="building" :options="buildingOptions" label="Edificio"
                    @update:model-value="cleanFloorAndDesc"
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
            standout="bg-primary text-white" v-model="floor" :options="buildingFloors(building)" label="Piso"
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
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import useNotify from 'src/composables/UseNotify'

export default {
  name: 'NewIslandDialog',
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

    const buildingOptions = [
      'Pavilão de Civil',
      'Pavilhão de Mecânica I'
    ]

    const buildingFloors = (building) => {
      switch (building) {
        case 'Pavilão de Civil':
          return ['-3', '-2', '-1', ' 0', '1', ' 2', ' 3 ', '4']
        case 'Pavilhão de Mecânica I':
          return ['1', '2', '3']
        default:
          return ['0']
      }
    }

    const createNewEcoIsland = async () => {
      const result = {
        building: building.value,
        floor: floor.value,
        description: desc.value,
        bins: ''
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
        .then(response => {
          notifySuccess('Ecoilha adicionada com sucesso')
        }
        )
        .catch(e => {
          notifyError('Alguma coisa correu mal - ' + e)
        })

      emit('updateTable')
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

    return {
      building,
      floor,
      desc,
      toggleBio,
      toggleGlass,
      buildingFloors,
      buildingOptions,
      emitUpdate,
      resetFields,
      createNewEcoIsland,
      cleanFloorAndDesc
    }
  }
}
</script>

<style scoped>

</style>
