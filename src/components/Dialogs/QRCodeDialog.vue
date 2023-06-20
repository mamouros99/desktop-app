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
          class="row q-pa-lg rounded-borders bg-white justify-center"
          style="border: 2px solid black">
          <qrcode-vue

            :value="generateQrCode(islandid)"
            :size="300"
          />
          <div class="q-pt-lg" v-if="showUrl"><b>URL:</b> http://193.136.129.238:8080/report/{{ islandid }}</div>
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
          label="Show URL"
          v-model="showUrl"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import { toBlob } from 'html-to-image'
import { saveAs } from 'file-saver'
import { ref } from 'vue'

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
      return 'http://193.136.129.238:8080/report/' + id
    }

    const downloadQRCode = (id) => {
      toBlob(document.getElementById('my-qr'))
        .then(function (blob) {
          if (window.saveAs) {
            window.saveAs(blob, 'qr-' + id + '.png')
          } else {
            saveAs(blob, 'qr-' + id + '.png')
          }
        })
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
