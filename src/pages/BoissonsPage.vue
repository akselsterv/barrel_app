<template>
  <q-page class="boissons-page">

    <!-- HEADER -->
    <div class="page-header">
      <div class="title">
        Boissons
      </div>

      <div class="subtitle">
        Découvre les boissons de la communauté 🍺
      </div>
    </div>

    <!-- CHARGEMENT -->
    <div v-if="loading" class="loading">
      Chargement des boissons...
    </div>

    <!-- LISTE VIDE -->
    <div v-else-if="boissons.length === 0" class="empty-state">
      Aucune boisson pour le moment 🍺
    </div>

    <!-- LISTE DES BOISSONS -->
    <div v-else class="boissons-list">
      <q-card
        v-for="boisson in boissons"
        :key="boisson.id"
        class="boisson-card"
        flat
      >
        <q-card-section class="boisson-content">

          <!-- ICONE -->
          <div class="boisson-icon">
            {{ getIcon(boisson.type) }}
          </div>

          <!-- INFORMATIONS -->
          <div class="boisson-info">
            <div class="boisson-name">
              {{ boisson.nom }}
            </div>

            <div class="boisson-details">
              <span>{{ boisson.degre }}°</span>
              <span>•</span>
              <span>{{ boisson.volume }} cl</span>
              <span>•</span>
              <span>{{ Number(boisson.prix).toFixed(2) }} €</span>
            </div>

            <div class="boisson-creator">
              ajoutée par {{ boisson.createur }}
            </div>
          </div>

        </q-card-section>
      </q-card>
    </div>

    <!-- BOUTON AJOUTER -->
    <q-btn
      class="add-button"
      unelevated
      rounded
      icon="add"
      label="Ajouter une boisson"
      @click="ouvrirDialog"
    />

    <!-- POPUP AJOUT -->
    <q-dialog v-model="dialog">
      <q-card class="add-dialog">

        <q-card-section>
          <div class="dialog-title">
            Ajouter une boisson 🍺
          </div>
        </q-card-section>

        <q-card-section>

          <!-- NOM -->
          <q-input
            v-model="nouvelleBoisson.nom"
            label="Nom"
            dark
            outlined
            class="form-input"
          />

          <!-- TYPE -->
          <q-select
            v-model="nouvelleBoisson.type"
            :options="types"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="Type"
            dark
            outlined
            class="form-input"
          />

          <!-- VOLUME AUTOMATIQUE -->
          <q-input
            :model-value="volumeDuType"
            label="Volume"
            suffix="cl"
            readonly
            dark
            outlined
            class="form-input"
          />

          <!-- DEGRE -->
          <q-input
            v-model.number="nouvelleBoisson.degre"
            type="number"
            label="Degré d'alcool"
            suffix="°"
            dark
            outlined
            class="form-input"
          />

          <!-- PRIX -->
          <q-input
            v-model.number="nouvelleBoisson.prix"
            type="number"
            step="0.01"
            label="Prix"
            suffix="€"
            dark
            outlined
            class="form-input"
          />

        </q-card-section>

        <!-- BOUTONS -->
        <q-card-actions align="right">

          <q-btn
            flat
            label="Annuler"
            v-close-popup
          />

          <q-btn
            unelevated
            label="Ajouter"
            color="primary"
            :loading="adding"
            @click="ajouterBoisson"
          />

        </q-card-actions>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/services/supabase'

const dialog = ref(false)
const loading = ref(false)
const adding = ref(false)

const boissons = ref([])

const types = [
  {
    label: '🍺 Pinte',
    value: 'pinte'
  },
  {
    label: '🍺 Demi',
    value: 'demi'
  },
  {
    label: '🍹 Cocktail',
    value: 'cocktail'
  },
  {
    label: '🥛 Shot',
    value: 'shot'
  }
]

const volumes = {
  pinte: 50,
  demi: 25,
  cocktail: 30,
  shot: 4
}

const nouvelleBoisson = ref({
  nom: '',
  type: 'pinte',
  degre: null,
  prix: null
})

const volumeDuType = computed(() => {
  return volumes[nouvelleBoisson.value.type] ?? 33
})


const utilisateur = computed(() => {
  const utilisateurLocal = localStorage.getItem('utilisateur')

  if (!utilisateurLocal) {
    return null
  }

  try {
    return JSON.parse(utilisateurLocal)
  } catch (error) {
    console.error(
      'Erreur lors de la lecture de utilisateur :',
      error
    )

    return null
  }
})

async function chargerBoissons() {
  loading.value = true

  const { data, error } = await supabase
    .from('conso')
    .select(`
      id,
      nom,
      volume,
      degre,
      prix,
      type,
      createur_id,
      created_at,
      createur:utilisateurs (
        pseudo
      )
    `)
    .order('created_at', {
      ascending: false
    })

  loading.value = false

  if (error) {
    console.error(
      'Erreur chargement boissons :',
      error
    )

    return
  }

  boissons.value = data.map(boisson => {
    return {
      ...boisson,

      createur:
        boisson.createur?.pseudo ||
        'Utilisateur inconnu'
    }
  })
}

function getIcon(type) {
  const icons = {
    pinte: '🍺',
    demi: '🍺',
    cocktail: '🍹',
    shot: '🥛'
  }

  return icons[type] || '🍺'
}

/*
|--------------------------------------------------------------------------
| OUVRIR LE DIALOG
|--------------------------------------------------------------------------
*/

