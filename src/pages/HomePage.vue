<template>
  <q-page class="page">
    <!-- HEADER -->
    <div class="header">
      <div
        class="beer-fill"
        :style="{
          transform: `translateY(${100 - remplissage}%)`
        }"
      ></div>

      <div class="header-content">
        <div class="taux">
          {{ taux.toFixed(3) }} g/L
        </div>

        <div class="subtitle">
          <template v-if="!peutConduire">
            Tu peux conduire dans {{ tempsAvantDeConduireLabel }}
          </template>

          <template v-else>
            Tu peux conduire
          </template>
        </div>
      </div>
    </div>

    <!-- CONSOMMATIONS EN COURS -->
    <div class="content">
      <div class="section-title">
        Mes consommations
      </div>

      <!-- BOUTON RESET ADMIN -->
      <q-btn
        v-if="isAdmin"
        class="reset-button"
        unelevated
        rounded
        label="Réinitialiser le taux"
        @click="resetTaux"
        color="red"
      />

      <div
        v-if="consommationsEnCours.length === 0"
        class="empty"
      >
        Aucune consommation :(
      </div>

      <q-card
        v-for="item in consommationsEnCours"
        :key="item.id"
        class="conso-card"
      >
        <q-card-section
          class="conso-content"
          @click="ouvrirPrixDialog(item)"
        >
          <div class="conso-icon">
            {{ getIcon(item.conso.type) }}
          </div>

          <div class="conso-info">
            <div class="conso-type">
              {{ item.conso.nom }}
            </div>

            <div class="conso-time">
              {{ formatHeure(item.heure) }}

              <span
                v-if="
                  item.prix !== null &&
                  item.prix !== undefined
                "
                class="conso-prix"
              >
                · {{ formatPrix(item.prix) }}
              </span>
            </div>

            <div class="drink-details">
              <span>{{ item.conso.degre }}°</span>
              <span> • </span>
              <span>{{ item.conso.volume }} cl</span>
            </div>
          </div>

          <q-space />

          <button
            v-if="peutSupprimer(item)"
            class="delete-btn"
            @click.stop="supprimerConsommation(item)"
          >
            ✕
          </button>
        </q-card-section>
      </q-card>

      <!-- BOUTON AJOUT -->
      <q-btn
        class="drink-button"
        unelevated
        rounded
        label="Je bois"
        @click="ouvrirPanel"
      />
    </div>

    <!-- DIALOG SÉLECTION -->
    <q-dialog v-model="dialog">
      <q-card class="drink-dialog">
        <q-card-section>
          <div class="dialog-title">
            Qu'est-ce que tu bois ?
          </div>
        </q-card-section>

        <q-card-section
          v-if="loadingConsos"
          class="dialog-loading"
        >
          <q-spinner
            color="primary"
            size="32px"
          />
        </q-card-section>

        <q-card-section
          v-else-if="catalogue.length === 0"
          class="dialog-empty"
        >
        </q-card-section>

        <q-card-section
          v-else
          class="drink-list"
        >
          <q-btn
            v-for="conso in catalogue"
            :key="conso.id"
            class="drink-item"
            unelevated
            align="left"
            @click="ajouterConsommation(conso)"
          >
            <div class="drink-item-icon">
              {{ getIcon(conso.type) }}
            </div>

            <div class="drink-item-info">
              <div class="drink-item-name">
                {{ conso.nom }}
              </div>

              <div class="drink-item-details">
                {{ conso.volume }} cl · {{ conso.degre }}°
              </div>
            </div>
          </q-btn>
        </q-card-section>

        <q-card-section class="dialog-footer">
          <q-btn
            flat
            rounded
            label="Rien de tout ça"
            class="none-button"
            @click="allerVersBoissons"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DIALOG PRIX -->
    <q-dialog v-model="dialogPrix">
      <q-card class="price-dialog">
        <q-card-section>
          <div class="dialog-title">
            Prix de "{{ consoPourPrix?.conso?.nom }}"
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model.number="prixSaisi"
            type="number"
            step="0.1"
            min="0"
            suffix="€"
            outlined
            dense
            dark
            label="Prix payé"
            class="price-input"
          />
        </q-card-section>

        <q-card-section class="price-actions">
          <q-btn
            flat
            rounded
            label="Annuler"
            class="none-button"
            @click="dialogPrix = false"
          />

          <q-btn
            unelevated
            rounded
            label="Valider"
            class="price-validate"
            @click="validerPrix"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch
} from 'vue'

