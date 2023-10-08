<template>
  <div class="q-pa-md row items-center" style="max-width:60vw">
    <q-btn
      class="full-width row"
      flat
      square
      style="border-bottom: 1px solid grey"
    >
      <div class="text-caption col-9">
        {{ date !== '' ? date : 'dd-mm-yyyy' }}
      </div>
      <q-icon
        class="q-pl-md col-1"
        color="secondary"
        name="event"
      />
      <q-popup-proxy>
        <q-date
          :model-value="date"
          @update:model-value="(value)=>checkDate(value)"
        />
      </q-popup-proxy>
    </q-btn>
  </div>
</template>

<script>

import useNotify from 'src/composables/UseNotify'

export default {
  // name: 'ComponentName',
  emits: ['update:date'],
  props: {
    date: {
      type: String
    },
    minDate: {
      type: String,
      default: ''
    },
    maxDate: {
      type: String,
      default: ''
    }
  },

  setup (props, { emit }) {
    const emitUpdate = (event, value) => {
      emit(event, value)
    }

    const { notifyWarning } = useNotify()

    const checkDate = (value) => {
      if (value === null) { value = '' }

      if (props.minDate !== '' && props.minDate > value) {
        value = ''
        notifyWarning('Primeira data tem de ser inferior à segunda!')
      }

      if (props.maxDate !== '' && props.maxDate < value) {
        value = ''
        notifyWarning('Primeira data tem de ser inferior à segunda!')
      }
      emitUpdate('update:date', value)
    }

    return {
      emitUpdate,
      checkDate
    }
  }
}
</script>
