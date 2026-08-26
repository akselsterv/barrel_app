<template>

  <q-page class="profile-page">

    <!-- ========================================================= -->
    <!-- HEADER -->
    <!-- ========================================================= -->

    <div class="profile-header">

      <div class="profile-avatar">
        🍺
      </div>

      <div class="profile-header-info">

        <div class="profile-name">
          {{ profil.pseudo }}
        </div>

        <div class="profile-league">
          {{ ligueActuelle.emoji }}
          {{ ligueActuelle.nom }}
        </div>

      </div>

      <q-btn
        flat
        round
        dense
        icon="delete"
        class="reset-btn"
        @click="confirmReset"
      />

    </div>


    <!-- ========================================================= -->
    <!-- LIGUE -->
    <!-- ========================================================= -->

    <q-card
      class="league-card"
      flat
    >

      <q-card-section>

        <div class="league-header">

          <div>

            <div class="section-label">
              LIGUE ACTUELLE
            </div>

            <div class="league-name">
              {{ ligueActuelle.emoji }}
              {{ ligueActuelle.nom }}
            </div>

          </div>

          <div class="league-points">

            {{ profil.points }}

            <span>
              pts
            </span>

          </div>

        </div>


        <!-- PROGRESSION LIGUE -->

        <div class="league-progress">

          <div class="progress-background">

            <div
              class="progress-fill"
              :style="{
                width: progressionLigue + '%'
              }"
            />

          </div>

        </div>


        <div class="league-bottom">

          <span>
            {{ profil.points }} pts
          </span>

          <span>
            {{ ligueSuivante.points }} pts
          </span>

        </div>


        <!-- PROCHAINE LIGUE -->

        <div class="next-league">

          <div class="next-league-icon">
            {{ ligueSuivante.emoji }}
          </div>

          <div>

            <div class="next-league-label">
              Prochaine ligue
            </div>

            <div class="next-league-name">
              {{ ligueSuivante.nom }}
            </div>

          </div>

        </div>

      </q-card-section>

    </q-card>


    <!-- ========================================================= -->
    <!-- NIVEAU -->
    <!-- ========================================================= -->

    <div class="section-title">
      Mon niveau
    </div>

    <q-card
      class="level-card"
      flat
    >

      <q-card-section>

        <div class="level-top">

          <div>

            <div class="section-label">
              NIVEAU {{ profil.niveau }}
            </div>

            <div class="level-name">
              {{ profil.titre }}
            </div>

          </div>

          <div class="level-number">
            {{ profil.niveau }}
          </div>

        </div>


        <div class="level-progress">

          <div class="progress-background">

            <div
              class="level-progress-fill"
              :style="{
                width: progressionNiveau + '%'
              }"
            />

          </div>

        </div>


        <div class="level-bottom">

          <span>
            {{ profil.xp }} XP
          </span>

          <span>
            {{ profil.xpSuivant }} XP
          </span>

        </div>

      </q-card-section>

    </q-card>


    <!-- ========================================================= -->
    <!-- STATISTIQUES -->
    <!-- ========================================================= -->

    <div class="section-title">
      Mes statistiques
    </div>


    <div class="stats-grid">

      <!-- BOISSONS -->

      <q-card
        class="stat-card"
        flat
      >

        <q-card-section>

          <div class="stat-icon">
            🍺
          </div>

          <div class="stat-value">
            {{ stats.boissons }}
          </div>

          <div class="stat-label">
            boissons
          </div>

        </q-card-section>

      </q-card>


      <!-- LITRES -->

      <q-card
        class="stat-card"
        flat
      >

        <q-card-section>

          <div class="stat-icon">
            🍻
          </div>

          <div class="stat-value">
            {{ stats.litres }} L
          </div>

          <div class="stat-label">
            consommés
          </div>

        </q-card-section>

      </q-card>


      <!-- SOIREES -->

      <q-card
        class="stat-card"
        flat
      >

        <q-card-section>

          <div class="stat-icon">
            🎉
          </div>

          <div class="stat-value">
            {{ stats.soirees }}
          </div>

          <div class="stat-label">
            soirées
          </div>

        </q-card-section>

      </q-card>


      <!-- PRIX MOYEN -->

      <q-card
        class="stat-card"
        flat
      >

        <q-card-section>

          <div class="stat-icon">
            💰
          </div>

          <div class="stat-value">
            {{ stats.prixMoyen.toFixed(2) }} €
          </div>

          <div class="stat-label">
            prix moyen
          </div>

        </q-card-section>

      </q-card>

    </div>


    <!-- ========================================================= -->
    <!-- ACTIVITÉ -->
    <!-- ========================================================= -->

    <div class="section-title">
      Activité cette semaine
    </div>


    <q-card
      class="chart-card"
      flat
    >

      <q-card-section>

        <div class="chart-header">

          <div>

            <div class="chart-title">
              Consommations
            </div>

            <div class="chart-subtitle">
              Nombre de boissons
            </div>

          </div>

          <div class="chart-total">
            {{ totalSemaine }}
          </div>

        </div>


        <!-- BAR CHART -->

        <div class="bar-chart">

          <div
            v-for="jour in semaine"
            :key="jour.nom"
            class="bar-column"
          >

            <div class="bar-value">
              {{ jour.valeur }}
            </div>

            <div class="bar-container">

              <div
                class="bar"
                :style="{
                  height: getBarHeight(jour.valeur) + '%'
                }"
              />

            </div>

            <div class="bar-label">
              {{ jour.nom }}
            </div>

          </div>

        </div>

      </q-card-section>

    </q-card>


    <!-- ========================================================= -->
    <!-- RÉPARTITION -->
    <!-- ========================================================= -->

    <div class="section-title">
      Mes habitudes
    </div>


    <q-card
      class="chart-card"
      flat
    >

      <q-card-section>

        <div class="chart-title">
          Types de boissons
        </div>

        <div class="chart-subtitle">
          Répartition de tes consommations
        </div>


        <div class="pie-wrapper">

          <!-- CAMEMBERT -->

          <div
            class="pie-chart"
            :style="pieStyle"
          >

            <div class="pie-center">

              <strong>
                {{ totalTypes }}
              </strong>

              <span>
                boissons
              </span>

            </div>

          </div>


          <!-- LÉGENDE -->

          <div class="pie-legend">

            <div
              v-for="type in typesBoissons"
              :key="type.nom"
              class="legend-item"
            >

              <div
                class="legend-dot"
                :style="{
                  background: type.couleur
                }"
              />

              <div class="legend-info">

                <div class="legend-name">
                  {{ type.nom }}
                </div>

                <div class="legend-percent">
                  {{ getPourcentage(type.valeur) }}%
                </div>

              </div>

            </div>

          </div>

        </div>

      </q-card-section>

    </q-card>


    <!-- ========================================================= -->
    <!-- RECORDS -->
    <!-- ========================================================= -->

    <div class="section-title">
      Mes records
    </div>


    <div class="records-list">

      <q-card
        class="record-card"
        flat
      >

        <q-card-section class="record-content">

          <div class="record-icon">
            🔥
          </div>

          <div class="record-info">

            <div class="record-title">
              Plus grosse soirée
            </div>

            <div class="record-value">
              {{ records.plusGrosseSoiree }} boissons
            </div>

          </div>

          <q-icon
            name="chevron_right"
            class="record-arrow"
          />

        </q-card-section>

      </q-card>


      <q-card
        class="record-card"
        flat
      >

        <q-card-section class="record-content">

          <div class="record-icon">
            🍺
          </div>

          <div class="record-info">

            <div class="record-title">
              Boisson préférée
            </div>

            <div class="record-value">
              {{ records.boissonPreferee }}
            </div>

          </div>

          <q-icon
            name="chevron_right"
            class="record-arrow"
          />

        </q-card-section>

      </q-card>


      <q-card
        class="record-card"
        flat
      >

        <q-card-section class="record-content">

          <div class="record-icon">
            💰
          </div>

          <div class="record-info">

            <div class="record-title">
              Plus grosse addition
            </div>

            <div class="record-value">
              {{ records.plusGrosseAddition.toFixed(2) }} €
            </div>

          </div>

          <q-icon
            name="chevron_right"
            class="record-arrow"
          />

        </q-card-section>

      </q-card>

    </div>


    <!-- ========================================================= -->
    <!-- RÉCOMPENSES -->
    <!-- ========================================================= -->

    <div class="section-title">
      Récompenses
    </div>


    <div class="badges-grid">

      <div
        v-for="badge in badges"
        :key="badge.nom"
        class="badge"
        :class="{
          locked: !badge.obtenu
        }"
      >

        <div class="badge-icon">
          {{ badge.icon }}
        </div>

        <div class="badge-name">
          {{ badge.nom }}
        </div>

      </div>

    </div>

  </q-page>

