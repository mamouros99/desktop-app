<template>
  <q-page padding>
    <q-card flat class="q-pa-md row justify-around">

      <NewIslandDialog v-model:showDialog="showDialog"/>

      <q-table
        class="col-10"
        card-class="bg-grey-2"
        flat bordered
        :rows="ecoIslandStore.getEcoIslands()"
        :columns="columns"
        row-key="id"
        :filter="search"
      >

        <template v-slot:top>
          <div class="row full-width justify-between">
            <div class="text-h6 q-pl-lg col-6">
              Ecoilhas
            </div>

            <div class="col-6 row items-center justify-around">
              <q-input class="col-5" rounded v-model="search" label="Search">
                <template v-slot:append>
                  <q-icon
                    name="search"
                  />
                </template>
              </q-input>
              <q-btn
                class=" col-5"
                rounded
                dense
                color="teal-4"
                @click="showDialog = true"
              >
                <q-icon
                  name="add"
                  class="q-pr-sm"
                />
                <div>Adicionar EcoIlha</div>

              </q-btn>
            </div>
          </div>

        </template>

        <template v-slot:body="props">
          <q-tr :props="props"
                class="bg-grey-1"
                @click="router.push('/ecoisland/'+ props.row.id)"
          >
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
import NewIslandDialog from 'components/Dialogs/NewIslandDialog.vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    NewIslandDialog
  },
  // name: 'PageName',
  setup () {
    const ecoIslandStore = useEcoIslandStore()
    const {
      iconBinsExtra,
      iconBinsBase
    } = useVariables()
    const router = useRouter()

    const showDialog = ref(false)

    const search = ref('')

    const filteredIconBin = (condition) => {
      return [...iconBinsBase, ...iconBinsExtra.filter((e) => {
        return condition.charAt(e.position) === '1'
      })]
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
      showDialog,
      router,

      search,

      filteredIconBin,

      test: (a) => {
        console.log('test', a)
      }
    }
  }
}
</script>
