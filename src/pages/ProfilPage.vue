```vue
<template>
  <q-page class="profile-page">

    <!-- HEADER -->
    <div class="profile-header">
      <div class="profile-avatar">
        🍺
      </div>

      <div class="profile-header-info">
        <div class="profile-name">
          {{ profil.pseudo }}
        </div>

        <div class="profile-league">
          {{ ligueActuelle.icon }}
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

    <!-- CONFIRMATION RESET -->
    <div
      v-if="showResetConfirm"
      class="reset-confirm"
    >
      <div class="reset-confirm-title">
        Réinitialiser le profil ?
      </div>

      <div class="reset-confirm-message">
        Tes données locales seront supprimées et tu retourneras
        à la configuration du profil.
      </div>

      <div class="reset-confirm-actions">
        <button
          type="button"
          class="cancel-button"
          @click="cancelReset"
        >
          Annuler
        </button>

        <button
          type="button"
          class="confirm-button"
          @click="resetProfile"
        >
          Réinitialiser
        </button>
      </div>
    </div>

    <!-- LIGUE -->
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
              {{ ligueActuelle.icon }}
              {{ ligueActuelle.nom }}
            </div>
          </div>

          <div class="league-points">
            {{ profil.points }}
            <span>pts</span>
          </div>
        </div>

        <div class="league-progress">
          <div class="progress-background">
            <div
              class="progress-fill"
              :style="{
                width: progressionLigue + '%'
              }"
            ></div>
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

        <div class="next-league">
          <div class="next-league-icon">
            {{ ligueSuivante.icon }}
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

    <!-- MOIS -->
    <div class="section-title">
      Mois
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
            {{ statsMois.boissons }}
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
            {{ statsMois.litres.toFixed(2) }} L
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
            {{ statsMois.soirees }}
          </div>

          <div class="stat-label">
            soirées
          </div>
        </q-card-section>
      </q-card>

      <!-- DÉPENSES DU MOIS -->
      <q-card
        class="stat-card"
        flat
      >
        <q-card-section>
          <div class="stat-icon">
            💶
          </div>

          <div class="stat-value">
            {{ statsMois.depenses.toFixed(2) }} €
          </div>

          <div class="stat-label">
            dépensés
          </div>
        </q-card-section>
      </q-card>

      <!-- POINTS GAGNÉS -->
      <q-card
        class="stat-card"
        flat
      >
        <q-card-section>
          <div class="stat-icon">
            ⭐
          </div>

          <div class="stat-value">
            {{ statsMois.pointsGagnes }}
          </div>

          <div class="stat-label">
            points gagnés
          </div>
        </q-card-section>
      </q-card>

    </div>

    <!-- ACTIVITÉ CETTE SEMAINE -->
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
              ></div>
            </div>

            <div class="bar-label">
              {{ jour.nom }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- RÉPARTITION -->
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
              ></div>

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

    <!-- TOTAL -->
    <div class="section-title">
      Total
    </div>

    <div class="records-list">

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
              Total boissons
            </div>

            <div class="record-value">
              {{ total.totalBoisson }}
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card
        class="record-card"
        flat
      >
        <q-card-section class="record-content">
          <div class="record-icon">
            🍻
          </div>

          <div class="record-info">
            <div class="record-title">
              Total litres
            </div>

            <div class="record-value">
              {{ total.totalLitre.toFixed(2) }} L
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card
        class="record-card"
        flat
      >
        <q-card-section class="record-content">
          <div class="record-icon">
            🎉
          </div>

          <div class="record-info">
            <div class="record-title">
              Total soirées
            </div>

            <div class="record-value">
              {{ total.totalSoirees }}
            </div>
          </div>
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
              Total dépenses
            </div>

            <div class="record-value">
              {{ total.totalDepenses.toFixed(2) }} €
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card
        class="record-card"
        flat
      >
        <q-card-section class="record-content">
          <div class="record-icon">
            🧾
          </div>

          <div class="record-info">
            <div class="record-title">
              Dépenses / soirée
            </div>

            <div class="record-value">
              {{ total.totalDepensesSoirees.toFixed(2) }} €
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card
        class="record-card"
        flat
      >
        <q-card-section class="record-content">
          <div class="record-icon">
            📈
          </div>

          <div class="record-info">
            <div class="record-title">
              Record taux
            </div>

            <div class="record-value">
              {{ total.recordTaux.toFixed(3) }} g/L
            </div>
          </div>
        </q-card-section>
      </q-card>

    </div>

    <!-- BADGES -->
    <div class="section-title">
      Badges
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
  computed,
  onMounted,
  onActivated,
  onBeforeUnmount
} from 'vue'

import { useRouter } from 'vue-router'

import {
  ligues,
  getLigueById,
  calculerLigue
} from '@/data/ligues.js'

const router = useRouter()

/*
|--------------------------------------------------------------------------
| LOCAL STORAGE
|--------------------------------------------------------------------------
*/

const STORAGE_KEY_HISTORIQUE =
  'consommations'

const STORAGE_KEY_TAUX_MAX =
  'taux_max'

function lireJSON(
  cle,
  valeurParDefaut
) {
  try {
    const valeur =
      localStorage.getItem(cle)

    return valeur
      ? JSON.parse(valeur)
      : valeurParDefaut

  } catch (error) {
    console.error(
      `Erreur lecture ${cle}:`,
      error
    )

    return valeurParDefaut
  }
}

/*
|--------------------------------------------------------------------------
| DONNÉES RÉACTIVES
|--------------------------------------------------------------------------
*/

const showResetConfirm =
  ref(false)

const utilisateur =
  ref(
    lireJSON(
      'utilisateur',
      {}
    )
  )

const historiqueBrut =
  ref(
    lireJSON(
      STORAGE_KEY_HISTORIQUE,
      []
    )
  )

const tauxMax =
  ref(
    Number(
      localStorage.getItem(
        STORAGE_KEY_TAUX_MAX
      ) || 0
    )
  )

/*
|--------------------------------------------------------------------------
| RAFRAÎCHISSEMENT
|--------------------------------------------------------------------------
*/

function rafraichirDonnees() {

  utilisateur.value =
    lireJSON(
      'utilisateur',
      {}
    )

  historiqueBrut.value =
    lireJSON(
      STORAGE_KEY_HISTORIQUE,
      []
    )

  tauxMax.value =
    Number(
      localStorage.getItem(
        STORAGE_KEY_TAUX_MAX
      ) || 0
    )
}

function onStorage(event) {

  if (
    event.key ===
      STORAGE_KEY_HISTORIQUE ||
    event.key ===
      STORAGE_KEY_TAUX_MAX ||
    event.key ===
      'utilisateur'
  ) {
    rafraichirDonnees()
  }
}

onMounted(() => {

  rafraichirDonnees()

  window.addEventListener(
    'storage',
    onStorage
  )
})

onActivated(() => {
  rafraichirDonnees()
})

onBeforeUnmount(() => {

  window.removeEventListener(
    'storage',
    onStorage
  )
})

/*
|--------------------------------------------------------------------------
| RESET
|--------------------------------------------------------------------------
*/

function confirmReset() {
  showResetConfirm.value = true
}

function cancelReset() {
  showResetConfirm.value = false
}

function resetProfile() {

  showResetConfirm.value = false

  localStorage.clear()

  router.push('/setup')
}

/*
|--------------------------------------------------------------------------
| NORMALISATION HISTORIQUE
|
| Format attendu : [conso, dateISO, prix]
| Compatibilité conservée avec l'ancien format [conso, dateISO]
| (dans ce cas le prix, s'il existe, était imbriqué dans conso.prix).
|--------------------------------------------------------------------------
*/

const consommations =
  computed(() => {

    return historiqueBrut.value
      .map(element => {

        if (Array.isArray(element)) {

          const [
            conso,
            date,
            prix
          ] = element

          const prixFinal =
            prix !== undefined
              ? prix
              : (conso?.prix ?? null)

          return {
            ...conso,

            created_at:
              conso?.created_at ||
              date,

            prix:
              prixFinal
          }
        }

        /*
         * Compatibilité si d'anciennes
         * données existent.
         */
        return element
      })

      .filter(conso => {

        if (!conso) {
          return false
        }

        const date =
          new Date(
            conso.created_at
          )

        return !Number.isNaN(
          date.getTime()
        )
      })
  })

/*
|--------------------------------------------------------------------------
| PROFIL
|--------------------------------------------------------------------------
*/

const profil =
  computed(() => ({

    pseudo:
      utilisateur.value?.pseudo ||
      'Utilisateur',

    points:
      Number(
        utilisateur.value?.pt ||
        utilisateur.value?.points ||
        0
      )
  }))

/*
|--------------------------------------------------------------------------
| LIGUES
|--------------------------------------------------------------------------
*/

const ligueActuelle =
  computed(() => {

    const ligueId =
      calculerLigue(
        profil.value.points
      )

    return (
      getLigueById(ligueId) ||
      getLigueById(5)
    )
  })

const ligueSuivante =
  computed(() => {

    const index =
      ligues.findIndex(
        ligue =>
          Number(ligue.id) ===
          Number(ligueActuelle.value.id)
      )

    /*
     * Le tableau est classé :
     *
     * Diamant
     * Platine
     * Or
     * Argent
     * Bronze
     *
     * La ligue suivante est donc
     * l'élément précédent du tableau.
     */

    if (index <= 0) {
      return ligueActuelle.value
    }

    return ligues[index - 1]
  })

const progressionLigue =
  computed(() => {

    const current =
      Number(
        ligueActuelle.value.points
      )

    const next =
      Number(
        ligueSuivante.value.points
      )

    /*
     * Déjà au maximum :
     * Diamant n'a pas de ligue supérieure.
     */
    if (next === current) {
      return 100
    }

    const progression =
      (
        (
          profil.value.points -
          current
        ) /
        (
          next -
          current
        )
      ) * 100

    return Math.min(
      Math.max(
        progression,
        0
      ),
      100
    )
  })

/*
|--------------------------------------------------------------------------
| OUTILS DATE
|--------------------------------------------------------------------------
*/

function getDate(conso) {

  return new Date(
    conso.created_at
  )
}

function getDateKey(date) {

  const year =
    date.getFullYear()

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, '0')

  const day =
    String(
      date.getDate()
    ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function memeJour(
  date1,
  date2
) {

  return (
    date1.getFullYear() ===
      date2.getFullYear() &&
    date1.getMonth() ===
      date2.getMonth() &&
    date1.getDate() ===
      date2.getDate()
  )
}

/*
|--------------------------------------------------------------------------
| SOIRÉES
|
| Une "soirée" correspond à 2 jours calendaires consécutifs au maximum
| (ex : une soirée commencée le 28 et qui continue après minuit le 29
| ne compte que pour une seule soirée).
|--------------------------------------------------------------------------
*/

const UN_JOUR_MS =
  24 * 60 * 60 * 1000

function calculerClustersSoirees(
  liste
) {

  const joursUniques = [
    ...new Set(
      liste.map(
        conso =>
          getDateKey(
            getDate(conso)
          )
      )
    )
  ]
    .map(
      cle =>
        new Date(cle)
    )
    .sort(
      (a, b) => a - b
    )

  const clusters = []

  let clusterCourant = []

  for (
    const jour of joursUniques
  ) {

    if (
      clusterCourant.length === 0
    ) {

      clusterCourant.push(
        jour
      )

      continue
    }

    const dernierJour =
      clusterCourant[
        clusterCourant.length - 1
      ]

    const diffJours =
      Math.round(
        (
          jour -
          dernierJour
        ) /
        UN_JOUR_MS
      )

    if (diffJours <= 1) {

      clusterCourant.push(
        jour
      )

    } else {

      clusters.push(
        clusterCourant
      )

      clusterCourant = [jour]
    }
  }

  if (
    clusterCourant.length > 0
  ) {

    clusters.push(
      clusterCourant
    )
  }

  return clusters
}

const clustersSoirees =
  computed(() => {

    return calculerClustersSoirees(
      consommations.value
    )
  })

/*
|--------------------------------------------------------------------------
| MOIS ACTUEL
|--------------------------------------------------------------------------
*/

const consommationsMois =
  computed(() => {

    const maintenant =
      new Date()

    return consommations.value.filter(
      conso => {

        const date =
          getDate(conso)

        return (
          date.getMonth() ===
            maintenant.getMonth() &&
          date.getFullYear() ===
            maintenant.getFullYear()
        )
      }
    )
  })

const statsMois =
  computed(() => {

    const liste =
      consommationsMois.value

    const maintenant =
      new Date()

    const boissons =
      liste.length

    const volumeCl =
      liste.reduce(
        (
          somme,
          conso
        ) => {

          return (
            somme +
            (
              Number(
                conso.volume
              ) || 0
            )
          )
        },
        0
      )

    /*
     * volume est en centilitres
     */
    const litres =
      volumeCl / 100

    /*
     * Une soirée = un regroupement
     * de jours consécutifs (max 2 jours)
     * qui touche le mois en cours.
     */
    const soirees =
      clustersSoirees.value.filter(
        cluster =>
          cluster.some(
            jour =>
              jour.getMonth() ===
                maintenant.getMonth() &&
              jour.getFullYear() ===
                maintenant.getFullYear()
          )
      ).length

    const depenses =
      liste.reduce(
        (
          somme,
          conso
        ) => {

          return (
            somme +
            (
              Number(
                conso.prix
              ) || 0
            )
          )
        },
        0
      )

    /*
     * Si tu ajoutes plus tard un champ
     * points dans tes consommations,
     * il sera automatiquement utilisé.
     */
    const pointsGagnes =
      liste.reduce(
        (
          somme,
          conso
        ) => {

          return (
            somme +
            (
              Number(
                conso.volume *
                conso.degre
              ) || 0
            )
          )
        },
        0
      )

    return {
      boissons,
      litres,
      soirees,
      depenses,
      pointsGagnes
    }
  })

/*
|--------------------------------------------------------------------------
| ACTIVITÉ CETTE SEMAINE
|--------------------------------------------------------------------------
*/

const semaine =
  computed(() => {

    const maintenant =
      new Date()

    const debutSemaine =
      new Date(
        maintenant
      )

    const jour =
      maintenant.getDay()

    const decalage =
      jour === 0
        ? -6
        : 1 - jour

    debutSemaine.setDate(
      maintenant.getDate() +
      decalage
    )

    debutSemaine.setHours(
      0,
      0,
      0,
      0
    )

    const noms = [
      'Lun',
      'Mar',
      'Mer',
      'Jeu',
      'Ven',
      'Sam',
      'Dim'
    ]

    return noms.map(
      (
        nom,
        index
      ) => {

        const dateJour =
          new Date(
            debutSemaine
          )

        dateJour.setDate(
          debutSemaine.getDate() +
          index
        )

        const valeur =
          consommations.value.filter(
            conso =>
              memeJour(
                getDate(conso),
                dateJour
              )
          ).length

        return {
          nom,
          valeur
        }
      }
    )
  })

const totalSemaine =
  computed(() => {

    return semaine.value.reduce(
      (
        total,
        jour
      ) =>
        total +
        jour.valeur,
      0
    )
  })

const maxSemaine =
  computed(() => {

    return Math.max(
      0,
      ...semaine.value.map(
        jour =>
          jour.valeur
      )
    )
  })

function getBarHeight(
  value
) {

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

const couleursTypes = [
  '#E6A23C',
  '#C9822E',
  '#8B5A2B',
  '#6B4226',
  '#A66B3D',
  '#D4A373'
]

const typesBoissons =
  computed(() => {

    const compteur = {}

    consommations.value.forEach(
      conso => {

        const type =
          conso.type ||
          'Autre'

        compteur[type] =
          (
            compteur[type] ||
            0
          ) + 1
      }
    )

    return Object.entries(
      compteur
    ).map(
      (
        [nom, valeur],
        index
      ) => ({

        nom,
        valeur,

        couleur:
          couleursTypes[
            index %
            couleursTypes.length
          ]
      })
    )
  })

const totalTypes =
  computed(() => {

    return typesBoissons.value.reduce(
      (
        total,
        type
      ) =>
        total +
        type.valeur,
      0
    )
  })

function getPourcentage(
  value
) {

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

const pieStyle =
  computed(() => {

    if (!totalTypes.value) {

      return {
        background:
          'conic-gradient(rgba(255,255,255,0.1) 0% 100%)'
      }
    }

    let current = 0

    const gradients = []

    typesBoissons.value.forEach(
      type => {

        const percentage =
          (
            type.valeur /
            totalTypes.value
          ) * 100

        const start =
          current

        const end =
          current +
          percentage

        gradients.push(
          `${type.couleur} ${start}% ${end}%`
        )

        current = end
      }
    )

    return {
      background:
        `conic-gradient(${gradients.join(', ')})`
    }
  })

/*
|--------------------------------------------------------------------------
| TOTAL
|--------------------------------------------------------------------------
*/

const total =
  computed(() => {

    const liste =
      consommations.value

    const totalBoisson =
      liste.length

    const volumeTotalCl =
      liste.reduce(
        (
          somme,
          conso
        ) =>
          somme +
          (
            Number(
              conso.volume
            ) || 0
          ),
        0
      )

    const totalLitre =
      volumeTotalCl / 100

    /*
     * Nombre de "soirées" =
     * nombre de regroupements de jours
     * consécutifs (max 2 jours)
     * dans tout l'historique.
     */
    const totalSoirees =
      clustersSoirees.value.length

    const totalDepenses =
      liste.reduce(
        (
          somme,
          conso
        ) =>
          somme +
          (
            Number(
              conso.prix
            ) || 0
          ),
        0
      )

    /*
     * Dépense moyenne par soirée.
     */
    const totalDepensesSoirees =
      totalSoirees > 0
        ? (
            totalDepenses /
            totalSoirees
          )
        : 0

    return {
      totalBoisson,
      totalLitre,
      totalSoirees,
      totalDepenses,
      totalDepensesSoirees,

      recordTaux:
        tauxMax.value
    }
  })

/*
|--------------------------------------------------------------------------
| BADGES
|--------------------------------------------------------------------------
*/

const badges =
  computed(() => {

    const boissons =
      total.value.totalBoisson

    const soirees =
      total.value.totalSoirees

    const depenses =
      total.value.totalDepenses

    return [
      {
        icon: '🍺',
        nom: 'Premier verre',
        obtenu:
          boissons >= 1
      },

      {
        icon: '🔥',
        nom: 'Grosse soirée',
        obtenu:
          soirees >= 1
      },

      {
        icon: '🍻',
        nom: '100 boissons',
        obtenu:
          boissons >= 100
      },

      {
        icon: '👑',
        nom: 'Roi du bar',
        obtenu:
          boissons >= 500
      },

      {
        icon: '💰',
        nom: 'Grand dépensier',
        obtenu:
          depenses >= 500
      },

      {
        icon: '🏆',
        nom: 'Top 10',
        obtenu:
          profil.value.points >= 5000
      }
    ]
  })

</script>

<style scoped lang="scss">

.profile-page {
  min-height: 100dvh;

  padding: 24px 16px 120px;

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

  color: $foam;
}

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

/* RESET */

.reset-confirm {
  background: $barrel;

  border:
    1px solid
    $wood-border;

  border-radius: 16px;

  padding: 18px;

  margin-bottom: 20px;

  animation:
    resetAppear 0.2s ease;
}

.reset-confirm-title {
  color: $foam;

  font-size: 18px;

  font-weight: bold;
}

.reset-confirm-message {
  color: $cream;

  opacity: 0.7;

  font-size: 13px;

  line-height: 1.5;

  margin-top: 8px;
}

.reset-confirm-actions {
  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 16px;
}

.cancel-button,
.confirm-button {
  border: none;

  border-radius: 10px;

  padding: 10px 16px;

  font-size: 13px;

  font-weight: bold;

  cursor: pointer;
}

.cancel-button {
  background: $barrel-dark;

  color: $cream;
}

.confirm-button {
  background: $negative;

  color: white;
}

.cancel-button:active,
.confirm-button:active {
  transform: scale(0.97);
}

@keyframes resetAppear {

  from {
    opacity: 0;

    transform:
      translateY(-5px);
  }

  to {
    opacity: 1;

    transform:
      translateY(0);
  }
}

/* LIGUE */

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

/* TITRES */

.section-title {
  color: $foam;

  font-size: 20px;

  font-weight: bold;

  margin-top: 26px;

  margin-bottom: 12px;
}

/* STATISTIQUES */

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

/* GRAPHIQUES */

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

/* BAR CHART */

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

/* CAMEMBERT */

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

/* LÉGENDE */

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

/* TOTAL */

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

/* BADGES */

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
```
