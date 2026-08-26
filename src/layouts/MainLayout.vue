<!-- src/layouts/MainLayout.vue -->

<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">

    <!-- Contenu des pages -->
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <!-- Navigation basse -->
    <q-footer elevated class="bottom-navigation">
      <q-tabs
        active-color="accent"
        indicator-color="accent"
        align="justify"
        class="navigation-tabs"
      >
        <q-route-tab
          to="/boissons"
          icon="local_bar"
          label="Boissons"
        />

        <q-route-tab
          to="/"
          icon="home"
          label="Accueil"
          exact
        />

        <q-route-tab
          to="/classement"
          icon="emoji_events"
          label="Classement"
        />

        <q-route-tab
          to="/profil"
          icon="person"
          label="Profil"
        />
      </q-tabs>
    </q-footer>

  </q-layout>
</template>

<style lang="scss" scoped>

.main-layout {
  width: 100%;
  min-height: 100dvh;
  background: transparent;
}

/* =========================
   NAVIGATION BASSE
   ========================= */

.bottom-navigation {
  background: $barrel-dark;
  border-top: 1px solid $wood-border;

  padding-bottom: env(safe-area-inset-bottom);
}

.navigation-tabs {
  color: $cream;
}

.navigation-tabs :deep(.q-tab--active) {
  color: $accent;
}

.navigation-tabs :deep(.q-tab) {
  min-height: 64px;
}

.navigation-tabs :deep(.q-icon) {
  font-size: 25px;
}


/* =========================
   TRANSITION DES PAGES
   ========================= */

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

</style>
