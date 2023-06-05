<template>
  <q-dialog
    :model-value="showDialog"
    @update:modelValue="(value) => emitUpdate('update:showDialog', value )"
  >
    <q-card
      class="bg-blue"
      style="height: 90%; width: 90%"
    >
      <q-img
        id="clickme"
        fit="scale-down"
        :src="'data:image/jpeg;base64,' + imageData"
      />
    </q-card>

    <!--    <q-page
          class="bg-primary q-pa-lg rounded-borders"
          style="max-height: 1000px"
        >

        </q-page>-->

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
