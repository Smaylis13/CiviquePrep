# CiviquePrep

Application Angular autonome de préparation sous forme d'examens blancs.

## Fonctionnalités

- Trois parcours : CSP, carte de résident, naturalisation.
- Sessions de 20 ou 40 questions.
- Chronomètre proportionnel : 22 min 30 pour 20 questions, 45 min pour 40.
- Une question à la fois, quatre choix, une seule réponse.
- Pas de correction avant la fin.
- Résultat, seuil de 80 %, correction et explications à la fin.
- Aucune base de données, aucun backend, aucun compte utilisateur.

## Prérequis

- Node.js 22.22.3 ou version compatible recommandée par la documentation Angular.
- npm.

## Lancer en local

```bash
npm install
npm start
```

Ouvrir http://localhost:4200.

## Construire

```bash
npm run build
```

Les fichiers statiques sont générés dans `dist/civiqueprep/browser`.

## Publier sur GitHub Pages

1. Créer un dépôt GitHub public nommé `civiqueprep`.
2. Décompresser ce projet et pousser tout son contenu à la racine du dépôt.
3. Dans GitHub : Settings > Pages.
4. Dans Build and deployment, choisir **GitHub Actions** comme Source.
5. Le workflow `.github/workflows/deploy.yml` compile Angular et publie le site à chaque push sur `main`.
6. Attendre la fin du workflow dans l'onglet Actions.

Adresse finale : `https://VOTRE-PSEUDO.github.io/civiqueprep/`

Si le dépôt porte un autre nom, le workflow récupère automatiquement le nom du dépôt pour calculer le `base-href`.

## Banque de questions : limites à connaître

Les fichiers `src/assets/data/*.json` inclus dans cette version constituent une **banque pédagogique initiale** rédigée pour démontrer le fonctionnement de l'application. Ils ne sont pas les listes intégrales officielles et les propositions/réponses ne sont pas des corrigés validés par le ministère.

Les listes officielles publiées portent sur les questions de connaissance et ne contiennent pas les réponses. Les réponses suggérées doivent être attribuées à leur producteur indépendant. Avant une diffusion publique à grande échelle, il faut remplacer ou enrichir ces fichiers avec une base dont les droits de réutilisation et l'attribution sont respectés, puis vérifier chaque correction.

Sources de référence :
- Questions officielles : https://formation-civique.interieur.gouv.fr/examen-civique/
- Jeux de données : https://www.data.gouv.fr/
- Règles GitHub Pages : https://docs.github.com/en/pages

## Personnaliser les questions

Chaque fichier JSON est un tableau d'objets avec le format :

```json
{
  "id": "CSP-001",
  "theme": "Principes et valeurs de la République",
  "question": "Quel est le principe ... ?",
  "options": ["Choix A", "Choix B", "Choix C", "Choix D"],
  "correctIndex": 0,
  "explanation": "Explication pédagogique.",
  "sourceType": "pedagogical"
}
```

`correctIndex` commence à zéro : 0 = première proposition, 1 = deuxième, etc.