import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'

const router = useRouter()

/* ==========================================================================
 * CLÉS LOCAL STORAGE
 * ========================================================================== */

const STORAGE_KEY_HISTORIQUE = 'consommations'
const STORAGE_KEY_CONSOS_EN_COURS = 'consommationsEnCours'
const STORAGE_KEY_TAUX = 'tauxActuel'
const STORAGE_KEY_TAUX_MAX = 'taux_max'

/* ==========================================================================
 * UTILISATEUR
 * ========================================================================== */

let utilisateur = null

try {
  utilisateur = JSON.parse(
    localStorage.getItem('utilisateur') || 'null'
  )
} catch (error) {
  console.error(
    'Erreur lecture utilisateur localStorage :',
    error
  )

  utilisateur = null
}

const poids =
  Number(
    utilisateur?.poids ??
    utilisateur?.poid ??
    70
  ) || 70

const sexe =
  utilisateur?.sexe || 'autre'

const jpermis =
  !!utilisateur?.jpermis

const isAdmin =
  utilisateur?.pseudo === 'admin'

/* ==========================================================================
 * WIDMARK
 * ========================================================================== */

function coefficientDiffusion(sexe) {
  if (sexe === 'homme') {
    return 0.7
  }

  if (sexe === 'femme') {
    return 0.6
  }

  return 0.65
}

const r = coefficientDiffusion(sexe)

const BETA = 0.15

const SEUIL_LEGAL = jpermis
  ? 0.2
  : 0.5

const DELAI_SUPPRESSION =
  5 * 60 * 1000

/* ==========================================================================
 * ICÔNES
 * ========================================================================== */

function getIcon(type) {
  const icons = {
    pinte: '🍺',
    demi: '🍺',
    cocktail: '🍹',
    shot: '🥛'
  }

  return icons[type] || '🍺'
}

/* ==========================================================================
 * CATALOGUE SUPABASE
 * ========================================================================== */

const catalogue = ref([])

const loadingConsos = ref(false)

async function chargerCatalogue() {
  loadingConsos.value = true

  try {
    const {
      data,
      error
    } = await supabase
      .from('conso')
      .select('*')
      .order('nom', {
        ascending: true
      })

    if (error) {
      console.error(
        'Erreur chargement catalogue :',
        error
      )

      return
    }

    catalogue.value = data || []
  } catch (error) {
    console.error(
      'Erreur inattendue catalogue :',
      error
    )
  } finally {
    loadingConsos.value = false
  }
}

/* ==========================================================================
 * CONSOMMATIONS EN COURS
 * ========================================================================== */

const dialog = ref(false)

const consommationsEnCours = ref([])

function restaurerConsommationsEnCours() {
  const brut = localStorage.getItem(
    STORAGE_KEY_CONSOS_EN_COURS
  )

  if (!brut) {
    return
  }

  try {
    const parsed = JSON.parse(brut)

    consommationsEnCours.value =
      Array.isArray(parsed)
        ? parsed.map(item => ({
            ...item,
            heure: new Date(item.heure)
          }))
        : []
  } catch (error) {
    console.error(
      'Erreur lecture consommationsEnCours :',
      error
    )

    consommationsEnCours.value = []
  }
}

watch(
  consommationsEnCours,
  valeur => {
    localStorage.setItem(
      STORAGE_KEY_CONSOS_EN_COURS,
      JSON.stringify(valeur)
    )
  },
  {
    deep: true
  }
)

/* ==========================================================================
 * HISTORIQUE PERMANENT
 *
 * Format d'une entrée : [conso, dateISO, prix]
 * (le prix est initialisé au prix de base de la boisson au moment de
 * l'ajout, puis peut être modifié via le dialog "Prix" de cette page)
 * ========================================================================== */

function lireHistorique() {
  try {
    const historique = JSON.parse(
      localStorage.getItem(
        STORAGE_KEY_HISTORIQUE
      ) || '[]'
    )

    return Array.isArray(historique)
      ? historique
      : []
  } catch (error) {
    console.error(
      'Erreur lecture historique :',
      error
    )

    return []
  }
}

function sauvegarderHistorique(historique) {
  localStorage.setItem(
    STORAGE_KEY_HISTORIQUE,
    JSON.stringify(historique)
  )
}

/**
 * Récupère l'objet conso d'une entrée d'historique, qu'elle soit
 * au nouveau format [conso, date, prix] ou à l'ancien format
 * [conso, date].
 */