</template>


<script setup>

import {
  ref,
  computed
} from 'vue'

import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'

const router = useRouter()

async function confirmReset() {
  const confirmation = window.confirm(
    'Supprimer toutes les données locales et revenir à la configuration du profil ?'
  )

  if (!confirmation) {
    return
  }

  const { error } = await supabase
    .from('utilisateurs')
    .delete()
    .not('id', 'is', null)

  if (error) {
    console.error('Erreur lors de la suppression :', error)
    return
  }

  localStorage.clear()
  router.push('/setup')
}


/*
|--------------------------------------------------------------------------
| PROFIL
|--------------------------------------------------------------------------
*/

const profil = ref({

  pseudo: 'Aksel',

  // Avatar fixe pour le moment
  avatar: '🍺',

  // Niveau indépendant des points de ligue
  niveau: 12,

  titre: 'Pilier de comptoir',

  xp: 780,

  xpSuivant: 1000,

  // Points utilisés uniquement pour la ligue
  points: 780

})


/*
|--------------------------------------------------------------------------
| LIGUES
|--------------------------------------------------------------------------
|
| Paliers temporaires en attendant
| les vrais paliers du jeu.
|
*/

const ligues = [

  {
    nom: 'Ligue 1',
    emoji: '🥇',
    points: 0
  },

  {
    nom: 'Ligue 2',
    emoji: '🥈',
    points: 1000
  },

  {
    nom: 'Ligue 3',
    emoji: '🥉',
    points: 2000
  },

  {
    nom: 'Ligue 4',
    emoji: '🍺',
    points: 3500
  },

  {
    nom: 'Ligue 5',
    emoji: '🍻',
    points: 5000
  }

]


