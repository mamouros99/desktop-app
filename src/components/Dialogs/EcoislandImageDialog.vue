<template>
  <q-dialog
    id="dialog"
    full-width
    full-height
    :model-value="showDialog"
    @update:modelValue="(value) => emitUpdate('update:showDialog', value )"
  >

    <q-img
      id="myImage"
      style="overflow: hidden"
      @click="(event) => {
            emitUpdate('update:showDialog', false )
          }"
      fit="contain"
      :src="'data:image/jpeg;base64,' + imageData"
    />

  </q-dialog>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import useNotify from 'src/composables/UseNotify'

export default {
  emits: ['update:showDialog'],
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    islandid: {
      type: String,
      required: true
    }
  },
  setup (props, { emit }) {
    const ecoislandStore = useEcoIslandStore()
    const { notifyError } = useNotify()
    const imageData = ref('')

    const emitUpdate = (event, value) => {
      emit(event, value)
    }

    onMounted(async () => {
      await ecoislandStore.fetchBuildingImage(props.islandid)
        .then((res) => {
          imageData.value = res.data
        })
        .catch(() => {
          notifyError('Não foi possivel carregar a imagem')
        })
    })

    return {
      emitUpdate,
      imageData

    }
  }
}
</script>
