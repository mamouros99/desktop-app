<template>
  <q-dialog
    :model-value="showDialog"
    @update:modelValue="(value) => emitEvent('update:showDialog', value )"
  >
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>
      <q-separator/>
      <q-card-section class="row justify-around">
        <q-btn
          rounded
          icon="close"
          :label="negativeLabel"
          v-close-popup
          color="negative"
          class="q-mx-xs"
          @click="emitEvent('negativeFunction')"
        />

        <q-btn
          rounded
          icon="done"
          :label="positiveLabel"
          v-close-popup
          color="positive"
          class="q-mx-xs"
          @click="emitEvent('positiveFunction')"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  props: ['title', 'positiveLabel', 'negativeLabel', 'showDialog'],
  emits: ['positiveFunction', 'negativeFunction', 'update:showDialog'],
  setup (props, { emit }) {
    const emitEvent = (event, value) => {
      emit(event, value)
    }

    return {
      emitEvent
    }
  }
}
</script>