/*
|--------------------------------------------------------------------------
| LIGUE ACTUELLE
|--------------------------------------------------------------------------
*/

const ligueActuelle = computed(() => {

  let actuelle = ligues[0]

  for (const ligue of ligues) {

    if (
      profil.value.points >= ligue.points
    ) {

      actuelle = ligue

    }

  }

  return actuelle

})


/*
|--------------------------------------------------------------------------
| LIGUE SUIVANTE
|--------------------------------------------------------------------------
*/

const ligueSuivante = computed(() => {

  const index = ligues.findIndex(
    ligue =>
      ligue.nom === ligueActuelle.value.nom
  )

  if (
    index === -1 ||
    index >= ligues.length - 1
  ) {

    return ligueActuelle.value

  }

  return ligues[index + 1]

})


/*
|--------------------------------------------------------------------------
| PROGRESSION LIGUE
|--------------------------------------------------------------------------
*/

const progressionLigue = computed(() => {

  const current =
    ligueActuelle.value.points

  const next =
    ligueSuivante.value.points

  if (next === current) {

    return 100

  }

  const progression =
    (
      (profil.value.points - current)
      /
      (next - current)
    ) * 100

  return Math.min(
    Math.max(progression, 0),
    100
  )

})


/*
|--------------------------------------------------------------------------
| PROGRESSION NIVEAU
|--------------------------------------------------------------------------
*/

const progressionNiveau = computed(() => {

  return Math.min(
    (
      profil.value.xp
      /
      profil.value.xpSuivant
    ) * 100,
    100
  )

})


/*
|--------------------------------------------------------------------------
| STATISTIQUES
|--------------------------------------------------------------------------
*/

const stats = ref({

  boissons: 147,

  litres: 42.8,

  soirees: 36,

  prixMoyen: 4.20

})


/*
|--------------------------------------------------------------------------
| ACTIVITÉ DE LA SEMAINE
|--------------------------------------------------------------------------
*/

