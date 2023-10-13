<template>
  <q-page padding>
    <q-card flat>
      <q-card-section horizontal class=" justify-between">
        <div class="text-primary text-h4 row items-center">{{ $t('map') }}</div>

        <q-card-actions class=" row col-9">
          <q-select standout="bg-primary text-white"
                    class="col-3"
                    v-model="building"
                    :options="buildingOptions"
                    :option-label="'name'"
                    :label="$t('building')"
                    @update:modelValue="updateBuilding"

          >
            <template v-slot:append>
              <q-icon
                name="mdi-office-building"
              />
            </template>
          </q-select>

          <q-space/>

          <q-select
            :disable="building.length === 0"
            standout="bg-primary text-white"
            class="col-3"
            v-model="floor"
            :options="buildingFloors"
            :option-label="'name'"
            :label="$t('floor')"
            @update:modelValue="() => {updateFloor()}"
          >
            <template v-slot:append>
              <q-icon
                name="mdi-stairs"
              />
            </template>
          </q-select>
          <q-space/>

          <q-select
            v-if="subBuildingFloors.length !== 0"
            standout="bg-primary text-white"
            v-model="subFloor"
            class="col-3"
            :options="subBuildingFloors"
            :option-label="'name'"
            :label="$t('subfloor')"
            @update:modelValue="
            getCoords(subFloor.id)"
          />
        </q-card-actions>
      </q-card-section>
      <q-separator/>
      <q-card-section class="col-12">
        <canvas class="" ref="canvas" @click="clickEvent"></canvas>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useEcoIslandStore } from 'stores/EcoIslandStore'
import { onMounted, ref } from 'vue'
import { useUserStore } from 'stores/UserStore'
import { useRouter } from 'vue-router'

