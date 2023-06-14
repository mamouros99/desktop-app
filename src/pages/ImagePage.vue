<template>
  <div id="q-app" style="min-height: 100vh;">
    <div class="q-pa-md row items-center q-gutter-md">
      <q-card class="my-card row" flat bordered>
        <q-card-section class="col-12">
          <canvas class="" ref="canvas" @click="onClick"></canvas>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useEcoIslandStore } from 'stores/EcoIslandStore'

export default {
  name: 'ImagePage',
  props: ['islandId', 'x', 'y', 'disable'],
  emits: ['updateCoords'],
  setup (props, { emit }) {
    const canvas = ref()
    const ecoIslandStore = useEcoIslandStore()
    const image = new Image()

    const hasCoord = computed(() => {
      return props.x != null && props.y != null
    })

    onMounted(async () => {
      let imageSource
      await ecoIslandStore.fetchBuildingImage(props.islandId)
        .then((res) => {
          imageSource = 'data:image/jpeg;base64,' + res.data
        })

      const ctx = canvas.value.getContext('2d')
      image.crossOrigin = '*'
      image.onload = () => {
        canvas.value.width = image.width
        canvas.value.height = image.height
        ctx.drawImage(image, 0, 0, image.width, image.height)
        if (hasCoord.value) {
          console.log('test', props.x, props.y)
          drawCircle(ctx, props.x, props.y)
          drawCircle2(ctx, props.x, props.y)
        }
      }
      image.src = imageSource
    })

    function onClick (evt) {
      if (props.disable) {
        return
      }

      const rect = canvas.value.getBoundingClientRect()
      const x = canvas.value.width / rect.width * evt.clientX
      const y = canvas.value.height / rect.height * evt.clientY

      const ctx = canvas.value.getContext('2d')
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
      ctx.drawImage(image, 0, 0, image.width, image.height)
      drawCircle(ctx, x - rect.x, y - rect.y)
      drawCircle2(ctx, x - rect.x, y - rect.y)
      emit('updateCoords', {
        x: Math.round(x - rect.x),
        y: Math.round(y - rect.y)
      })
    }

    const emitEvent = (event, value) => {
      emit(event, value)
    }

    const drawCircle = (ctx, x, y) => {
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, 2 * Math.PI)
      ctx.lineWidth = 5
      ctx.strokeStyle = '#03c04a'
      ctx.stroke()
    }

    const drawCircle2 = (ctx, x, y) => {
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = '#03c04a'
      ctx.fill()
    }

    return {
      canvas,
      onClick,
      emitEvent,
      drawCircle
    }
  }
}
</script>

<style scoped>

</style>
