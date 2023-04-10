<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          EcoTecnico Watcher
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item clickable v-ripple exact :to="{name: 'home'}">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>

            <q-item-section>
              Home
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{name: 'reports'}">
            <q-item-section avatar>
              <q-icon name="summarize" />
            </q-item-section>

            <q-item-section>
              Relatórios
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{name: 'ecoisland'}">
            <q-item-section avatar>
              <q-icon name="recycling" />
            </q-item-section>

            <q-item-section>
              Ecoilhas
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
