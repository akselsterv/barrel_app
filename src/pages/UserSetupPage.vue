<template>
  <div class="setup-page flex flex-center">
    <q-card class="setup-card">
      <q-card-section>
        <div class="setup-title">Bienvenue !</div>
        <div class="setup-subtitle">Dis-nous en un peu plus sur toi</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="pseudo"
          label="Ton pseudo"
          filled
          class="q-mb-md"
        />

        <q-select
          v-model="sexe"
          :options="sexeOptions"
          label="Sexe biologique"
          filled
          emit-value
          map-options
          class="q-mb-md"
        />

        <q-input
          v-model.number="poids"
          label="Poids (kg)"
          type="number"
          filled
          class="q-mb-md"
        />

        <div class="jpermis-row">
          <div class="jpermis-label">Jeune permis</div>
          <q-toggle
            v-model="jpermis"
            color="primary"
          />
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          label="C'est parti"
          color="primary"
          unelevated
          rounded
          :disable="!pseudo || !sexe || !poids"
          :loading="loading"
          @click="creerUtilisateur"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'

const router = useRouter()

const pseudo = ref('')
const sexe = ref(null)
const poids = ref(null)
const jpermis = ref(false)
const loading = ref(false)

const sexeOptions = [
  { label: 'Homme', value: 'homme' },
  { label: 'Femme', value: 'femme' },
]

async function creerUtilisateur() {
  loading.value = true

  // 1. Envoi vers Supabase
  const { data, error } = await supabase
    .from('utilisateurs')
    .insert({
      pseudo: pseudo.value,
      jpermis: jpermis.value,
      sexe: sexe.value,
      poid: poids.value,
      pt: 0,
      ligue: 1
    })
    .select()
    .single()

  loading.value = false

  if (error) {
    console.error('Erreur création utilisateur:', error)
    return
  }

  // 2. Sauvegarde en local pour usage rapide sans refaire de requête
  localStorage.setItem('utilisateur', JSON.stringify(data))

  // 3. Redirection vers la page principale
  router.push('/')
}
</script>

<style scoped lang="scss">
.setup-page {
  min-height: 100vh;
  padding: 24px;
  background-image: url('src/assets/barrel_side.png');
  background-repeat: repeat;
}

.setup-card {
  width: 100%;
  max-width: 400px;
  padding: 16px;
  border-radius: 18px;
  background: $barrel;
  color: $foam;
}

.setup-title {
  font-size: 24px;
  font-weight: bold;
  color: $beer-gold;
}

.setup-subtitle {
  color: $cream;
  margin-top: 4px;
}

.jpermis-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.jpermis-label {
  font-size: 15px;
  color: $foam;
}

:deep(.q-field__label) {
  color: $cream;
}

:deep(.q-field--filled .q-field__control) {
  background: $barrel-light;
}

:deep(.q-field__native),
:deep(.q-field__input) {
  color: $foam;
}
</style>
