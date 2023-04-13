<template>
  <q-page padding>
    <q-card flat class="q-pa-md row justify-around">
      <q-card class="col-4 bg-grey-3">
        <q-form>
          <q-card-section class="text-center">
            <div class="text-h6 text-primary">Criar Nova Ecoilha</div>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <q-select standout="bg-primary text-white" v-model="building" :options="buildingOptions" label="Edificio">
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
              standout="bg-primary text-white" v-model="floor" :options="buildingFloors(building)" label="Piso">
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
              v-model="specific"
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
              @click="createNewEcoIsland()"
            />
          </q-card-actions>

        </q-form>

      </q-card>
      <q-table
        title-class="text-h6 text-primary"
        class="col-5"
        card-class="bg-grey-2"
        flat bordered
        title="Ecoilhas"
        :rows="ecoIslandStore.getEcoIslands()"
        :columns="columns"
        row-key="id"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols.filter(e => e.name !== 'bins')"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>
            <q-td
              class="text-center"
            >
              <q-icon
                v-for="bin in filteredIconBin(props.cols.find(e => e.name === 'bins').value)"
                :key="bin.name"
                name="mdi-trash-can-outline"
                :color="bin.color"
                size="sm"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import useVariables from 'src/composables/useVariables'

export default {
  // name: 'PageName',
  setup () {
    const ecoIslandStore = useEcoIslandStore()
    const building = ref('')
    const floor = ref('')
    const desc = ref('')
    const toggleGlass = ref(false)
    const toggleBio = ref(false)

    const { iconBinsExtra } = useVariables()

    const filteredIconBin = (condition) => {
      return iconBinsExtra.filter((e) => {
        return condition.charAt(e.position) === '1'
      })
    }

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

    const createNewEcoIsland = () => {
      const result = {
        building: building.value,
        floor: floor.value,
        description: desc.value,
        bins: ''
      }

      if (toggleBio.value) {
        result.bins = '1' + result.bins
      } else {
        result.bins = '0' + result.bins
      }
      if (toggleGlass.value) {
        result.bins = '1' + result.bins
      } else {
        result.bins = '0' + result.bins
      }

      ecoIslandStore.addEcoIsland(result)
    }

    const columns = [
      {
        name: 'id',
        label: 'ID',
        field: 'id',
        sortable: true,
        align: 'center'

      },
      {
        name: 'building',
        label: 'Edifício',
        field: 'building',
        sortable: true,
        align: 'center'
      },
      {
        name: 'floor',
        label: 'Piso',
        field: 'floor',
        sortable: true,
        align: 'center'
      },
      {
        name: 'bins',
        label: 'Caixotes',
        field: 'bins',
        sortable: true,
        align: 'center'
      }

    ]

    onMounted(() => {
      console.log('onMOunted')
      ecoIslandStore.fetchEcoIslands()
    })
    return {
      ecoIslandStore,
      columns,
      building,
      floor,
      buildingOptions,
      buildingFloors,
      specific: desc,
      createNewEcoIsland,

      toggleGlass,
      toggleBio,

      filteredIconBin
    }
  }
}
</script>
