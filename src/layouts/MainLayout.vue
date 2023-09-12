<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="userStore.hasAuthenticatied()"
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

        <q-btn-dropdown
          v-if="userStore.hasAuthenticatied()"
          flat
          :label="userStore.getFirstName() + ' ' + userStore.getLastName()"
        >

          <q-list class="q-py-sm">
            <q-separator/>

            <q-btn
              color="primary"
              icon="logout"
              class="full-width"
              flat
              v-close-popup
              label="Logout"
              @click="() => {
                userStore.logoutUser()
                reload()
              }"
            >
            </q-btn>
            <q-separator/>

            <q-btn
              color="primary"
              icon="settings"
              class="full-width"
              flat
              v-close-popup
              label="Profile"
              @click="() => {
                router.push({path: '/user/'+ userStore.getUsername()})
              }"
            >
            </q-btn>
            <q-separator/>
          </q-list>
        </q-btn-dropdown>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="userStore.hasAuthenticatied()"
      v-model="leftDrawerOpen" bordered>
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item clickable v-ripple exact :to="{name: 'home'}">
            <q-item-section avatar>
              <q-icon name="home"/>
            </q-item-section>

            <q-item-section>
              Home
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{name: 'reports'}">
            <q-item-section avatar>
              <q-icon name="summarize"/>
            </q-item-section>

            <q-item-section>
              Relatórios
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{name: 'ecoislands'}">
            <q-item-section avatar>
              <q-icon name="recycling"/>
            </q-item-section>

            <q-item-section>
              Ecoílhas
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{name: 'questions'}">
            <q-item-section avatar>
              <q-icon name="question_mark"/>
            </q-item-section>

            <q-item-section>
              Perguntas
            </q-item-section>
          </q-item>

          <q-item
            v-if="userStore.hasAdminPermissions()"
            clickable v-ripple :to="{name: 'admin'}">
            <q-item-section avatar>
              <q-icon name="group"/>
            </q-item-section>

            <q-item-section>
              Users
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useUserStore } from 'stores/UserStore'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false)
    const userStore = useUserStore()
    const router = useRouter()

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      userStore,
      router,
      reload: () => {
        location.reload()
      }
    }
  }
})
</script>
