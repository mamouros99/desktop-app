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
  props: ['islandId', 'x', 'y', 'disable', 'bins'],
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
          drawCircle(props.x, props.y)
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
      drawCircle(x - rect.x, y - rect.y)
      emit('updateCoords', {
        x: Math.round(x - rect.x),
        y: Math.round(y - rect.y)
      })
    }

    const emitEvent = (event, value) => {
      emit(event, value)
    }

    /**
     * Draws a circle. The circle depends on the bins that exist on the ecoisland
     * @param x - x coordinate of where to draw the circle
     * @param y - y coordinate of where to draw the circle
     */
    const drawCircle = (x, y) => {
      const ctx = canvas.value.getContext('2d')

      switch (props.bins) {
        case '11':
          drawPartialCircle(ctx, x, y, 15, 0, 2 * Math.PI / 5, '#FFD133')
          drawPartialCircle(ctx, x, y, 15, 2 * Math.PI / 5, 4 * Math.PI / 5, '#111111')
          drawPartialCircle(ctx, x, y, 15, 4 * Math.PI / 5, 6 * Math.PI / 5, '#338AFF')
          drawPartialCircle(ctx, x, y, 15, 6 * Math.PI / 5, 8 * Math.PI / 5, '#5bfd02')
          drawPartialCircle(ctx, x, y, 15, 8 * Math.PI / 5, 0, '#785802')
          break
        case '01':
          drawPartialCircle(ctx, x, y, 15, 0, Math.PI / 2, '#FFD133')
          drawPartialCircle(ctx, x, y, 15, Math.PI / 2, Math.PI, '#111111')
          drawPartialCircle(ctx, x, y, 15, Math.PI, 3 * Math.PI / 2, '#338AFF')
          drawPartialCircle(ctx, x, y, 15, 3 * Math.PI / 2, 0, '#5bfd02')
          break
        case '10':
          drawPartialCircle(ctx, x, y, 15, 0, Math.PI / 2, '#FFD133')
          drawPartialCircle(ctx, x, y, 15, Math.PI / 2, Math.PI, '#111111')
          drawPartialCircle(ctx, x, y, 15, Math.PI, 3 * Math.PI / 2, '#338AFF')
          drawPartialCircle(ctx, x, y, 15, 3 * Math.PI / 2, 0, '#785802')
          break
        default:
          drawPartialCircle(ctx, x, y, 15, 0, 2 * Math.PI / 3, '#FFD133')
          drawPartialCircle(ctx, x, y, 15, 2 * Math.PI / 3, 4 * Math.PI / 3, '#111111')
          drawPartialCircle(ctx, x, y, 15, 4 * Math.PI / 3, 0, '#338AFF')
      }
    }

    const drawPartialCircle = (ctx, x, y, radius, startRad, endRad, color) => {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.arc(x, y, radius, startRad, endRad)
      ctx.closePath()
      ctx.fillStyle = color
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
