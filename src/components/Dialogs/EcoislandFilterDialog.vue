<template>
  <q-dialog
    :model-value="showDialog"
    @update:modelValue="(value) => emitUpdate('update:showDialog', value )"
    @hide="() => {
      cleanFilter()
    }"
  >
    <q-card style="width: 50%">
      <q-card-section horizontal class="q-px-lg q-py-md">
        <div class="text-h5 text-primary q-ml-md col-8">{{           $t('filters')
          }}</div>
        <div class="col-4 row justify-end">
          <q-btn
            class="q-mr-lg"
            round
            size="md"
            color="negative"
            dense
            flat
            icon="close"
            @click="emitUpdate('update:showDialog', false )"
          />
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-section class="q-gutter-y-sm">
        <div class="row">
          <q-input
            class="col-10"
            filled
            label="ID"
            placeholder="ex.: E_pav_cen_1"
            v-model="currentFilter.id"
          >
            <template v-slot:append>
              <q-icon name="tag"/>
            </template>
          </q-input>
          <q-btn
            v-if="currentFilter.id"
            class="col-1 q-ma-sm"
            dense
            color="blue"
            icon="add"
            @click="() => {
              emitUpdate('updateFilters', {name: 'id', value: currentFilter.id})
              currentFilter.id = ''
            }"
          />
        </div>
        <div class="row">
          <q-input
            class="col-10"
            filled
            type="number"
            :label="$t('identifier')"
            placeholder="ex.: 1"
            v-model="currentFilter.identifier"
          >
            <template v-slot:append>
              <q-icon name="fingerprint"/>
            </template>
          </q-input>
          <q-btn
            v-if="currentFilter.identifier"
            class="col-1 col-1 q-ma-sm"
            dense
            color="green"
            icon="add"
            @click="() => {
              emitUpdate('updateFilters', {name: 'identifier', value: currentFilter.identifier})
              currentFilter.identifier = ''
            }"
          />
        </div>
        <div class="row">
          <q-input
            class="col-10"
            filled
            :label="$t('building')"
            placeholder="ex.: Pavilhão Central"
            v-model="currentFilter.building"
          >
            <template v-slot:append>
              <q-icon name="mdi-office-building"/>
            </template>
          </q-input>
          <q-btn
            v-if="currentFilter.building"
            class="col-1 col-1 q-ma-sm"
            dense
            color="yellow"
            icon="add"
            @click="() => {
              emitUpdate('updateFilters', {name: 'building', value: currentFilter.building})
              currentFilter.building = ''
            }"
          />
        </div>
        <div class="row">
          <q-input
            class="col-10"
            filled
            :label="$t('floor')"
            placeholder="ex.: -1"
            v-model="currentFilter.floor"
          >
            <template v-slot:append>
              <q-icon name="mdi-stairs"/>
            </template>
          </q-input>
          <q-btn
            v-if="currentFilter.floor"
            class="col-1 col-1 q-ma-sm"
            dense
            color="orange"
            icon="add"
            @click="() => {
              emitUpdate('updateFilters', {name: 'floor', value: currentFilter.floor})
              currentFilter.floor = ''
            }"
          />
        </div>
      </q-card-section>
    </q-card>

  </q-dialog>
</template>
<script>

import { ref } from 'vue'

export default {
  name: 'EcoislandFilterDialog',
  emits: ['update:showDialog', 'updateFilters'],
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    oldFilter: {
      required: true
    }
  },
  setup (props, { emit }) {
    const currentFilter = ref({
      id: '',
      identifier: '',
      building: '',
      floor: ''
    })
    const emitUpdate = (event, value) => {
      emit(event, value)
    }

    const cleanFilter = () => {
      currentFilter.value.id = ''
      currentFilter.value.identifier = ''
      currentFilter.value.building = ''
      currentFilter.value.floor = ''
    }

    return {
      emitUpdate,
      cleanFilter,
      currentFilter
    }
  }
}
</script>

<style scoped lang="scss">

.clean-button {

}

</style>