function extraireConsoTuple(tuple) {
  return Array.isArray(tuple)
    ? tuple[0]
    : tuple
}

/* ==========================================================================
 * CALCUL DES POINTS
 * ========================================================================== */

/**
 * Calcule les points gagnés pour une consommation.
 *
 * Exemple :
 * 25 cl à 5° = 25 × 5 = 125 points
 */
function calculerPoints(conso) {
  const degre = Number(conso?.degre) || 0
  const volume = Number(conso?.volume) || 0

  if (degre <= 0 || volume <= 0) {
    return 0
  }

  return degre * volume
}

/* ==========================================================================
 * AJOUT DES POINTS
 * ========================================================================== */

/**
 * Ajoute les points dans Supabase puis synchronise
 * le localStorage.
 */
async function ajouterPoints(points) {
  if (!utilisateur?.id) {
    console.error(
      'Impossible d’ajouter les points : utilisateur.id absent.'
    )

    return false
  }

  const pointsAjoutes = Number(points) || 0

  if (pointsAjoutes <= 0) {
    console.warn('Aucun point à ajouter.')
    return true
  }

  try {
    console.log(
      'Tentative ajout de points :',
      pointsAjoutes
    )

    console.log(
      'Utilisateur concerné :',
      utilisateur.id
    )

    /* ----------------------------------------------------------------------
     * APPEL DE LA FONCTION SUPABASE (RPC) "ajouter_points_utilisateur"
     *
     * L'incrémentation (pt = pt + p_points) est faite de façon atomique
     * directement en base, dans une fonction "security definer" : ça
     * évite le blocage par la RLS (aucune policy UPDATE publique
     * nécessaire) et surtout la race condition de l'ancien code, qui
     * lisait "pt" puis le réécrivait : si deux consommations étaient
     * ajoutées rapprochées, la seconde repartait de la même valeur de
     * départ et écrasait la première au lieu de s'additionner.
     * ---------------------------------------------------------------------- */

    const {
      data,
      error: erreurRpc
    } = await supabase.rpc(
      'ajouter_points_utilisateur',
      {
        p_user_id: utilisateur.id,
        p_points: pointsAjoutes
      }
    )

    if (erreurRpc) {
      console.error(
        'Erreur RPC ajouter_points_utilisateur :',
        erreurRpc
      )

      return false
    }

    const resultat =
      Array.isArray(data)
        ? data[0]
        : data

    if (!resultat) {
      console.error(
        'Aucun résultat renvoyé par ajouter_points_utilisateur.'
      )

      return false
    }

    /* ----------------------------------------------------------------------
     * MISE À JOUR LOCAL STORAGE
     *
     * On se base sur la valeur renvoyée par Supabase (qui fait foi),
     * jamais sur un calcul local.
     * ---------------------------------------------------------------------- */

    utilisateur.pt = Number(resultat.pt) || 0
    utilisateur.ligue = Number(resultat.ligue) || 5

    localStorage.setItem(
      'utilisateur',
      JSON.stringify(utilisateur)
    )

    console.log(
      'Points enregistrés avec succès.'
    )

    console.log(
      'Total points :',
      utilisateur.pt
    )

    console.log(
      'Ligue :',
      utilisateur.ligue
    )

    return true

  } catch (error) {
    console.error(
      'Erreur inattendue lors de l’ajout des points :',
      error
    )

    return false
  }
}

/* ==========================================================================
 * AJOUT CONSOMMATION
 * ========================================================================== */

