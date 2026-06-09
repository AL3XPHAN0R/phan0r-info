---
title: Post mortem — Meal Planner agent
date: 2026-06-04
---

Ce post mortem retrace le développement d'un assistant de planification de repas hebdomadaire sur Telegram, construit avec Claude API et déployé sur Railway. C'est autant un bilan technique qu'une réflexion honnête sur ce que signifie vraiment développer avec une IA — les gains, les frictions, et les leçons qui ne s'apprennent qu'en conditions réelles.

## 01 — Mise en contexte

### La genèse : un jeudi soir de découragement

Tout a commencé un jeudi soir. Véronique, après une longue journée, réalise qu'elle s'est trompée dans sa planification de repas de la semaine. Résultat : on commande au restaurant. Ce n'est pas la commande qui dérange — c'est ce qu'elle révèle. Elle me confie que la planification des repas est rarement quelque chose de plaisant. Qu'elle manque souvent d'idées. Que la charge mentale associée à ce rituel hebdomadaire s'accumule silencieusement.

Quelques semaines plus tôt, une collègue, Valérie, m'avait partagé exactement le même sentiment.

Deux personnes différentes, deux contextes différents, le même point de friction. Je commence alors à accumuler de l'information sur le problème pour mieux comprendre ses composantes : qu'est-ce qui rend la planification de repas pénible? La mémoire des recettes? La synchronisation des aliments à passer pour éviter le gaspillage? Le calcul des portions? La répétition? L'écart entre ce qu'on a envie de manger et ce qu'on sait cuisiner?

C'est à ce moment que le projet prend forme — non seulement comme un exercice technique, mais comme une réponse à un vrai besoin observé.

### Objectif de départ

Construire un assistant de planification de repas hebdomadaire pour Véronique et moi, accessible directement sur Telegram, capable de :

- Mémoriser nos recettes à partir de captures d'écran
- Proposer un plan de repas adapté à nos contraintes de la semaine
- Générer une liste d'épicerie consolidée
- Produire des fiches de préparation par repas

La définition du succès était simple : que Véronique n'ait plus à porter seule cette charge mentale.

### Pourquoi cette stack

