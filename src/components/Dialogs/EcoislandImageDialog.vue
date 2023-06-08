<template>
  <q-dialog
    id="dialog"
    class="row "
    :model-value="showDialog"
    @update:modelValue="(value) => emitUpdate('update:showDialog', value )"
  >

    <div class="col-12 q-my-lg bg-grey-2">
      <div class="text-center text-h4 text-primary text-bold full-width q-pt-md">
        <div>Posição da Ecoilha</div>
      </div>
      <ImagePage
        :island-id="islandid"
        :x="x"
        :y="y"
        @updateCoords="update"
        :disable="disable"
      />
    </div>

  </q-dialog>
</template>

<script>
import { onMounted, ref } from 'vue'
import ImagePage from 'pages/ImagePage.vue'

export default {
  components: { ImagePage },
  emits: ['update:showDialog', 'updateCoords'],
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    islandid: {
      type: String,
      required: true
    },
    x: {
      type: Number,
      required: false
    },
    y: {
      type: Number,
      required: false
    },
    disable: {
      type: Boolean,
      default: false,
      required: false
    }

  },

  setup (props, { emit }) {
    const imageData = ref('')

    const update = (value) => {
      emit('updateCoords', value)
    }
    onMounted(() => {
      console.log(props.islandid, props.x, props.y)
    })
    const emitUpdate = (event, value) => {
      emit(event, value)
    }

    return {
      emitUpdate,
      imageData,
      update

    }
  }
}
</script>
