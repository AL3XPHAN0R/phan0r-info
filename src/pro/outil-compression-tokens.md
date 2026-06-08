---
title: J'ai construit un outil pour arrêter de gaspiller des tokens — et il fonctionne à 100% sans IA
description: Comment j'ai créé toMD, un outil Python local qui convertit des fichiers Word, PDF et PowerPoint en Markdown allégé — réduisant de 88 % leur poids en tokens avant de les envoyer à un LLM.
---

Il y a quelques semaines, j'ai dépassé ma limite de tokens pour la première fois.

Pour ceux qui ne sont pas familiers avec le concept : quand on utilise un assistant comme Claude ou ChatGPT, chaque mot qu'on envoie et chaque mot qu'on reçoit a un coût. Ce coût se mesure en **tokens**, des petites unités de texte qui s'accumulent rapidement. La plupart des abonnements ou des accès API incluent un quota mensuel. Quand on le dépasse, on paie en supplément.

Ce jour-là, j'ai regardé ma facture et je me suis dit : il doit y avoir une meilleure façon de faire ça.

## Le problème concret

Dans mon flux de travail, je travaille souvent avec des fichiers texte de base : des Word, des PDFs, des présentations PowerPoint. Quand je veux qu'un LLM analyse l'un de ces fichiers, je dois lui envoyer son contenu.

Le problème, c'est qu'un fichier brut est rarement optimisé pour ça. Il contient des en-têtes répétitifs, des mentions légales qui apparaissent sur chaque page, des numéros de page, des espaces inutiles, des métadonnées... Tout ce bruit se transforme en tokens, et ces tokens coûtent de l'argent sans apporter la moindre valeur à l'analyse.

Ma solution temporaire ? Je demandais à Claude de compresser lui-même le fichier avant de travailler dessus. C'est là que l'ironie m'a frappé : j'utilisais des tokens pour économiser des tokens.

## Chercher, ne pas trouver, puis construire

J'ai commencé par chercher un outil existant. Il en existe un plutôt bien conçu, mais il tourne uniquement sur Mac. Moi, je suis sur PC.

Plutôt que de changer de système d'exploitation, j'ai décidé de construire ma propre solution en Python. Ce n'est pas un projet massif, c'est un outil ciblé qui fait une seule chose et la fait bien.

## Ce que fait toMD

**toMD** prend n'importe quel fichier texte de base (Word, PDF, PowerPoint, ou texte brut) et le convertit en un fichier Markdown propre, allégé, pensé pour être lu par un LLM.

Concrètement, le programme extrait uniquement le contenu utile, supprime le boilerplate (mentions légales, en-têtes répétitifs, numéros de page), nettoie les espaces et les artefacts visuels qui n'ont aucun sens en dehors du format original, puis produit un fichier avec un en-tête structuré contenant la source, l'auteur, la date et le type de fichier.

Le résultat : **une réduction moyenne de 88 % ou plus du poids en tokens, sans perte d'information.**

Un fichier qui aurait consommé 10 000 tokens en est désormais à moins de 1 200.

## Zéro token dépensé, zéro donnée envoyée

Ce qui me tenait particulièrement à cœur, c'est que l'outil fonctionne entièrement en local. Aucune connexion à un serveur, aucune donnée envoyée dans le cloud, aucun token consommé pour faire le travail.

C'est du Python pur, qui tourne sur ta machine.

## Une expérience utilisateur pensée pour Windows

Je voulais quelque chose de rapide, intégré dans mon quotidien, sans avoir à ouvrir un terminal ou une application tierce.

La solution : un clic droit.

Une fois installé, toMD apparaît directement dans le menu contextuel de l'Explorateur Windows. Tu fais un clic droit sur ton fichier, tu sélectionnes "Encode for LLM", et le fichier compressé apparaît dans le même dossier quelques secondes plus tard. C'est tout.

## Ce que j'ai appris en le construisant

Ce projet a été développé avec l'assistance de l'IA, ce qui est quelque part poétique pour un outil destiné à mieux l'utiliser.

La principale leçon que j'en tire : la qualité d'un projet développé avec l'IA dépend directement de la clarté avec laquelle tu exprimes ce que tu veux. L'outil n'est pas magique, il amplifie ta vision. Savoir formuler précisément un besoin est une compétence à part entière, et je continue de l'affiner.

## Et maintenant ?

Pour l'instant, toMD répond parfaitement à mes besoins personnels. Il est stable, il fait ce pour quoi il a été conçu, et il s'intègre naturellement dans mon flux de travail.

À terme, j'ai l'intention d'en faire une version plus universelle, compatible avec d'autres systèmes, et de la rendre accessible gratuitement. Mais pour l'instant, je construis d'abord des choses qui me servent vraiment. Le reste suivra.

*Si toi aussi tu travailles régulièrement avec des LLMs et que la gestion des tokens commence à peser, tu n'es probablement pas le seul à avoir cherché ce genre d'outil.*
