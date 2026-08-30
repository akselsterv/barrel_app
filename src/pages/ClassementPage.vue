```vue
<template>
  <q-page class="classement-page">

    <!-- TITRE -->
    <div class="page-title">
      <div class="title">
        Classement
      </div>

      <div class="subtitle">
        Grimpe les ligues et deviens le meilleur 🍺
      </div>
    </div>

    <!-- CHARGEMENT -->
    <div
      v-if="loading"
      class="loading"
    >
      Chargement du classement...
    </div>

    <!-- LIGUES -->
    <div
      v-else
      v-for="ligue in ligues"
      :key="ligue.id"
      class="league"
    >

      <!-- HEADER LIGUE -->
      <div class="league-header">

        <div>
          <div class="league-name">
            {{ ligue.nom }}
          </div>

          <div class="league-description">
            {{ ligue.description }}
          </div>
        </div>

        <div class="league-icon">
          {{ ligue.icon }}
        </div>

      </div>

      <!-- JOUEURS -->
      <q-card class="players-card">

        <!-- Aucun joueur -->
        <div
          v-if="joueursParLigue(ligue.id).length === 0"
          class="no-player"
        >
          Aucun joueur dans cette ligue
        </div>

        <!-- Joueurs -->
        <div
          v-for="(joueur, index) in joueursParLigue(ligue.id)"
          :key="joueur.id"
          class="player"
        >

          <!-- POSITION -->
          <div class="position">

            <span v-if="index === 0">
              🥇
            </span>

            <span v-else-if="index === 1">
              🥈
            </span>

            <span v-else-if="index === 2">
              🥉
            </span>

            <span v-else>
              {{ index + 1 }}
            </span>

          </div>

          <!-- AVATAR -->
          <q-avatar
            size="42px"
            class="avatar"
          >
            {{
              joueur.pseudo
                ? joueur.pseudo.charAt(0).toUpperCase()
                : '?'
            }}
          </q-avatar>

          <!-- INFOS JOUEUR -->
          <div class="player-info">

            <div class="pseudo">
              {{ joueur.pseudo }}
            </div>

            <div class="points">
              {{ Number(joueur.pt) || 0 }} points
            </div>

          </div>

        </div>

      </q-card>

    </div>

  </q-page>
</template>

<script setup>

import {
  ref,
  onMounted
} from 'vue'

import {
  supabase
} from '@/services/supabase.js'

/*
|--------------------------------------------------------------------------
| LIGUES
|--------------------------------------------------------------------------
|
| Une seule source pour les ligues :
| src/data/ligues.js
|
*/

import {
  ligues,
  calculerLigue
} from '@/data/ligues.js'


// ========================================
// UTILISATEURS
// ========================================

const lst_utilisateurs = ref([])

const loading = ref(false)


// ========================================
// CHARGEMENT DES UTILISATEURS
// ========================================

async function chargerUtilisateurs() {

  loading.value = true

  try {

    const {
      data,
      error
    } = await supabase
      .from('utilisateurs')
      .select(`
        id,
        pseudo,
        pt,
        ligue
      `)
      .neq(
        'pseudo',
        'admin'
      )
      .order(
        'pt',
        {
          ascending: false
        }
      )

    if (error) {

      console.error(
        'Erreur chargement utilisateurs :',
        error
      )

      lst_utilisateurs.value = []

      return
    }

    lst_utilisateurs.value =
      data || []

    console.log(
      'Utilisateurs chargés :',
      lst_utilisateurs.value
    )

  } catch (error) {

    console.error(
      'Erreur inattendue chargement classement :',
      error
    )

    lst_utilisateurs.value = []

  } finally {

    loading.value = false

  }
}


// ========================================
// UTILISATEURS D'UNE LIGUE
// ========================================

function joueursParLigue(ligueId) {

  return lst_utilisateurs.value
    .filter(joueur => {

      const points = Number(joueur.pt) || 0

      const ligueCalculee =
        calculerLigue(points)

      return Number(ligueCalculee) ===
        Number(ligueId)

    })
    .sort(
      (a, b) =>
        Number(b.pt || 0) -
        Number(a.pt || 0)
    )
}

// ========================================
// CHARGEMENT
// ========================================

onMounted(() => {

  chargerUtilisateurs()

})

</script>

<style scoped lang="scss">

.classement-page {
  min-height: 100vh;

  padding: 24px 16px 140px;

  padding-top:
    calc(
      24px +
      env(safe-area-inset-top)
    );

  padding-right:
    calc(
      16px +
      env(safe-area-inset-right)
    );

  padding-bottom:
    calc(
      120px +
      env(safe-area-inset-bottom)
    );

  padding-left:
    calc(
      16px +
      env(safe-area-inset-left)
    );
}


/* ========================================
   TITRE
======================================== */

.page-title {
  margin-bottom: 30px;
}

.title {
  color: $foam;
  font-size: 32px;
  font-weight: bold;
}

.subtitle {
  color: $cream;
  font-size: 14px;
  margin-top: 5px;
}


/* ========================================
   CHARGEMENT
======================================== */

.loading {
  padding: 40px 20px;
  text-align: center;
  color: $cream;
}


/* ========================================
   LIGUE
======================================== */

.league {
  margin-bottom: 28px;
}

.league-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: $barrel;

  border-radius:
    16px
    16px
    0
    0;

  padding: 16px 18px;

  border-bottom:
    1px solid
    $wood-border;
}

.league-name {
  color: $accent;
  font-size: 23px;
  font-weight: bold;
}

.league-description {
  color: $cream;
  font-size: 13px;
  margin-top: 3px;
}

.league-icon {
  font-size: 35px;
}


/* ========================================
   LISTE
======================================== */

.players-card {
  background: $barrel-dark;

  border-radius:
    0
    0
    16px
    16px;

  overflow: hidden;
}


/* ========================================
   JOUEUR
======================================== */

.player {
  display: flex;
  align-items: center;

  min-height: 65px;

  padding: 10px 14px;

  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.05);
}

.player:last-child {
  border-bottom: none;
}


/* ========================================
   POSITION
======================================== */

.position {
  width: 35px;

  text-align: center;

  color: $cream;

  font-size: 15px;

  font-weight: bold;
}


/* ========================================
   AVATAR
======================================== */

.avatar {
  margin: 0 12px;

  background: $primary;

  color: $foam;

  font-weight: bold;
}


/* ========================================
   INFOS JOUEUR
======================================== */

.player-info {
  flex: 1;
}

.pseudo {
  color: $foam;

  font-size: 16px;

  font-weight: 600;
}

.points {
  color: $cream;

  font-size: 12px;

  margin-top: 2px;
}


/* ========================================
   AUCUN JOUEUR
======================================== */

.no-player {
  padding: 25px 15px;

  text-align: center;

  color: $cream;

  font-size: 14px;
}

</style>
```
