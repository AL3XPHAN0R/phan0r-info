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
| Newsletter | **MailerLite** (remplace Beehiiv) |
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
| `src/perso/perso.json` | Defaults articles Perso (layout + tag) |
| `src/pro/pro.json` | Defaults articles Pro (layout + tag) |
| `.github/workflows/deploy.yml` | CI/CD — build + deploy automatique sur GitHub Pages |

**Articles d'exemple créés :**
- `src/perso/pourquoi-j-ecris.md` (tag Perso)
- `src/pro/debuter-en-assurance.md` (tag Pro)

**Pour ajouter un article :** créer un fichier `.md` dans `src/perso/` ou `src/pro/` avec un front matter minimal :
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

### ✅ Étape 3 — Mise en place GitHub Pages (terminée — 2026-05-18)
- [x] Repo GitHub public créé : `AL3XPHAN0R/phan0r-info`
- [x] Code poussé sur la branche `main`
- [x] GitHub Pages source : **GitHub Actions** — build au vert
- [x] Namecheap — 4 enregistrements A + CNAME ajoutés, URL Redirect Record supprimé (conflit)
- [x] DNS propagé — `phanor.info` pointe vers les IPs GitHub Pages (185.199.x.x)
- [x] Custom domain `phanor.info` configuré dans GitHub Pages Settings
- [x] Certificat HTTPS émis — Enforce HTTPS activé
- [x] Site en ligne sur `https://phanor.info`

**Note :** si le DNS check reste bloqué sur "in progress" dans GitHub Settings → retirer le domaine et le re-saisir pour forcer une nouvelle vérification.

### ✅ Étape 4a — Intégration MailerLite (terminée — 2026-05-18)
- [x] Script `universal.js` chargé dans `base.njk` (account `2359319`)
- [x] Formulaire embedded `OMwffF` intégré dans `src/index.njk` (section newsletter) et `src/_includes/layouts/article.njk` (CTA en bas d'article)
- [x] CSS MailerLite overridé dans `style.css` pour coller à l'esthétique du site
- [x] reCAPTCHA retiré (désactivé côté MailerLite, inutile)
- [x] Courriel personnalisé `alexandre@phanor.info` configuré et validé (2026-05-19) :
  - Namecheap Email Forwarding actif → `alexandrephanor@gmail.com`
  - Domaine `phanor.info` authentifié dans MailerLite (DKIM + SPF + vérification)
  - DNS Namecheap : CNAME DKIM, TXT vérification, TXT SPF fusionné dans MAIL SETTINGS
  - MX records : `eforward1-5.registrar-servers.com` — propagation confirmée
  - Forwarding testé et fonctionnel (test Outlook → Gmail ✅)
  - "From email" MailerLite → `alexandre@phanor.info` ✅
  - **Note :** envoyer depuis Gmail vers soi-même via le forward est bloqué par Gmail (boucle) — comportement normal

### ⏳ Étape 4b — RSS-to-email MailerLite (en attente)
- Nécessite un **forfait MailerLite payant**
- À configurer quand quelques articles seront publiés
- Chemin : Automations → Create automation → RSS campaign → URL : `https://phanor.info/atom.xml`

### ⏳ Étape 4c — Analytics (mis sur la glace)
- À intégrer quand le site aura du trafic
- Options envisagées : **Umami** (auto-hébergé) ou **Fathom** (SaaS, privacy-first)
- Intégration : ajouter le script dans `base.njk`

---

## Décisions de design validées

- Langue : **français uniquement**
- Flux d'articles : **unique**, avec étiquettes Perso / Pro (pas de sections séparées)
- Pas de dates visibles sur les articles
- Pas de bordures entre les sections
- Navigation header : **supprimée pour l'instant** — seul le nom reste (aligné à gauche)
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
/perso/[slug]    → Articles Perso
/pro/[slug]        → Articles Pro
/atom              → Flux RSS
```

---

## Références

- Maquette validée : voir `STRUCTURE.md`