const semaine = ref([

  {
    nom: 'Lun',
    valeur: 3
  },

  {
    nom: 'Mar',
    valeur: 6
  },

  {
    nom: 'Mer',
    valeur: 2
  },

  {
    nom: 'Jeu',
    valeur: 8
  },

  {
    nom: 'Ven',
    valeur: 12
  },

  {
    nom: 'Sam',
    valeur: 15
  },

  {
    nom: 'Dim',
    valeur: 5
  }

])


const totalSemaine = computed(() => {

  return semaine.value.reduce(
    (total, jour) =>
      total + jour.valeur,
    0
  )

})


const maxSemaine = computed(() => {

  return Math.max(
    ...semaine.value.map(
      jour => jour.valeur
    )
  )

})


function getBarHeight(value) {

  if (!maxSemaine.value) {

    return 0

  }

  return (
    value /
    maxSemaine.value
  ) * 100

}


/*
|--------------------------------------------------------------------------
| TYPES DE BOISSONS
|--------------------------------------------------------------------------
*/

const typesBoissons = ref([

  {
    nom: 'Bière',
    valeur: 72,
    couleur: '#E6A23C'
  },

  {
    nom: 'Cocktail',
    valeur: 18,
    couleur: '#C9822E'
  },

  {
    nom: 'Shot',
    valeur: 7,
    couleur: '#8B5A2B'
  },

  {
    nom: 'Autre',
    valeur: 3,
    couleur: '#6B4226'
  }

])


const totalTypes = computed(() => {

  return typesBoissons.value.reduce(
    (total, type) =>
      total + type.valeur,
    0
  )

})


function getPourcentage(value) {

  if (!totalTypes.value) {

    return 0

  }

  return Math.round(
    (
      value /
      totalTypes.value
    ) * 100
  )

}


/*
|--------------------------------------------------------------------------
| CAMEMBERT
|--------------------------------------------------------------------------
*/

const pieStyle = computed(() => {

  let current = 0

  const gradients = []

  typesBoissons.value.forEach(type => {

    const percentage =
      (
        type.valeur /
        totalTypes.value
      ) * 100

    const start = current

    const end =
      current + percentage

    gradients.push(
      `${type.couleur} ${start}% ${end}%`
    )

    current = end

  })

  return {

    background:
      `conic-gradient(
        ${gradients.join(', ')}
      )`

  }

})


/*
|--------------------------------------------------------------------------
| RECORDS
|--------------------------------------------------------------------------
*/

const records = ref({

  plusGrosseSoiree: 18,

  boissonPreferee: 'Leffe Blonde',

  plusGrosseAddition: 74.50

})


/*
|--------------------------------------------------------------------------
| BADGES
|--------------------------------------------------------------------------
*/

const badges = ref([

  {
    icon: '🍺',
    nom: 'Premier verre',
    obtenu: true
  },

  {
    icon: '🔥',
    nom: 'Grosse soirée',
    obtenu: true
  },

  {
    icon: '🍻',
    nom: '100 boissons',
    obtenu: true
  },

  {
    icon: '👑',
    nom: 'Roi du bar',
    obtenu: false
  },

  {
    icon: '💰',
    nom: 'Grand dépensier',
    obtenu: false
  },

  {
    icon: '🏆',
    nom: 'Top 10',
    obtenu: false
  }

])

</script>


<style scoped lang="scss">


/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

.profile-page {

  min-height: 100dvh;
  padding: 24px 16px 120px;
  padding-top: calc(24px + env(safe-area-inset-top));
  padding-right: calc(16px + env(safe-area-inset-right));
  padding-bottom: calc(120px + env(safe-area-inset-bottom));
  padding-left: calc(16px + env(safe-area-inset-left));

  color: $foam;

}


/*
|--------------------------------------------------------------------------
| HEADER
|--------------------------------------------------------------------------
*/

.profile-header {

  display: flex;

  align-items: center;

  margin-bottom: 24px;

}


.profile-avatar {

  width: 58px;

  height: 58px;

  min-width: 58px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: $barrel-light;

  border:
    2px solid
    $wood-border;

  border-radius: 50%;

  font-size: 30px;

  margin-right: 14px;

}


.profile-header-info {

  flex: 1;

}


