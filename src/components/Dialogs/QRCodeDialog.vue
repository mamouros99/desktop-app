<template>
  <q-dialog
    :model-value="showDialog"
    @update:modelValue="(value) => emitUpdate('update:showDialog', value )"
  >
    <q-card
      style="max-width: 500px; width: 50%"
      class="bg-grey-2"
    >
      <q-card-section>
        <div class="text-h6">QR Code</div>
      </q-card-section>
      <q-card-section>

        <div
          id="my-qr"
          class=" q-pa-lg bg-white"
          style="position: relative"
        >
          <div class="col-12 text-center q-pb-sm text-subtitle2" v-if="showId">{{ islandid }}</div>
          <div class="col-12 row justify-center">
            <qrcode-vue
              :value="generateQrCode(islandid)"
              :size="300"
            />
          </div>
          <div class="col-12 q-pt-lg text-center" v-if="showUrl"><b>URL:</b> {{ generateQrCode(islandid) }}</div>

        </div>
      </q-card-section>
      <q-card-actions class="row justify-around ">
        <q-btn
          class="q-mb-sm"
          color="secondary"
          icon="download"
          label="Descarregar Imagem"
          @click="downloadQRCode(islandid)"
        />
        <q-toggle
          size="sm"
          label="Show ID"
          v-model="showId"/>
        <q-toggle
          size="sm"
          label="Show URL"
          v-model="showUrl"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import { ref } from 'vue'
import html2canvas from 'html2canvas'

export default {
  // name: 'ComponentName',
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
  components: {
    QrcodeVue
  },
  setup (props, { emit }) {
    const emitUpdate = (event, value) => {
      emit(event, value)
    }
    const showUrl = ref(false)
    const showId = ref(true)

    const generateQrCode = (id) => {
      return process.env.VUE_APP_MOBILE_URL + '/report/' + id
    }

    const downloadQRCode = async () => {
      const element = document.getElementById('my-qr'),
        canvas = await html2canvas(element),
        data = canvas.toDataURL('image/png', 1)

      const link = document.createElement('a')
      link.download = 'qr-code.png'
      link.href = data
      link.click()
    }

    return {
      generateQrCode,
      emitUpdate,
      downloadQRCode,
      showUrl,
      showId
    }
  }
}
</script>