| Choix | Raison |
|---|---|
| Telegram | Interface déjà utilisée au quotidien, aucune friction d'adoption |
| Claude API (sonnet-4-6) | Capacité de vision (lecture de captures d'écran), orchestration en langage naturel |
| Railway + PostgreSQL | Déploiement simple, base de données managée, zéro infrastructure à gérer |
| Python | Écosystème solide pour les bots Telegram, `python-telegram-bot` bien documenté |
| GitHub | Versioning + déclencheur de déploiement automatique via Railway |

En parallèle de la résolution d'un problème concret, ce projet était aussi l'un des premiers terrains d'exploration sérieux du développement agentique, où je tente de résoudre une friction qui n'est pas la mienne. Claude Code était l'outil naturel : développement en local, efficace, rapide à itérer.

---

## 02 — Architecture et design de la solution

### Vue d'ensemble du flux

```
Utilisateur (Telegram)
        ↓
  bot.py — routing
        ↓
  handler/stage_0X.py
        ↓
  claude_client.py — appel API Claude
        ↓
  database.py — PostgreSQL Railway
        ↓
  Réponse → Telegram
```

Le `bot.py` agit comme un routeur pur : il détecte le type de message entrant (image, commande, texte libre) et délègue au handler approprié. Chaque stage est un module indépendant (un sous agent). Claude reçoit uniquement le contexte dont il a besoin pour son stage en cours — jamais plus.

### Les 5 stages du pipeline

| Stage | Déclencheur | Ce que Claude fait |
|---|---|---|
| 00 — Onboarding | Absence de `profil.md` | Pose 11 questions, génère les fichiers de configuration |
| 01 — Ajout de recette | Capture d'écran reçue | Extrait les infos, confirme, enregistre en DB |
| 02 — Planification | `/planifier` | Dialogue sur les contraintes, propose un plan, itère jusqu'au consensus |
| 03 — Liste d'épicerie | `/liste` | Calcule et consolide les ingrédients du plan approuvé |
| 04 — Directives | `/directives` | Génère une fiche de préparation par repas, triée par jour |

### Le rôle de Claude dans l'orchestration

Claude n'est pas un simple générateur de texte dans ce projet — il est le cerveau de chaque interaction. Il lit des images, dialogue en langage naturel, maintient un fil de conversation à l'intérieur d'un stage, et produit des outputs structurés que le code Python valide avant d'enregistrer.

Ce qui a bien fonctionné :
- La lecture de captures d'écran de recettes (Instagram, livres, magazines) — après quelques essais et erreurs, principalement liés à la gestion robuste des hallucinations, la précision d'extraction a fini par devenir remarquable
- Le dialogue de planification : la capacité de Claude à tenir compte des contraintes exprimées en langage naturel et à éviter les répétitions grâce à l'historique
- La génération de la liste d'épicerie consolidée — zéro doublon, proportions bien calculées

Ce qui avait des limites :
- La gestion du contexte entre sessions (mémoire de session vs mémoire persistante) demandait une discipline architecturale rigoureuse
- Claude tendait à halluciner des recettes inexistantes quand la base de données était trop petite — résolu par le preflight warning du Stage 02

### La persistance : un enjeu non trivial

Chaque redémarrage du bot sur Railway repart d'un environnement vierge. Les fichiers de configuration générés lors de l'onboarding auraient été perdus à chaque redéploiement sans une stratégie de persistance explicite.

La solution : une table `config_items` en PostgreSQL qui stocke le contenu des fichiers de configuration clés. Au démarrage (`_post_init`), le bot restaure ces fichiers depuis la base de données avant d'accepter le moindre message. C'est invisible pour l'utilisateur, mais c'est ce qui rend le système fiable sur la durée.

### Ce que je referais pareil

- La séparation stricte en stages indépendants — ça simplifie le débogage et les modifications ciblées
- La validation côté code (`_validate_recette()`) en complément de la validation par Claude
- Le choix de Telegram comme interface — zéro friction d'adoption côté utilisateur, donc permet de vraiment tester les fonctionnalité sans enjeux de UI

### Ce que je changerais

- Anticiper dès le départ la stratégie de persistance des fichiers, plutôt que de la construire en réaction à un problème
- Établir des fondations plus robustes liés au comportement attendu de Claude lors de troubleshooting

---

## 03 — Travailler avec Claude Code — le vrai bilan

### Ce que Claude Code a excellemment géré

Claude Code a été remarquablement efficace pour :

- Générer le boilerplate initial : structure de dossiers, setup Railway, configuration de la base de données
- Écrire les handlers de stages à partir des contrats définis dans les fichiers `CONTEXT.md`
- Refactoriser du code existant quand je lui donnais un objectif précis et un contexte focalisé
- Déboguer des erreurs de logique dans les handlers — particulièrement utile pour les cas limites du Stage 02 (reconnaissance des formulations "zéro invité", exclusion du déjeuner par défaut)
- Rédiger la documentation : `README.md`, `CLAUDE.md`, contrats de stages

### Le moment de friction majeur — et la leçon la plus coûteuse

Le problème le plus couteux en terme de temps, d'energie, et de tokens, était une incompréhension architecturale persistante : **Claude Code croyait que je pouvais tester le bot en local et valider les résultats sur Telegram.**

Or, l'architecture réelle est différente : le bot tourne exclusivement sur Railway et ne répond qu'aux changements publiés sur GitHub. Tester localement sans pousser sur GitHub ne valide rien côté Telegram.

Résultat : une trentaine d'allers-retours de tests et de débogage infructueux, chaque tentative échouant pour la même raison non diagnostiquée. Quand j'ai finalement exprimé mon observation, Claude Code a résisté — il était convaincu que c'était moi qui me trompais. J'ai dû argumenter, lui demander de *prouver* ce qu'il affirmait, pour qu'il reconnaisse finalement l'erreur.

Cette session a épuisé ma limite de tokens et m'a forcé à recharger mon compte.

**Le correctif que j'ai créé :** un fichier `feedback_no_assumptions.md` qui établit une règle explicite — Claude Code ne peut plus affirmer quelque chose sans l'appuyer sur des preuves tangibles. Il doit vérifier avant de conclure.

### Mon rôle réel dans la collaboration

Ce projet m'a forcé à clarifier ce que signifie vraiment "développer avec une IA" :

- **Architecte** : définir la structure, les stages, les contrats de chaque module — Claude Code exécute, mais c'est moi qui conçois
- **Testeur** : valider chaque comportement manuellement sur Telegram, identifier les cas limites que Claude Code ne peut pas anticiper seul
- **Décideur** : trancher quand Claude Code propose deux approches, évaluer les compromis, garder le cap sur l'objectif utilisateur
- **Recadreur** : intervenir quand le contexte dérive, reformuler les prompts, corriger les trajectoires

L'IA accélère l'exécution. Elle ne remplace pas le jugement.

### Ce que je vais assurément préparer avant de commencer un projet futur basé sur cette expérience de développement

- Un `CLAUDE.md` décrivant explicitement l'architecture de déploiement (Railway = production, GitHub push = déploiement)
- Un protocole de test clair par stage, documenté avant d'écrire la première ligne de code
- Une distinction nette entre "tester en local" et "valider en production" — dès le jour 1

---

## 04 — Chronologie et pivots clés

### Les grandes phases

**Phase 1 — Exploration et définition du problème**

Observation du problème chez Véronique et Valérie. Accumulation d'information sur les composantes de la friction. Décision de construire une solution.

**Phase 2 — Architecture et setup**

Choix du stack, création du repo GitHub, configuration de Railway et PostgreSQL, mise en place de la structure ICM (CLAUDE.md, CONTEXT.md, stages/).

**Phase 3 — Développement des stages**

Construction itérative des 5 handlers, onboarding en premier (Stage 00), puis extraction de recettes (Stage 01), puis le plus complexe : la planification (Stage 02).

**Phase 4 — La crise du déploiement**

La longue période de débogage autour du malentendu Railway/GitHub. Trentaine d'allers-retours. Épuisement du quota de tokens. Résolution et création de `feedback_no_assumptions.md`.

**Phase 5 — Stabilisation et seed de données**

Ajout de 10 recettes en base via `scripts/seed_recettes.py`. Tests validés pour les Stages 00, 01 et 02. Affinage des Stages 03 et 04 (en cours au moment de la rédaction).

### Moments de doute

La phase 4 a été le vrai test de persévérance. Quand Claude Code résiste, que les tests échouent en boucle et que le quota de tokens explose, la question "est-ce que ça vaut vraiment la peine ?" se pose. Ce qui m'a fait continuer : la conviction que le problème était réel, et la certitude que le bug était quelque part, pas que l'approche était mauvaise.

### Décisions qui ont tout changé

- **Retirer la fonctionnalité d'ajout par URL** dans le Stage 01 — simplification radicale qui a rendu le stage plus fiable
- **Créer `feedback_no_assumptions.md`** — un correctif de comportement qui aurait dû exister dès le début
- **Le preflight warning** dans le Stage 02 — avertir l'utilisateur si la base de recettes est trop petite plutôt que de laisser Claude halluciner des suggestions

---

## 05 — Problèmes rencontrés et résolutions

### Top 3 des problèmes les plus coûteux

**1. Le malentendu Railway/GitHub — le plus coûteux**

Claude Code assumait que les tests locaux se reflétaient sur Telegram. Faux. Le bot ne répond qu'à ce qui est déployé sur Railway, et Railway ne déploie que ce qui est pushé sur GitHub. Plusieurs centaines de milliers de tokens brûlés avant résolution. Fix : documentation explicite de l'architecture de déploiement + règle `feedback_no_assumptions.md`.

**2. La dérive du contexte en Stage 02**

La planification hebdomadaire est le stage le plus conversationnel — Claude devait tenir compte des contraintes exprimées, de l'historique des 3 dernières semaines, des recettes disponibles, et des préférences du profil. Sans discipline de contexte, les réponses dérivaient. Fix : structure de prompt en couches (ICM), chargement sélectif des fichiers Layer 3.

**3. L'encoding Windows (cp1252)**

Le terminal Windows affichait les accents en caractères garbled dans les `print()`. Pas un bug de données — les données en base et en JSON étaient correctement en UTF-8 — mais un bug d'affichage qui rendait le débogage confus. Fix : identifier et ignorer ce problème d'affichage spécifique au terminal Windows, valider les données directement en base.

### Friction liée à l'infrastructure

- **409 Conflict Telegram** : deux instances du bot actives en même temps causaient des comportements imprévisibles. Fix : `drop_pending_updates=True` dans `run_polling()` et discipline de lancement (une seule instance à la fois).
- **Perte des fichiers de config au redémarrage Railway** : résolu par la stratégie de persistance via `config_items` en PostgreSQL.

### Ce que j'aurais évité avec plus d'expérience

- Supposer que "tester en local" est équivalent à "tester en production" sur une architecture Railway
- Commencer à coder avant d'avoir documenté le flux de déploiement complet
- Ne pas créer `feedback_no_assumptions.md` dès le premier jour de collaboration avec Claude Code

---

## 06 — Ce que j'ai appris — vraiment

### Compétences techniques gagnées

- Architecture d'un bot Telegram en Python avec `python-telegram-bot`
- Gestion de la persistance sur Railway : PostgreSQL comme source de vérité, sync locale au démarrage
- Déploiement continu via GitHub → Railway : comprendre que chaque push sur `main` est un déploiement en production
- Structuration d'un projet agentique avec la méthodologie ICM : layers de contexte, stages indépendants, outputs éditables
- Gestion asynchrone en Python (`AsyncAnthropic`, `async/await` dans les handlers)

### Apprentissages sur la collaboration humain–IA en développement

**Claude Code n'est pas un exécutant passif.** Il a des opinions, des modèles mentaux, et parfois des certitudes erronées qu'il défend. Savoir quand le laisser faire et quand le challenger — et *comment* le challenger efficacement — est une compétence à part entière.

**Le contexte est tout.** Un Claude Code mal informé sur l'architecture produit un travail techniquement correct mais architecturalement faux. L'effort investi dans la documentation initiale (`CLAUDE.md`, contrats de stages, `feedback_no_assumptions.md`) se récupère en évitant exactement le genre de débogage circulaire qui a coûté une trentaine d'allers-retours.

**Les tokens ont une valeur réelle.** Un malentendu non résolu à temps peut coûter des centaines de milliers de tokens et dépasser un quota. Clarifier l'architecture en amont est littéralement moins cher que de corriger en aval.

**La méthodologie ICM tient ses promesses.** C'était ma première application de cette approche à un projet destiné à quelqu'un d'autre. La structure en stages indépendants a rendu le débogage chirurgical : quand le Stage 02 avait un problème, je n'avais pas à toucher aux Stages 01 ou 03. Chaque stage fait une seule chose — et cette contrainte est une force.

### Ce que ce projet m'a révélé sur ma façon de travailler

Je suis plus à l'aise dans la phase d'architecture que dans la phase de débogage circulaire. Quand un problème est clair et localisé, je le règle vite. Quand il est flou et répétitif, je perds de l'énergie. La leçon : investir davantage dans la clarté architecturale initiale pour réduire la surface de débogage imprévue.

---

## 07 — Résultats et état actuel

### Est-ce que l'objectif de départ a été atteint ? Honnêtement.

Pas encore — mais pas parce que le bot ne fonctionne pas. Il fonctionne. Les Stages 00, 01 et 02 sont testés et validés. Les Stages 03 et 04 ont été améliorés mais attendent leurs tests finaux.

Ce qui manque : la présentation à Véronique. Elle est au courant du développement, mais n'a pas eu encore l'opportunité d'avoir des premières interactions. L'objectif de départ était qu'elle n'ait plus à porter la charge mentale de la planification — cet objectif ne sera atteint qu'une fois qu'elle l'aura utilisé, qu'elle aura donné ses commentaires, et qu'on aura itéré en conséquence.

C'est délibéré : une version 1.0 présentée trop tôt, avant qu'elle soit stable, aurait créé plus de friction et de frustrations qu'elle n'en aurait éliminée. Je préfère exécuter plusieurs contrôle qualité afin de m'assurer une adoption de sa part. C'est probablement le point le plus important de tout le projet.

### Ce que l'application fait bien aujourd'hui

- L'onboarding complet en 11 questions, générant un profil personnalisé
- L'extraction de recettes depuis des captures d'écran — la fonctionnalité la plus impressionnante à démontrer
- La planification hebdomadaire en dialogue naturel, avec historique et contraintes
- La persistance totale : aucune perte de données au redéploiement

### Ce qui reste en chantier

- Présentation à Véronique et collecte des premiers retours utilisateur
- Probablement plusieurs modifications une fois confrontée à un vrai usage

---

## 08 — Suite et prochaines itérations

### Améliorations prioritaires (v1.1 — post-feedback Véronique)

- Intégration de la circulaire d'épicerie (Phase 2) : lecture automatique via une boîte Gmail dédiée chaque jeudi
- Potentiellement : interface de consultation du catalogue de recettes sans passer par la planification

### Ce que j'abandonnerais complètement si je repartais de zéro

La tentation d'ajouter des fonctionnalités avant d'avoir validé les fondations. La fonctionnalité d'ajout par URL dans le Stage 01 a été supprimée — elle aurait dû ne jamais exister dans la v1.0. Le MVP doit résoudre un seul problème à la fois, bien.

### Applications à d'autres contextes

La structure de ce projet — un bot Telegram orchestré par Claude, avec pipeline en stages indépendants et persistance PostgreSQL — est entièrement réutilisable. Des variantes pertinentes pour la suite :

- Automatisation quasi complète d'une mise à jour de dossier client pour des fins de conformité
- Outils de personalisation de communication client, rattaché à un CRM
- Tuteur personalisé et paramétré sur des ouvrages précis, dans n'importe quel projet d'apprentissage (créé avec succès pour un projet personel)

La méthodologie ICM est suffisamment générique pour s'adapter à n'importe quel de ces contextes.

---

## 09 — Checklist réutilisable — prochain projet IA

### Avant de coder

- Documenter l'architecture de déploiement complète dans `CLAUDE.md` — local vs staging vs production
- Définir le rôle exact de Claude dans le système (orchestrateur, extracteur, générateur, validateur ?)
- Créer `feedback_no_assumptions.md` ou équivalent dès le jour 1 — forcer la vérification avant l'affirmation
- Identifier les données persistantes et concevoir leur stratégie de stockage avant d'écrire les handlers
- Délimiter le MVP strictement — lister explicitement ce qui n'est *pas* dans la v1.0

### Pendant le développement

- Un stage = un job = un fichier de contrat (`CONTEXT.md`) — ne jamais mélanger les responsabilités
- Valider chaque stage en isolation avant de passer au suivant
- Documenter les comportements imprévus au fur et à mesure — ne pas les laisser dans la mémoire de session
- Surveiller la consommation de tokens sur les sessions longues — un malentendu non résolu coûte cher
- Challenger Claude Code quand quelque chose ne fonctionne pas après 3 tentatives — exiger des preuves, pas des affirmations

### Après le projet

- Rédiger le post mortem pendant que le contexte est frais
- Extraire la checklist réutilisable (ce fichier)
- Documenter les prompts qui ont le mieux fonctionné par type de tâche
- Tester avec un utilisateur réel avant de considérer la v1.0 comme complète
- Planifier la v1.1 seulement après avoir reçu les premiers retours utilisateur

---

*Post mortem rédigé le 4 juin 2026. Basé sur mon journal de développement IA*
*Stack : Python · python-telegram-bot · Claude API · PostgreSQL · Railway · GitHub*
*Méthodologie : ICM (Interpretable Context Methodology)*