async function ajouterConsommation(consoCatalogue) {
  const date = new Date()

  const idLocal =
    crypto.randomUUID()

  /* ------------------------------------------------------------------------
   * CRÉATION DE LA CONSOMMATION
   *
   * Le prix payé est stocké séparément dans le tuple d'historique
   * (voir plus bas), initialisé au prix de base de la boisson
   * (null si le catalogue n'en définit pas). Il pourra être modifié
   * ensuite via le dialog "Prix" de cette page.
   * ------------------------------------------------------------------------ */

  const prixDeBase =
    consoCatalogue.prix ?? null

  const conso = {
    id: consoCatalogue.id,

    local_id: idLocal,

    nom: consoCatalogue.nom,

    volume:
      Number(consoCatalogue.volume) || 0,

    degre:
      Number(consoCatalogue.degre) || 0,

    type:
      consoCatalogue.type || 'autre',

    createur_id:
      consoCatalogue.createur_id ??
      utilisateur?.id ??
      null,

    created_at:
      date.toISOString()
  }

  console.log(
    'Nouvelle consommation :',
    conso
  )

  /* ------------------------------------------------------------------------
   * AJOUT CONSOMMATION EN COURS
   * ------------------------------------------------------------------------ */

  consommationsEnCours.value.push({
    id: idLocal,
    conso,
    heure: date,
    prix: prixDeBase
  })

  /* ------------------------------------------------------------------------
   * AJOUT HISTORIQUE
   *
   * Tuple : [conso, dateISO, prix]
   * ------------------------------------------------------------------------ */

  const historique =
    lireHistorique()

  historique.push([
    conso,
    date.toISOString(),
    prixDeBase
  ])

  sauvegarderHistorique(
    historique
  )

  /* ------------------------------------------------------------------------
   * CALCUL DES POINTS
   * ------------------------------------------------------------------------ */

  const pointsGagnes =
    calculerPoints(conso)

  console.log(
    'Points gagnés :',
    pointsGagnes
  )

  /* ------------------------------------------------------------------------
   * AJOUT DES POINTS
   * ------------------------------------------------------------------------ */

  if (pointsGagnes > 0) {
    const succes =
      await ajouterPoints(pointsGagnes)

    if (!succes) {
      console.error(
        'La consommation a bien été ajoutée, mais les points n’ont pas pu être synchronisés.'
      )
    }
  }

  /* ------------------------------------------------------------------------
   * FERMETURE DU DIALOG
   * ------------------------------------------------------------------------ */

  dialog.value = false
}

/* ==========================================================================
 * SUPPRESSION
 * ========================================================================== */

const maintenant = ref(
  Date.now()
)

function peutSupprimer(item) {
  if (!item?.heure) {
    return false
  }

  return (
    maintenant.value -
    new Date(item.heure).getTime()
  ) < DELAI_SUPPRESSION
}

function supprimerConsommation(item) {
  /* ------------------------------------------------------------------------
   * SUPPRESSION CONSOMMATION ACTIVE
   * ------------------------------------------------------------------------ */

  consommationsEnCours.value =
    consommationsEnCours.value.filter(
      i => i.id !== item.id
    )

  /* ------------------------------------------------------------------------
   * SUPPRESSION HISTORIQUE
   * ------------------------------------------------------------------------ */

  const historique =
    lireHistorique()

  const nouveauHistorique =
    historique.filter(tuple => {
      const conso =
        extraireConsoTuple(tuple)

      return (
        conso?.local_id !== item.id
      )
    })

  sauvegarderHistorique(
    nouveauHistorique
  )
}

/* ==========================================================================
 * NAVIGATION
 * ========================================================================== */

function ouvrirPanel() {
  dialog.value = true

  if (catalogue.value.length === 0) {
    chargerCatalogue()
  }
}

function allerVersBoissons() {
  dialog.value = false

  router.push('/boissons')
}

/* ==========================================================================
 * RESET TAUX
 * ========================================================================== */

function resetTaux() {
  consommationsEnCours.value = []

  localStorage.setItem(
    STORAGE_KEY_TAUX,
    '0'
  )

  localStorage.setItem(
    STORAGE_KEY_TAUX_MAX,
    '0'
  )

  console.log(
    'Taux réinitialisé.'
  )
}

/* ==========================================================================
 * FORMAT
 * ========================================================================== */

function formatHeure(date) {
  return new Date(date).toLocaleTimeString(
    'fr-FR',
    {
      hour: '2-digit',
      minute: '2-digit'
    }
  )
}

function formatPrix(prix) {
  return `${Number(prix).toFixed(2)} €`
}

/* ==========================================================================
 * PRIX
 * ========================================================================== */

const dialogPrix = ref(false)

const consoPourPrix = ref(null)

const prixSaisi = ref(null)

function ouvrirPrixDialog(item) {
  consoPourPrix.value = item

  prixSaisi.value =
    item.prix ?? null

  dialogPrix.value = true
}

