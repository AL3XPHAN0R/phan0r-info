# STRUCTURE.md — phanor.info

Document de référence pour le style visuel et la structure du site.

---

## URL Structure

```
/                  → Accueil : bio courte + flux unique d'articles + inscription newsletter
/about             → À propos (bio courte)
/contact           → Contact
/recherche         → Page Recherche (ressources, projets, liens curatés)
/journal/[slug]    → Articles personnels (Perso)
/pro/[slug]        → Articles professionnels (Pro)
/atom              → Flux RSS
```

---

## Pages

### Accueil `/`
- Nom du site en haut à gauche (logo textuel)
- Navigation en haut à droite
- Bio courte (1 paragraphe)
- Formulaire d'inscription à la newsletter (inline : champ email + bouton)
- Flux unique de tous les articles avec étiquettes Perso / Pro
- Pas de dates visibles
- Pas de pagination — tous les articles listés sur une seule page

### À propos `/about`
- Un court paragraphe de bio
- Pas de section portfolio

### Contact `/contact`
- À définir (formulaire ou coordonnées)

### Recherche `/recherche`
- Page de ressources curatées, liens, projets
- Structure à définir lors d'une prochaine étape

### Articles `/journal/[slug]` et `/pro/[slug]`
- Titre en `<h1>`
- Corps du texte (Markdown)
- CTA newsletter en bas de chaque article

---

## Navigation

### Header
- Nom : **Alexandre Phanor** (sérif, lié à `/`)
- Liens nav (dans l'ordre) : À propos · Contact · Recherche

### Footer
- Liens : LinkedIn · RSS
- Copyright : © [année] Alexandre Phanor
- Aucune bordure de séparation

---

## Style visuel

### Principes généraux
- Minimaliste et chaleureux
- Typographie comme élément principal
- Pas de noir pur, pas de blanc pur
- Aucune bordure entre les sections (header, footer, liste d'articles)
- Beaucoup d'espace — la respiration fait le travail

### Couleurs
| Rôle | Valeur |
|------|--------|
| Fond de page | `#faf8f4` (ivoire chaud) |
| Texte principal | `#3a3732` (gris-brun foncé) |
| Texte secondaire / bio | `#5a554e` |
| Texte muted (nav, footer) | `#7a756d` |
| Texte très muted | `#a09a91` |
| Texte pâle (copyright) | `#c8c3b8` |
| Étiquettes tag bg | `#e8e4dc` |
| Étiquettes tag texte | `#6e6860` |
| Hover sur liens articles | `#8a6f4e` (brun chaud) |
| Bouton newsletter bg | `#3a3732` |
| Bouton newsletter texte | `#f5f2ec` |

### Typographie
| Rôle | Police | Taille | Poids |
|------|--------|--------|-------|
| Nom du site (header) | Lora (sérif) | 18px | 500 |
| Bio | Inter | 15px | 400 |
| Titres d'articles | Inter | 14px | 400 |
| Nav links | Inter | 13px | 400 |
| Newsletter input/bouton | Inter | 13px | 400 |
| Étiquettes (tags) | Inter | 10px | 400 |
| Label section | Inter | 11px | 500 |
| Footer links | Inter | 12px | 400 |

- Interligne corps : `1.75`
- Letter-spacing label section : `0.08em` + uppercase
- Letter-spacing étiquettes : `0.04em`

### Étiquettes (tags)
- Deux valeurs : **Perso** et **Pro**
- Même style visuel pour les deux (pas de couleur distincte)
- Positionnées à gauche du titre de l'article
- `border-radius: 4px`, padding `2px 7px`

### Largeur de contenu
- `max-width: 640px`, centré, padding `2.5rem 1.5rem`

---

## Ce qu'il n'y a PAS sur ce site
- Pas de CMS
- Pas de base de données
- Pas de routing dynamique
- Pas de framework CSS (Tailwind, Bootstrap, etc.)
- Pas de frontend JS framework
- Pas de tags ou catégories complexes
- Pas de dates visibles sur les articles
- Pas de pagination
- Pas de portfolio / section projets
- Pas de page en anglais (site en français uniquement)
