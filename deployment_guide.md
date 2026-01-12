# Guide de Déploiement : Hugging Face Spaces

Ce guide vous explique comment déployer votre projet NLP sur Hugging Face Spaces en quelques minutes.

## 1. Créer un Espace (Space) sur Hugging Face

1. Connectez-vous à [Hugging Face](https://huggingface.co/).
2. Cliquez sur **New** > **Space** en haut à droite.
3. Donnez un nom à votre projet (ex: `legal-ai-chatbot`).
4. **Important** : Choisissez **Docker** comme "Space SDK".
5. Sélectionnez le modèle "Blank" ou laissez par défaut.
6. Choisissez une visibilité (Public ou Private).
7. Cliquez sur **Create Space**.

## 2. Préparer vos Secrets (Variables d'Environnement)

Si vous avez besoin d'un token Hugging Face pour Llama :
1. Allez dans l'onglet **Settings** de votre Space.
2. Descendez jusqu'à **Variables and secrets**.
3. Ajoutez un secret nommé `HF_TOKEN` avec votre jeton d'accès Hugging Face.

## 3. Pousser le Code

Vous avez deux options :

### Option A : Liaison GitHub (Recommandé)
1. Dans les **Settings** de votre Space, liez votre compte GitHub.
2. Sélectionnez votre dépôt `mini-projet-NLP`.
3. Hugging Face déploiera automatiquement à chaque fois que vous ferez un `git push`.

### Option B : Via Git directement sur Hugging Face
1. Clonez l'Espace vide sur votre machine :
   ```bash
   git clone https://huggingface.co/spaces/VOTRE_NOM/VOTRE_NOM_DE_SPACE
   ```
2. Copiez tous les fichiers de votre projet local dans ce dossier.
3. Faites un commit et poussez :
   ```bash
   git add .
   git commit -m "Initial deploy"
   git push
   ```

## 4. Configuration Spécifique

Le projet est configuré pour écouter sur le port `8001`. Hugging Face Spaces détectera automatiquement le port exposé dans le `Dockerfile`.

## 5. Vérification

Une fois le déploiement terminé (statut "Running"), vous verrez votre interface s'afficher directement dans l'onglet "App" de votre Space !

---
> [!TIP]
> Si le démarrage est lent, c'est normal car le conteneur doit télécharger le modèle d'embeddings lors du premier lancement.
