# CLAUDE.md — phanor.info

Fichier de contexte projet pour continuer le travail via Claude Code.

---

## Qui est le client

**Alexandre Phanor** — Montréal / Mont-Tremblant, Québec.
Francophone. En transition de carrière vers le courtage en assurance.
Curieux de livres, de philosophie, d'IA, de finance et de business.

---

## Objectif du site

Un site personnel minimaliste en français, à deux voix :
- **Voix personnelle** — livres, idées, IA, apprentissage (tag : Perso)
- **Voix professionnelle** — finance, assurance, business (tag : Pro)

But principal : écrire pour penser et documenter son parcours. Construire une communauté de lecteurs avec des intérêts similaires. Collecter des abonnés newsletter.

---

## Domaine

`phanor.info`

---

## Stack technique choisie

| Composant | Outil |
|-----------|-------|
| Générateur de site statique | **Eleventy (11ty)** |
| Format de contenu | Markdown + YAML front matter |
| Templates | Nunjucks (défaut Eleventy) |
| CSS | Fait à la main — pas de framework |
| Hébergement | **GitHub Pages** (gratuit) |
| Newsletter | **Beehiiv** (choix définitif) |
| Analytics | À choisir : Umami ou Fathom (privacy-first) |

Pas de CMS. Pas de base de données. Pas de JS frontend framework.

---

## État d'avancement

### ✅ Étape 1 — Maquette visuelle (terminée)
La maquette de la page d'accueil a été validée. Voir `STRUCTURE.md` pour tous les détails visuels et de structure.

### ✅ Étape 2 — Architecture des fichiers Eleventy (terminée)
Structure complète créée. Fichiers clés :

| Fichier | Rôle |
|---------|------|
| `eleventy.config.js` | Config Eleventy (ESM, collection `articles`, filtres `year` et `isoDate`) |
| `package.json` | Dépendances — Eleventy 3.x, `"type": "module"` |
| `src/_data/site.json` | Métadonnées globales (titre, URL, auteur, LinkedIn) |
| `src/_includes/layouts/base.njk` | Layout principal (head, header, footer) |
| `src/_includes/layouts/article.njk` | Layout article avec CTA newsletter en bas |
| `src/_includes/layouts/page.njk` | Layout pages statiques |
| `src/assets/css/style.css` | CSS complet fidèle à la maquette |
| `src/index.njk` | Page d'accueil (bio, newsletter, liste d'articles) |
| `src/about.njk` | Page À propos |
| `src/contact.njk` | Page Contact |
| `src/recherche.njk` | Page Recherche (placeholder) |
| `src/atom.njk` | Flux RSS → génère `/atom.xml` |
| `src/CNAME` | Domaine `phanor.info` pour GitHub Pages |
| `src/journal/journal.json` | Defaults articles Perso (layout + tag) |
| `src/pro/pro.json` | Defaults articles Pro (layout + tag) |
| `.github/workflows/deploy.yml` | CI/CD — build + deploy automatique sur GitHub Pages |

**Articles d'exemple créés :**
- `src/journal/pourquoi-j-ecris.md` (tag Perso)
- `src/pro/debuter-en-assurance.md` (tag Pro)

**Pour ajouter un article :** créer un fichier `.md` dans `src/journal/` ou `src/pro/` avec un front matter minimal :
```yaml
---
title: Titre de l'article
---
Corps du texte en Markdown.
```

**Pour tester localement :**
```
npm install
npm start
```
Site visible sur `http://localhost:8080`.

### ⏳ Étape 3 — Mise en place GitHub Pages (à faire)
- [ ] Créer un repo GitHub public (ex. `phanor-info`)
- [ ] Pousser le code sur la branche `main`
- [ ] Dans les paramètres du repo → *Pages* → Source : **GitHub Actions**
- [ ] Dans les paramètres → *Pages* → *Custom domain* → entrer `phanor.info`
- [ ] Chez le registraire de domaine : ajouter les enregistrements DNS de GitHub

### ⏳ Étape 4 — Newsletter et analytics (à faire)
- Newsletter : **Beehiiv** — remplacer `BEEHIIV_PUBLICATION_ID` dans `src/index.njk` et `src/_includes/layouts/article.njk` par l'ID trouvé dans Beehiiv → Settings → Publication
- Analytics : choisir entre **Umami** (auto-hébergé) ou **Fathom** (SaaS), ajouter le script dans `base.njk`

---

## Décisions de design validées

- Langue : **français uniquement**
- Flux d'articles : **unique**, avec étiquettes Perso / Pro (pas de sections séparées)
- Pas de dates visibles sur les articles
- Pas de bordures entre les sections
- Navigation header : À propos · Contact · Recherche
- Footer : LinkedIn · RSS · copyright
- Polices : Lora (sérif) pour le nom, Inter pour tout le reste
- Palette : tons ivoire et gris-brun chauds (voir `STRUCTURE.md`)
- Pas de noir pur, pas de blanc pur

---

## Structure URL prévue

```
/                  → Accueil
/about             → À propos
/contact           → Contact
/recherche         → Recherche / ressources
/journal/[slug]    → Articles Perso
/pro/[slug]        → Articles Pro
/atom              → Flux RSS
```

---

## Références

- Maquette validée : voir `STRUCTURE.md`