function ouvrirDialog() {
  if (!utilisateur.value) {
    console.error(
      'Aucun utilisateur trouvé dans le localStorage'
    )

    alert(
      'Aucun utilisateur connecté. Veuillez recommencer la configuration.'
    )

    return
  }

  dialog.value = true
}

/*
|--------------------------------------------------------------------------
| AJOUTER UNE BOISSON
|--------------------------------------------------------------------------
*/

async function ajouterBoisson() {

  /*
  |--------------------------------------------------------------------------
  | VERIFICATION
  |--------------------------------------------------------------------------
  */

  if (
    !nouvelleBoisson.value.nom ||
    nouvelleBoisson.value.degre === null ||
    nouvelleBoisson.value.prix === null
  ) {
    alert(
      'Veuillez remplir tous les champs.'
    )

    return
  }

  /*
  |--------------------------------------------------------------------------
  | UTILISATEUR
  |--------------------------------------------------------------------------
  */

  if (!utilisateur.value?.id) {
    alert(
      'Impossible de trouver votre utilisateur.'
    )

    return
  }

  adding.value = true

  /*
  |--------------------------------------------------------------------------
  | INSERTION SUPABASE
  |--------------------------------------------------------------------------
  */

  const { data, error } = await supabase
    .from('conso')
    .insert({
      nom: nouvelleBoisson.value.nom,
      volume: volumeDuType.value,
      degre: Number(
        nouvelleBoisson.value.degre
      ),
      prix: Number(
        nouvelleBoisson.value.prix
      ),
      type: nouvelleBoisson.value.type,

      // UUID de l'utilisateur
      createur_id: utilisateur.value.id
    })
    .select(`
      id,
      nom,
      volume,
      degre,
      prix,
      type,
      createur_id,
      created_at,
      createur:utilisateurs (
        pseudo
      )
    `)
    .single()

  adding.value = false

  if (error) {
    console.error(
      'Erreur ajout boisson :',
      error
    )

    alert(
      'Erreur lors de l’ajout de la boisson.'
    )

    return
  }

  /*
  |--------------------------------------------------------------------------
  | AJOUT IMMÉDIAT DANS LA LISTE
  |--------------------------------------------------------------------------
  */

  boissons.value.unshift({
    ...data,

    createur:
      data.createur?.pseudo ||
      utilisateur.value.pseudo
  })

  /*
  |--------------------------------------------------------------------------
  | RESET FORMULAIRE
  |--------------------------------------------------------------------------
  */

  nouvelleBoisson.value = {
    nom: '',
    type: 'pinte',
    degre: null,
    prix: null
  }

  /*
  |--------------------------------------------------------------------------
  | FERMETURE DIALOG
  |--------------------------------------------------------------------------
  */

  dialog.value = false
}

/*
|--------------------------------------------------------------------------
| CHARGEMENT INITIAL
|--------------------------------------------------------------------------
*/

onMounted(() => {
  chargerBoissons()
})
</script>

<style scoped lang="scss">

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

.boissons-page {
  min-height: 100dvh;
  padding: 24px 16px 120px;
  padding-top: calc(24px + env(safe-area-inset-top));
  padding-right: calc(16px + env(safe-area-inset-right));
  padding-bottom: calc(120px + env(safe-area-inset-bottom));
  padding-left: calc(16px + env(safe-area-inset-left));
}

/*
|--------------------------------------------------------------------------
| HEADER
|--------------------------------------------------------------------------
*/

.page-header {
  margin-bottom: 24px;
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

/*
|--------------------------------------------------------------------------
| LOADING
|--------------------------------------------------------------------------
*/

.loading,
.empty-state {
  text-align: center;
  color: $cream;
  opacity: 0.7;
  padding: 40px 20px;
}

/*
|--------------------------------------------------------------------------
| LISTE
|--------------------------------------------------------------------------
*/

.boissons-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/*
|--------------------------------------------------------------------------
| CARTE
|--------------------------------------------------------------------------
*/

.boisson-card {
  background: $barrel;
  border-radius: 14px;
  color: $foam;
}

.boisson-content {
  display: flex;
  align-items: center;
  min-height: 80px;
}

/*
|--------------------------------------------------------------------------
| ICONE
|--------------------------------------------------------------------------
*/

.boisson-icon {
  font-size: 38px;
  width: 55px;
  text-align: center;
  margin-right: 12px;
}

/*
|--------------------------------------------------------------------------
| INFORMATIONS
|--------------------------------------------------------------------------
*/

.boisson-info {
  flex: 1;
}

.boisson-name {
  font-size: 18px;
  font-weight: bold;
}

.boisson-details {
  display: flex;
  gap: 6px;
  margin-top: 5px;
  color: $accent;
  font-size: 14px;
}

.boisson-creator {
  margin-top: 4px;
  color: $cream;
  opacity: 0.65;
  font-size: 11px;
}

/*
|--------------------------------------------------------------------------
| BOUTON
|--------------------------------------------------------------------------
*/

.add-button {
  position: fixed;
  left: 16px;
  right: 16px;

  bottom: calc(
    70px +
    env(safe-area-inset-bottom) +
    16px
  );

  height: 52px;
  z-index: 100;

  background: $primary;
  color: $foam;

  font-size: 16px;
  font-weight: bold;
}

/*
|--------------------------------------------------------------------------
| DIALOG
|--------------------------------------------------------------------------
*/

.add-dialog {
  width: 90%;
  max-width: 420px;
  background: $barrel;
  color: $foam;
  border-radius: 18px;
}

.dialog-title {
  font-size: 22px;
  font-weight: bold;
}

.form-input {
  margin-bottom: 14px;
}

</style>
