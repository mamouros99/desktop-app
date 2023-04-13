<template>
  <q-card flat bordered class="q-mt-lg bg-grey-2" style="">
    <q-card-section class="q-pl-lg text-grey-8">
      Legenda Caixotes:
    </q-card-section>
    <q-separator/>
    <q-card-section class="q-pt-sm" horizontal>
      <q-list
        v-for="bin in iconBins"
        :key="bin.name"
        class="row justify-around"
      >
        <q-item
          class="col-2 items-center"
        >
          <q-icon
            class="q-pr-sm"
            name="mdi-trash-can-outline"
            size="sm"
            :color="bin.color"
          />

          <div>
            {{ bin.name }}
          </div>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  name: 'BinsLegendCard',
  props: {
    iconBins: {}
  }
}
</script>
