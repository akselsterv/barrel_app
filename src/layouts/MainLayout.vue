<!-- src/layouts/MainLayout.vue -->

<template>
  <!-- DIALOG NOTIFICATION -->
    <q-dialog v-model="dialogNotification">
      <q-card class="notification-dialog">
        <q-card-section>
          <div class="dialog-title">
            📢 Notification
          </div>
        </q-card-section>

        <q-card-section class="notification-text">
          {{ notificationTexte }}
        </q-card-section>

        <q-card-section class="dialog-footer">
          <q-btn
            unelevated
            rounded
            label="OK"
            class="price-validate"
            @click="dialogNotification = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
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

<script setup>
  import {
    ref,
    onMounted,
  } from 'vue'

  import { supabase } from '@/services/supabase'

  onMounted(() => {
    verifierNotification()
  })

  /* ==========================================================================
  * NOTIFICATION
  *
  * À l'ouverture de l'app, on regarde s'il existe une notification
  * active (statut = true) dans la table "notification" et on l'affiche
  * dans un dialog avec son texte.
  * ========================================================================== */

  const dialogNotification = ref(false)

  const notificationTexte = ref('')

  async function verifierNotification() {
    try {
      const {
        data,
        error
      } = await supabase
        .from('notification')
        .select('statut, text')
        .eq('statut', true)
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error(
          'Erreur chargement notification :',
          error
        )

        return
      }

      if (data?.statut) {
        notificationTexte.value = data.text || ''
        console.log(notificationTexte.value)
        dialogNotification.value = true
      }
    } catch (error) {
      console.error(
        'Erreur inattendue notification :',
        error
      )
    }
  }
</script>

<style lang="scss" scoped>

.main-layout {
  width: 100%;
  min-height: 100dvh;
  background-image: url('../assets/barrel_side.png');
  background-repeat: repeat;
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


.notification-dialog {
  width: 90%;

  max-width: 380px;

  background: $barrel;

  color: $foam;

  border-radius: 18px;
}

.notification-text {
  color: $cream;

  font-size: 15px;

  line-height: 1.5;

  text-align: center;
}

.dialog-footer {
  display: flex;

  justify-content: center;

  padding-top: 0;
}

.price-validate {
  background: $primary;

  color: $foam;

  flex: 1;
}

</style>