.profile-name {

  color: $foam;

  font-size: 28px;

  font-weight: bold;

}


.profile-league {

  color: $accent;

  font-size: 14px;

  margin-top: 3px;

}


.reset-btn {

  color: $cream;

  opacity: 0.65;

}


.reset-btn:hover {

  opacity: 1;

  color: $negative;

}


/*
|--------------------------------------------------------------------------
| LIGUE
|--------------------------------------------------------------------------
*/

.league-card {

  background: $barrel;

  border-radius: 16px;

  margin-bottom: 26px;

  border:
    1px solid
    $wood-border;

}


.league-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

}


.section-label {

  color: $cream;

  opacity: 0.65;

  font-size: 11px;

  letter-spacing: 1px;

  font-weight: bold;

}


.league-name {

  color: $foam;

  font-size: 20px;

  font-weight: bold;

  margin-top: 4px;

}


.league-points {

  color: $accent;

  font-size: 25px;

  font-weight: bold;

}


.league-points span {

  font-size: 12px;

  font-weight: normal;

  color: $cream;

}


.league-progress {

  margin-top: 18px;

}


.progress-background {

  height: 8px;

  width: 100%;

  background: $barrel-dark;

  border-radius: 10px;

  overflow: hidden;

}


.progress-fill {

  height: 100%;

  background: $accent;

  border-radius: 10px;

  transition:
    width 0.4s ease;

}


.league-bottom {

  display: flex;

  justify-content: space-between;

  margin-top: 7px;

  color: $cream;

  opacity: 0.65;

  font-size: 11px;

}


.next-league {

  display: flex;

  align-items: center;

  margin-top: 18px;

  padding-top: 14px;

  border-top:
    1px solid
    rgba(232, 216, 184, 0.12);

}


.next-league-icon {

  width: 38px;

  height: 38px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: $barrel-dark;

  border-radius: 10px;

  font-size: 20px;

  margin-right: 10px;

}


.next-league-label {

  color: $cream;

  opacity: 0.55;

  font-size: 10px;

}


.next-league-name {

  color: $foam;

  font-size: 14px;

  font-weight: bold;

  margin-top: 2px;

}


/*
|--------------------------------------------------------------------------
| TITRES
|--------------------------------------------------------------------------
*/

.section-title {

  color: $foam;

  font-size: 20px;

  font-weight: bold;

  margin-top: 26px;

  margin-bottom: 12px;

}


/*
|--------------------------------------------------------------------------
| NIVEAU
|--------------------------------------------------------------------------
*/

.level-card {

  background: $barrel;

  border-radius: 16px;

  border:
    1px solid
    $wood-border;

}


.level-top {

  display: flex;

  align-items: center;

  justify-content: space-between;

}


.level-name {

  color: $foam;

  font-size: 18px;

  font-weight: bold;

  margin-top: 3px;

}


.level-number {

  display: flex;

  align-items: center;

  justify-content: center;

  width: 46px;

  height: 46px;

  background: $primary;

  color: $foam;

  border-radius: 50%;

  font-size: 20px;

  font-weight: bold;

}


.level-progress {

  margin-top: 18px;

}


.level-progress-fill {

  height: 100%;

  background: $primary;

  border-radius: 10px;

  transition:
    width 0.4s ease;

}


.level-bottom {

  display: flex;

  justify-content: space-between;

  margin-top: 7px;

  color: $cream;

  opacity: 0.65;

  font-size: 11px;

}


/*
|--------------------------------------------------------------------------
| STATISTIQUES
|--------------------------------------------------------------------------
*/

.stats-grid {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 10px;

}


.stat-card {

  background: $barrel;

  border-radius: 14px;

  border:
    1px solid
    $wood-border;

}


.stat-card .q-card__section {

  min-height: 125px;

  display: flex;

  flex-direction: column;

  justify-content: center;

}


.stat-icon {

  font-size: 24px;

  margin-bottom: 4px;

}


.stat-value {

  color: $accent;

  font-size: 24px;

  font-weight: bold;

}


.stat-label {

  color: $cream;

  opacity: 0.65;

  font-size: 12px;

  margin-top: 2px;

}