function validerPrix() {
  if (!consoPourPrix.value) {
    dialogPrix.value = false
    return
  }

  let prix = null

  if (
    prixSaisi.value !== null &&
    prixSaisi.value !== ''
  ) {
    prix = Number(prixSaisi.value)

    if (
      !Number.isFinite(prix) ||
      prix < 0
    ) {
      prix = null
    }
  }

  /* ------------------------------------------------------------------------
   * MISE À JOUR CONSOMMATION ACTIVE
   * ------------------------------------------------------------------------ */

  consoPourPrix.value.prix = prix

  /* ------------------------------------------------------------------------
   * MISE À JOUR HISTORIQUE
   *
   * On met à jour le 3ème élément du tuple [conso, date, prix]
   * correspondant, sans toucher au reste.
   * ------------------------------------------------------------------------ */

  const historique =
    lireHistorique()

  const idLocal =
    consoPourPrix.value.id

  const nouvelHistorique =
    historique.map(tuple => {
      if (!Array.isArray(tuple)) {
        return tuple
      }

      const [
        conso,
        date
      ] = tuple

      if (
        conso?.local_id === idLocal
      ) {
        return [
          conso,
          date,
          prix
        ]
      }

      return tuple
    })

  sauvegarderHistorique(
    nouvelHistorique
  )

  dialogPrix.value = false
}

/* ==========================================================================
 * HORLOGE
 * ========================================================================== */

let interval = null

