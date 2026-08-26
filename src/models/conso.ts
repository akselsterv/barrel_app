import type { Utilisateurs } from "./utilisateurs"

export interface conso {
    nom: string,
    volume: Int16Array,
    degre: Float16Array,
    prix: Float16Array,
    type: string,
    createur: Utilisateurs
}