/*
|--------------------------------------------------------------------------
| GRAPHIQUES
|--------------------------------------------------------------------------
*/

.chart-card {

  background: $barrel;

  border-radius: 16px;

  border:
    1px solid
    $wood-border;

}


.chart-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

}


.chart-title {

  color: $foam;

  font-size: 17px;

  font-weight: bold;

}


.chart-subtitle {

  color: $cream;

  opacity: 0.6;

  font-size: 12px;

  margin-top: 3px;

}


.chart-total {

  color: $accent;

  font-size: 24px;

  font-weight: bold;

}


/*
|--------------------------------------------------------------------------
| BAR CHART
|--------------------------------------------------------------------------
*/

.bar-chart {

  height: 190px;

  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 8px;

  margin-top: 25px;

}


.bar-column {

  flex: 1;

  height: 100%;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: flex-end;

}


.bar-value {

  color: $cream;

  font-size: 10px;

  margin-bottom: 5px;

}


.bar-container {

  width: 100%;

  max-width: 28px;

  height: 130px;

  display: flex;

  align-items: flex-end;

  background: $barrel-dark;

  border-radius: 8px;

  overflow: hidden;

}


.bar {

  width: 100%;

  background: $primary;

  border-radius: 7px;

  min-height: 3px;

  transition:
    height 0.3s ease;

}


.bar-label {

  color: $cream;

  opacity: 0.6;

  font-size: 10px;

  margin-top: 7px;

}


/*
|--------------------------------------------------------------------------
| CAMEMBERT
|--------------------------------------------------------------------------
*/

.pie-wrapper {

  display: flex;

  align-items: center;

  gap: 25px;

  margin-top: 25px;

}


.pie-chart {

  position: relative;

  width: 150px;

  height: 150px;

  min-width: 150px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

}


.pie-chart::after {

  content: '';

  position: absolute;

  width: 82px;

  height: 82px;

  background: $barrel;

  border-radius: 50%;

}


.pie-center {

  position: relative;

  z-index: 2;

  display: flex;

  flex-direction: column;

  align-items: center;

}


.pie-center strong {

  color: $foam;

  font-size: 22px;

}


.pie-center span {

  color: $cream;

  opacity: 0.6;

  font-size: 9px;

}


/*
|--------------------------------------------------------------------------
| LÉGENDE
|--------------------------------------------------------------------------
*/

.pie-legend {

  flex: 1;

}


.legend-item {

  display: flex;

  align-items: center;

  margin-bottom: 13px;

}


.legend-dot {

  width: 10px;

  height: 10px;

  border-radius: 50%;

  margin-right: 9px;

}


.legend-info {

  display: flex;

  justify-content: space-between;

  width: 100%;

}


.legend-name {

  color: $cream;

  font-size: 12px;

}


.legend-percent {

  color: $accent;

  font-size: 12px;

  font-weight: bold;

}


/*
|--------------------------------------------------------------------------
| RECORDS
|--------------------------------------------------------------------------
*/

.records-list {

  display: flex;

  flex-direction: column;

  gap: 9px;

}


.record-card {

  background: $barrel;

  border-radius: 14px;

  border:
    1px solid
    $wood-border;

}


.record-content {

  display: flex;

  align-items: center;

  min-height: 70px;

}


.record-icon {

  width: 45px;

  font-size: 26px;

  text-align: center;

  margin-right: 10px;

}


.record-info {

  flex: 1;

}


.record-title {

  color: $foam;

  font-size: 14px;

  font-weight: bold;

}


.record-value {

  color: $accent;

  font-size: 12px;

  margin-top: 4px;

}


.record-arrow {

  color: $cream;

  opacity: 0.4;

}


/*
|--------------------------------------------------------------------------
| BADGES
|--------------------------------------------------------------------------
*/

.badges-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 10px;

}


.badge {

  min-height: 110px;

  padding: 12px 6px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

  background: $barrel;

  border:
    1px solid
    $wood-border;

  border-radius: 14px;

}


.badge-icon {

  font-size: 32px;

  margin-bottom: 7px;

}


.badge-name {

  color: $cream;

  font-size: 10px;

  line-height: 1.2;

}


.badge.locked {

  opacity: 0.3;

  filter: grayscale(1);

}


</style>