export default {
  // name: 'PageName',
  setup () {
    const ecoIslandStore = useEcoIslandStore()
    const router = useRouter()

    const coordinates = ref([])

    const building = ref('')
    const floor = ref('')
    const subFloor = ref('')

    const userStore = useUserStore()

    const buildingOptions = ref([])
    const floorOptions = ref([])

    const buildingFloors = ref([])
    const subBuildingFloors = ref([])

    const canvas = ref()
    const image = new Image()

    const cleanSubFloor = () => {
      const ctx = canvas.value.getContext('2d')
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    }

    const cleanFloor = () => {
      cleanSubFloor()
      subFloor.value = ''
      subBuildingFloors.value = []
    }

    const cleanBuilding = () => {
      cleanFloor()
      floor.value = ''
    }

    const updateBuilding = async () => {
      cleanBuilding()

      await ecoIslandStore.fetchBuilding(typeof building.value.id.id === 'undefined' ? building.value.id : building.value.id.id)
        .then((res) => {
          const build = res.data.containedSpaces.sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()

            return nameA - nameB
          }).filter(e => e.name !== '' && !isNaN(e.name) && !e.name.includes('.'))
          if (build.length !== 0) {
            buildingFloors.value = build
          } else {
            buildingFloors.value = ['-']
          }
        })
    }

    const updateFloor = async () => {
      cleanFloor()

      await ecoIslandStore.fetchBuilding(floor.value.id)
        .then((res) => {
          const build = res.data.containedSpaces.sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()

            return nameA - nameB
          })

          if (build.length !== 0) {
            subBuildingFloors.value = build.filter(e => e.name !== '' && !isNaN(e.name) && !e.name.includes('.'))
          }
          if (subBuildingFloors.value.length === 0) {
            getCoords(floor.value.id)
          }
        })
    }

    const getCoords = async (buildingId) => {
      cleanSubFloor()

      await ecoIslandStore.fetchEcoIslandsPerBuildingFloor(buildingId)
        .then(res => {
          const validKeys = ['xPos', 'yPos', 'identifier', 'bins', 'id']
          coordinates.value = res.data.map((build) => {
            Object.keys(build).forEach((key) => validKeys.includes(key) || delete build[key])
            return build
          })
          console.log(coordinates.value)
        })

      await buildImage(buildingId)
    }

    onMounted(async () => {
      await ecoIslandStore.fetchAlamedaBuildings()
        .then(res => {
          const campus = res.data
          const validKeys = ['id', 'name']
          buildingOptions.value = campus.map((build) => {
            Object.keys(build).forEach((key) => validKeys.includes(key) || delete build[key])
            return build
          })
        })

      buildingOptions.value.sort((a, b) => {
        const nameA = a.name.toUpperCase() // ignore upper and lowercase
        const nameB = b.name.toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        // names must be equal
        return 0
      })
    })

    const buildImage = async (buildingId) => {
      let imageSource
      await ecoIslandStore.fetchBuildingImage(buildingId)
        .then((res) => {
          imageSource = 'data:image/jpeg;base64,' + res.data
        })

      const ctx = canvas.value.getContext('2d')
      image.crossOrigin = '*'
      image.onload = () => {
        canvas.value.width = image.width
        canvas.value.height = image.height
        ctx.drawImage(image, 0, 0, image.width, image.height)
        for (let i = 0; i < coordinates.value.length; i++) {
          drawCircle(coordinates.value[i].bins, coordinates.value[i].xPos, coordinates.value[i].yPos)
          drawText(ctx, coordinates.value[i].xPos, coordinates.value[i].yPos, '#000000', coordinates.value[i].identifier)
        }
      }
      image.src = imageSource
    }

    const drawText = (ctx, x, y, color, id) => {
      ctx.font = 'bold 15px Arial'
      const txt = 'E#' + id
      const width = ctx.measureText(txt).width
      console.log('width' + width + ':' + id + ':')
      ctx.fillStyle = '#EEEEEE'
      ctx.fillRect(x + 10, y - 15, width, 15)

      ctx.fillStyle = color
      ctx.textBaseline = 'top'
      ctx.fillText(txt, x + 10, y - 15)
    }

    const drawCircle = (bins, x, y) => {
      console.log('drawing', bins)
      const ctx = canvas.value.getContext('2d')

      switch (bins) {
        case '11':
          drawPartialCircle(ctx, x, y, 10, 0, 2 * Math.PI / 5, '#FFD133')
          drawPartialCircle(ctx, x, y, 10, 2 * Math.PI / 5, 4 * Math.PI / 5, '#111111')
          drawPartialCircle(ctx, x, y, 10, 4 * Math.PI / 5, 6 * Math.PI / 5, '#338AFF')
          drawPartialCircle(ctx, x, y, 10, 6 * Math.PI / 5, 8 * Math.PI / 5, '#5bfd02')
          drawPartialCircle(ctx, x, y, 10, 8 * Math.PI / 5, 0, '#785802')
          break
        case '01':
          drawPartialCircle(ctx, x, y, 10, 0, Math.PI / 2, '#FFD133')
          drawPartialCircle(ctx, x, y, 10, Math.PI / 2, Math.PI, '#111111')
          drawPartialCircle(ctx, x, y, 10, Math.PI, 3 * Math.PI / 2, '#338AFF')
          drawPartialCircle(ctx, x, y, 10, 3 * Math.PI / 2, 0, '#5bfd02')
          break
        case '10':
          drawPartialCircle(ctx, x, y, 10, 0, Math.PI / 2, '#FFD133')
          drawPartialCircle(ctx, x, y, 10, Math.PI / 2, Math.PI, '#111111')
          drawPartialCircle(ctx, x, y, 10, Math.PI, 3 * Math.PI / 2, '#338AFF')
          drawPartialCircle(ctx, x, y, 10, 3 * Math.PI / 2, 0, '#785802')
          break
        default:
          drawPartialCircle(ctx, x, y, 10, 0, 2 * Math.PI / 3, '#FFD133')
          drawPartialCircle(ctx, x, y, 10, 2 * Math.PI / 3, 4 * Math.PI / 3, '#111111')
          drawPartialCircle(ctx, x, y, 10, 4 * Math.PI / 3, 0, '#338AFF')
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

    function clickEvent (evt) {
      const rect = canvas.value.getBoundingClientRect()
      const x = evt.clientX - rect.left
      const y = evt.clientY - rect.top

      getCloserEcoisland(x, y)
    }

    const getCloserEcoisland = (x, y) => {
      const closestIsland = { id: -1, dist: 40 }

      for (let i = 0; i < coordinates.value.length; i++) {
        const a = coordinates.value[i].xPos - x
        const b = coordinates.value[i].yPos - y

        const c = Math.sqrt(a * a + b * b)
        if (c < closestIsland.dist) {
          closestIsland.id = coordinates.value[i].id
          closestIsland.dist = c
        }
      }

      if (closestIsland.id !== -1) {
        router.push('/ecoisland/' + closestIsland.id)
      }
    }

    return {
      updateBuilding,
      updateFloor,
      ecoIslandStore,
      getCoords,

      buildingOptions,
      floorOptions,
      subBuildingFloors,
      buildingFloors,
      building,
      floor,
      subFloor,
      userStore,
      canvas,

      test: (a) => {
        console.log(a)
      },

      buildImage,
      clickEvent
    }
  }
}
</script>