onMounted(() => {
  restaurerConsommationsEnCours()

  chargerCatalogue()

  interval = setInterval(() => {
    maintenant.value = Date.now()
  }, 15000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

/* ==========================================================================
 * CALCUL TAUX WIDMARK
 * ========================================================================== */

function tauxInitial(conso) {
  const volumeMl =
    Number(conso.volume) * 10

  const grammesAlcool =
    volumeMl *
    (Number(conso.degre) / 100) *
    0.8

  return (
    grammesAlcool /
    (poids * r)
  )
}

const taux = computed(() => {
  const events = [
    ...consommationsEnCours.value
  ].sort(
    (a, b) =>
      a.heure.getTime() -
      b.heure.getTime()
  )

  let concentration = 0

  let dernierTemps = null

  for (const item of events) {
    if (dernierTemps !== null) {
      const heuresEcoulees =
        (
          item.heure.getTime() -
          dernierTemps
        ) / 3600000

      concentration =
        Math.max(
          0,
          concentration -
          BETA * heuresEcoulees
        )
    }

    concentration +=
      tauxInitial(item.conso)

    dernierTemps =
      item.heure.getTime()
  }

  if (dernierTemps !== null) {
    const heuresEcoulees =
      (
        maintenant.value -
        dernierTemps
      ) / 3600000

    concentration =
      Math.max(
        0,
        concentration -
        BETA * heuresEcoulees
      )
  }

  return concentration
})

/* ==========================================================================
 * NETTOYAGE CONSOMMATIONS ACTIVES
 * ========================================================================== */

watch(
  taux,
  (nouveauTaux, ancienTaux) => {
    if (
      ancienTaux > 0 &&
      nouveauTaux === 0
    ) {
      consommationsEnCours.value = []
    }
  }
)

/* ==========================================================================
 * TAUX ACTUEL + TAUX MAX
 * ========================================================================== */

watch(
  taux,
  valeur => {
    localStorage.setItem(
      STORAGE_KEY_TAUX,
      valeur.toString()
    )

    const ancienTauxMax =
      Number(
        localStorage.getItem(
          STORAGE_KEY_TAUX_MAX
        ) || 0
      )

    if (
      valeur > ancienTauxMax
    ) {
      localStorage.setItem(
        STORAGE_KEY_TAUX_MAX,
        valeur.toString()
      )
    }
  },
  {
    immediate: true
  }
)

/* ==========================================================================
 * CONDUITE
 * ========================================================================== */

const peutConduire = computed(() => {
  return taux.value <= SEUIL_LEGAL
})

const instantSobriete = computed(() => {
  if (
    taux.value <= SEUIL_LEGAL
  ) {
    return maintenant.value
  }

  const heuresRestantes =
    (
      taux.value -
      SEUIL_LEGAL
    ) / BETA

  return (
    maintenant.value +
    heuresRestantes * 3600000
  )
})

const tempsAvantDeConduire =
  computed(() => {
    const minutes =
      Math.ceil(
        (
          instantSobriete.value -
          maintenant.value
        ) / 60000
      )

    return Math.max(
      0,
      minutes
    )
  })

const tempsAvantDeConduireLabel =
  computed(() => {
    const total =
      tempsAvantDeConduire.value

    const h =
      Math.floor(total / 60)

    const m =
      total % 60

    if (h === 0) {
      return `${m} min`
    }

    return `${h} h ${m
      .toString()
      .padStart(2, '0')}`
  })

/* ==========================================================================
 * REMPLISSAGE VISUEL
 * ========================================================================== */

const ECHELLE_TAUX = 3

const remplissage = computed(() => {
  const pourcentage =
    (
      taux.value /
      ECHELLE_TAUX
    ) * 100

  return Math.min(
    Math.max(
      pourcentage,
      0
    ),
    100
  )
})
</script>

<style scoped lang="scss">
.page {
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
}

.header {
  position: relative;

  height: 320px;

  overflow: hidden;

  background-image:
    url('../assets/glass.png');

  background-size: 100% 100%;

  background-position:
    center bottom;

  z-index: 10;
}

.beer-fill {
  position: absolute;

  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background-image:
    url('../assets/biere.png');

  background-size: 80% 100%;

  background-position:
    center bottom;

  background-repeat: repeat;

  transition:
    transform 1s ease;

  z-index: 0;
}

.header-content {
  position: relative;

  z-index: 1;

  height: 100%;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;
}

.taux {
  font-size: 48px;

  font-weight: bold;

  color: $beer-amber;
}

.subtitle {
  margin-top: 8px;

  font-size: 22px;

  font-weight: bold;

  color: $beer-amber;
}

.content {
  padding: 24px 16px;
}

.section-title {
  font-size: 24px;

  font-weight: bold;

  color: $foam;

  margin-bottom: 16px;
}

.reset-button {
  width: 100%;

  height: 44px;

  margin-bottom: 16px;

  background: $barrel-light;

  color: $foam;

  font-size: 14px;

  font-weight: bold;
}

.empty {
  text-align: center;

  color: $cream;

  opacity: 0.7;

  margin: 40px 0;
}

.conso-card {
  margin-bottom: 12px;

  background: $barrel;

  color: $foam;

  border-radius: 14px;
}

.conso-content {
  display: flex;

  align-items: center;

  cursor: pointer;
}

.conso-icon {
  font-size: 32px;

  margin-right: 16px;
}

.conso-type {
  font-size: 18px;

  font-weight: bold;
}

.conso-time {
  color: $cream;

  font-size: 14px;

  margin-top: 4px;
}

.conso-prix {
  color: $beer-amber;

  font-weight: bold;
}

.delete-btn {
  width: 30px;

  height: 30px;

  border-radius: 50%;

  border: none;

  background:
    rgba(220, 53, 69, 0.15);

  color: #dc3545;

  font-size: 14px;

  font-weight: bold;

  line-height: 1;

  cursor: pointer;

  flex-shrink: 0;
}

.drink-button {
  position: fixed;

  left: 16px;

  right: 16px;

  bottom:
    calc(
      70px +
      env(safe-area-inset-bottom) +
      16px
    );

  height: 54px;

  background: $primary;

  color: $foam;

  font-size: 18px;

  font-weight: bold;

  z-index: 100;
}

.drink-dialog {
  width: 90%;

  max-width: 400px;

  max-height: 80vh;

  background: $barrel;

  color: $foam;

  border-radius: 18px;
}

.dialog-title {
  text-align: center;

  font-size: 22px;

  font-weight: bold;
}

.dialog-loading,
.dialog-empty {
  display: flex;

  justify-content: center;

  align-items: center;

  padding: 24px;

  color: $cream;

  text-align: center;
}

.drink-list {
  display: flex;

  flex-direction: column;

  gap: 10px;

  max-height: 45vh;

  overflow-y: auto;
}

.drink-details {
  display: flex;

  gap: 6px;

  margin-top: 5px;

  color: $accent;

  font-size: 14px;
}

.drink-item {
  display: flex;

  align-items: center;

  justify-content: flex-start;

  background: $barrel-light;

  color: $foam;

  border-radius: 14px;

  padding: 10px 14px;

  text-align: left;
}

.drink-item-icon {
  font-size: 28px;

  margin-right: 12px;
}

.drink-item-name {
  font-size: 16px;

  font-weight: bold;
}

.drink-item-details {
  font-size: 12px;

  color: $cream;

  opacity: 0.8;

  margin-top: 2px;
}

.dialog-footer {
  display: flex;

  justify-content: center;

  padding-top: 0;
}

.none-button {
  color: $cream;

  opacity: 0.75;
}

.price-dialog {
  width: 90%;

  max-width: 360px;

  background: $barrel;

  color: $foam;

  border-radius: 18px;
}

.price-input {
  color: $foam;
}

.price-actions {
  display: flex;

  justify-content: space-between;

  gap: 12px;
}

.price-validate {
  background: $primary;

  color: $foam;

  flex: 1;
}

</style>
