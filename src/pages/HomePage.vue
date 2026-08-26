<template>
  <q-page class="page">

    <!-- HEADER -->
    <div class="header">
      <div class="beer-fill" :style="{ transform: `translateY(${100 - remplissage}%)` }"></div>
      <div class="header-content">
        <div class="taux">
          {{ taux.toFixed(3) }} g/L
        </div>

        <div class="subtitle">
          Tu peux conduire dans {{ tempsAvantDeConduire }} minutes
        </div>
      </div>
    </div>

    <!-- CONSOMMATIONS -->
    <div class="content">

      <div class="section-title">
        Mes consommations
      </div>

      <div
        v-if="consommations.length === 0"
        class="empty"
      >
        Aucune consommation :(
      </div>

      <q-card
        v-for="(conso, index) in consommations"
        :key="index"
        class="conso-card"
      >
        <q-card-section class="conso-content">

          <div class="conso-icon">
            {{ conso.type === 'biere' ? '🍺' : '🍹' }}
          </div>

          <div class="conso-info">
            <div class="conso-type">
              {{ conso.type === 'biere' ? 'Bière' : 'Cocktail' }}
            </div>

            <div class="conso-time">
              {{ conso.heure }}
            </div>
          </div>

        </q-card-section>
      </q-card>

      <!-- BOUTON -->
      <q-btn
        class="drink-button"
        unelevated
        rounded
        label="Je bois"
        @click="dialog = true"
      />

    </div>

    <!-- DIALOG AJOUT -->
    <q-dialog v-model="dialog">
      <q-card class="drink-dialog">

        <q-card-section>
          <div class="dialog-title">
            Qu'est-ce que tu bois ?
          </div>
        </q-card-section>

        <q-card-section class="drink-options">

          <q-btn
            class="drink-option"
            unelevated
            @click="ajouterConsommation('biere')"
          >
            <div>
              <div class="option-icon">🍺</div>
              <div>Bière</div>
            </div>
          </q-btn>

          <q-btn
            class="drink-option"
            unelevated
            @click="ajouterConsommation('cocktail')"
          >
            <div>
              <div class="option-icon">🍹</div>
              <div>Cocktail</div>
            </div>
          </q-btn>

        </q-card-section>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed} from 'vue'

const taux = ref(0.163)

const tauxMax = ref(0.3)

const tempsAvantDeConduire = ref(120)

const dialog = ref(false)

const consommations = ref([])

// Pourcentage de remplissage de 0 à 100, basé sur le taux
const remplissage = computed(() => {
  const pourcentage = (taux.value / tauxMax.value) * 100
  return Math.min(Math.max(pourcentage, 0), 100)
})

function ajouterConsommation(type) {
  const maintenant = new Date()

  const heure = maintenant.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  consommations.value.push({
    type,
    heure
  })

  taux.value += 0.02

  dialog.value = false
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100dvh;
  padding: 24px 16px 120px;
  padding-top: calc(24px + env(safe-area-inset-top));
  padding-right: calc(16px + env(safe-area-inset-right));
  padding-bottom: calc(120px + env(safe-area-inset-bottom));
  padding-left: calc(16px + env(safe-area-inset-left));
}

.header {
  position: relative;
  height: 320px;
  overflow: hidden;
  background-image: url('../assets/glass.png');
  background-size: 100% 100%;
  background-position: center bottom;
  z-index: 10;
}

.beer-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url('../assets/biere.png');
  background-size: 80% 100%; // toute l'image mise à l'échelle sur la hauteur du header, jamais rognée
  background-position: center bottom;
  background-repeat: repeat;
  transition: transform 1s ease;
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

.drink-button {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: calc(70px + env(safe-area-inset-bottom) + 16px);

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
  background: $barrel;
  color: $foam;
  border-radius: 18px;
}

.dialog-title {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
}

.drink-options {
  display: flex;
  gap: 12px;
}

.drink-option {
  flex: 1;
  height: 110px;
  background: $barrel-light;
  color: $foam;
  border-radius: 14px;
  font-size: 17px;
}

.option-icon {
  font-size: 35px;
  margin-bottom: 5px;
}
</style>
