// ========================================
// LIGUES
// ========================================

export const ligues = [
  {
    id: 1,
    nom: 'Diamant',
    points: 10000,
    description: 'La légende du comptoir 👑',
    icon: '💎'
  },
  {
    id: 2,
    nom: 'Platine',
    points: 7500,
    description: 'Presque au sommet',
    icon: '🏆'
  },
  {
    id: 3,
    nom: 'Or',
    points: 5000,
    description: 'Un vrai connaisseur',
    icon: '🥇'
  },
  {
    id: 4,
    nom: 'Argent',
    points: 2500,
    description: 'Ça commence à monter',
    icon: '🥈'
  },
  {
    id: 5,
    nom: 'Bronze',
    points: 0,
    description: 'Les premiers verres 🍺',
    icon: '🥉'
  }
]

// ========================================
// RÉCUPÉRER UNE LIGUE PAR SON ID
// ========================================

export function getLigueById(id) {
  return ligues.find(
    ligue => Number(ligue.id) === Number(id)
  )
}

// ========================================
// CALCULER LA LIGUE SELON LES POINTS
// ========================================

export function calculerLigue(points) {
  const pts = Number(points) || 0

  // Le tableau est volontairement parcouru
  // du plus haut palier au plus bas.
  const ligue = ligues.find(
    ligue => pts >= Number(ligue.points)
  )

  return ligue?.id ?? 5
}
