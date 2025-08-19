# 🔧 Configuration Google Drive

## Vue d'ensemble

L'application Lexia utilise Google Drive pour le partage de fichiers avec les clients. Les fichiers sont stockés dans Google Drive et synchronisés avec la base de données locale pour l'affichage dans l'application.

## ⚠️ Problème actuel

**Les fichiers Google Drive ne s'affichent pas automatiquement** dans l'application. Il faut :

1. **Configurer Google Drive API** (voir ci-dessous)
2. **Synchroniser manuellement** les fichiers via le bouton "Synchroniser"
3. **Les fichiers apparaîtront** ensuite dans l'onglet "Fichiers" du projet

## 🚀 Configuration Google Drive

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google Drive pour ce projet

### 2. Créer un compte de service

1. Dans Google Cloud Console, allez dans "IAM & Admin" > "Service Accounts"
2. Cliquez sur "Create Service Account"
3. Donnez un nom au compte (ex: "lexia-drive-service")
4. Cliquez sur "Create and Continue"
5. Attribuez le rôle "Editor" au compte de service
6. Cliquez sur "Done"

### 3. Télécharger la clé JSON

1. Cliquez sur le compte de service créé
2. Allez dans l'onglet "Keys"
3. Cliquez sur "Add Key" > "Create new key"
4. Sélectionnez "JSON" et cliquez sur "Create"
5. Le fichier JSON sera téléchargé automatiquement

### 4. Configurer les variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Google Drive API
GOOGLE_SERVICE_ACCOUNT_KEY_FILE="path/to/your-service-account-key.json"
```

**Important :** Remplacez `path/to/your-service-account-key.json` par le chemin réel vers votre fichier JSON.

### 5. Placer le fichier JSON

Placez le fichier JSON téléchargé dans votre projet (par exemple dans un dossier `secrets/`) et mettez à jour le chemin dans `.env.local`.

## 🔄 Synchronisation des fichiers

### Pour les administrateurs

1. **Ouvrez un projet** dans l'application
2. **Allez dans l'onglet "Fichiers"**
3. **Cliquez sur "Synchroniser"** pour récupérer les fichiers depuis Google Drive
4. **Les fichiers apparaîtront** dans la liste

### Processus de synchronisation

1. L'application se connecte à Google Drive via l'API
2. Elle récupère la liste des fichiers dans le dossier du projet
3. Elle compare avec les fichiers déjà en base de données
4. Elle ajoute les nouveaux fichiers à la base de données
5. Les fichiers sont maintenant visibles dans l'application

## 📁 Structure des dossiers

Chaque projet peut avoir un dossier Google Drive associé :

- **Dossier racine** : Contient tous les fichiers du projet
- **Sous-dossiers** : Peuvent être créés pour organiser les fichiers
- **Permissions** : Les clients ont accès en lecture seule

## 🔐 Sécurité

- **Compte de service** : Utilise un compte de service dédié (pas votre compte personnel)
- **Permissions minimales** : Le compte de service n'a que les permissions nécessaires
- **Clé JSON** : Gardez le fichier JSON en sécurité et ne le committez pas dans Git

## 🚨 Dépannage

### Erreur "Google Drive API non configurée"

- Vérifiez que `GOOGLE_SERVICE_ACCOUNT_KEY_FILE` est défini dans `.env.local`
- Vérifiez que le chemin vers le fichier JSON est correct
- Vérifiez que le fichier JSON existe

### Erreur "Aucun dossier Google Drive configuré"

- Le projet n'a pas de dossier Google Drive associé
- Contactez l'administrateur pour configurer un dossier

### Erreur lors de la synchronisation

- Vérifiez que l'API Google Drive est activée
- Vérifiez que le compte de service a les bonnes permissions
- Vérifiez les logs de l'application pour plus de détails

## 📞 Support

Pour toute question sur la configuration Google Drive :

1. Vérifiez cette documentation
2. Consultez les logs de l'application
3. Contactez l'équipe technique

---

**Note :** Cette configuration est optionnelle. L'application fonctionne sans Google Drive, mais les fonctionnalités de partage de fichiers seront limitées.
