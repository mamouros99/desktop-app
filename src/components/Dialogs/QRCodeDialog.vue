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
          class="row q-pa-lg bg-white justify-center"
        >

          <qrcode-vue

            :value="generateQrCode(islandid)"
            :size="300"
          />
          <div class="q-pt-lg" v-if="showUrl"><b>URL:</b> {{ generateQrCode(islandid) }}</div>

        </div>
      </q-card-section>
      <q-card-actions class="row justify-around ">
        <q-btn
          class="q-mb-sm"
          color="secondary"
          icon="download"
          label="Descarregar Imagem"
          @click="downloadQRCode3(islandid)"
        />
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
      showUrl
    }
  }
}
</script>
