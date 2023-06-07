<template>
  <q-dialog
    id="dialog"
    class="row "
    :model-value="showDialog"
    @update:modelValue="(value) => emitUpdate('update:showDialog', value )"
  >

    <div class="col-12 q-my-lg bg-grey-2">
      <div class="text-center text-h4 full-width q-pa-md"> Posição da Ecoilha</div>
      <ImagePage
        :island-id="islandid"
      />
    </div>

  </q-dialog>
</template>

<script>
import { onMounted, ref } from 'vue'
import ImagePage from 'pages/ImagePage.vue'

export default {
  components: { ImagePage },
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
    const imageData = ref('')
    onMounted(() => {
      console.log(props.islandid)
    })
    const emitUpdate = (event, value) => {
      emit(event, value)
    }

    return {
      emitUpdate,
      imageData

    }
  }
}
</script>
