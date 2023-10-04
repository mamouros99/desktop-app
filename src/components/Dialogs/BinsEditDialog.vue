<template>
  <q-dialog
    :model-value="showDialog"
    @update:modelValue="(value) => {
      emitUpdate('update:showDialog', value )
      emitUpdate('updateBins', newBins)
    }"
  >
    <q-card
      style="max-width: 500px; width: 50%"
      class="bg-grey-2"
    >
      <q-card-section class="row justify-between">
        <div class="text-h6">Caixotes Extra</div>
        <q-btn icon="close" color="negative" flat size="sm" round v-close-popup/>
      </q-card-section>
      <div class="row q-ml-lg q-pb-md">
        <q-toggle
          :label="$t('glass')"
          class="text-bold col-12"
          v-model="toggleGlass"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
        />
        <q-toggle
          :label="$t('biowaste')"
          class="text-bold col-12"
          v-model="toggleBio"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>

import { computed, onMounted, ref } from 'vue'

export default {
  // name: 'ComponentName',
  emits: ['update:showDialog', 'updateBins'],
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    bins: {
      type: String,
      length: 2
    }
  },
  components: {},
  setup (props, { emit }) {
    const toggleGlass = ref(false)
    const toggleBio = ref(false)
    const emitUpdate = (event, value) => {
      emit(event, value)
    }

    const newBins = computed(() => {
      let result = ''
      result += toggleBio.value ? '1' : '0'
      result += toggleGlass.value ? '1' : '0'
      return result
    })

    onMounted(() => {
      toggleBio.value = (props.bins.charAt(0) === '1')
      toggleGlass.value = (props.bins.charAt(1) === '1')
    })

    return {
      emitUpdate,
      toggleGlass,
      toggleBio,
      newBins
    }
  }
}
</script>
