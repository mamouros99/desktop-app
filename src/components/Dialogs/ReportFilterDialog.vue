<template>
  <q-dialog
    :model-value="showDialog"
    @update:modelValue="(value) => emitUpdate('update:showDialog', value )"
    @hide="emitUpdate('updateFilters',filter)"
  >
    <q-card style="max-width: 50%">
      <q-card-section class="row justify-between">
        <div class="text-h5 text-primary q-ml-md">Filtros</div>
        <q-btn
          outline
          rounded
          color="negative"
          @click="cleanDates();cleanSelected()"
        >
          Limpar Filtros
          <q-icon
            class="q-pl-md"
            name="o_cancel"
          />
        </q-btn>

      </q-card-section>
      <q-separator/>
      <q-card-section>
        <q-card>
          <q-card-section class="row justify-between">
            <div class="text-subtitle1 text-bold text-grey-8">Intervalo de tempo</div>
            <div>
              <FilterButton
                @click="cleanDates"
              />
            </div>
          </q-card-section>
          <q-separator/>
          <q-card-section class="row">
            <div class="col-6 column justify-between">
              <div class="text-primary"> A partir de:</div>
              <DatePicker
                v-model:date="filter.startDate"
                v-model:max-date="filter.endDate"
              />
            </div>
            <div class="col-6 column justify-between">
              <div class="text-primary">Até:</div>
              <DatePicker
                v-model:date="filter.endDate"
                v-model:min-date="filter.startDate"
              />
            </div>
          </q-card-section>
        </q-card>

        <q-card class="q-mt-md">
          <q-card-section class="row justify-between">
            <div class="text-subtitle1 text-bold text-grey-8">Caixotes</div>
            <div>
              <FilterButton
                @click="cleanSelected"
              />
            </div>
          </q-card-section>
          <q-card-section>
            <q-card flat>
              <div class="text-subtitle2"> Tem de incluir estes caixotes:</div>
              <div class="q-gutter-sm">
                <q-checkbox v-model="filter.binsSelected" val="undifferentiated" label="Indiferenciado" color="black"/>
                <q-checkbox v-model="filter.binsSelected" val="plastic" label="Plástico" color="yellow-8"/>
                <q-checkbox v-model="filter.binsSelected" val="paper" label="Papel" color="blue-7"/>
                <q-checkbox v-model="filter.binsSelected" val="glass" label="Vidro" color="green-6"/>
                <q-checkbox v-model="filter.binsSelected" val="bio" label="Biorresíduos" color="brown-5"/>
              </div>
              <div class="text-subtitle2"> Mostrar alertas que contêm caixotes:</div>
              <div class="q-gutter-sm">
                <q-checkbox v-model="filter.problemsSelected" val="dirty" label="Sujos"/>
                <q-checkbox v-model="filter.problemsSelected" val="full" label="Cheios"/>
                <q-checkbox v-model="filter.problemsSelected" val="separation" label="Má Separação"/>
              </div>
            </q-card>

          </q-card-section>
        </q-card>
      </q-card-section>

    </q-card>

  </q-dialog>
</template>
<script>
import DatePicker from 'components/DatePicker.vue'
import { ref } from 'vue'
import FilterButton from 'components/FilterButton.vue'

export default {
  name: 'ReportFilterDialog',
  components: {
    FilterButton,
    DatePicker
  },
  emits: ['update:showDialog', 'updateFilters'],
  props: {
    showDialog: {
      type: Boolean,
      required: true
    }
  },
  setup (props, { emit }) {
    const filter = ref({
      startDate: '',
      endDate: '',
      binsSelected: [],
      problemsSelected: []
    })

    const emitUpdate = (event, value) => {
      emit(event, value)
    }

    const cleanDates = () => {
      filter.value.startDate = ''
      filter.value.endDate = ''
    }

    const cleanSelected = () => {
      filter.value.binsSelected = []
      filter.value.problemsSelected = []
    }

    return {
      emitUpdate,
      filter,
      cleanDates,
      cleanSelected
    }
  }
}
</script>

<style scoped lang="scss">

.clean-button {

}

</style>
