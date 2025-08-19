const { google } = require('googleapis');
const fs = require('fs');

async function createDriveFolder(projectName) {
  try {
    console.log('🔍 Création d\'un dossier Google Drive...');
    
    // Vérifier que le fichier de clé existe
    const keyFilePath = 'secrets/gilbert-cfed4-d5b2785cef41.json';
    
    if (!fs.existsSync(keyFilePath)) {
      console.error('❌ Fichier de clé Google Drive non trouvé:', keyFilePath);
      return;
    }
    
    console.log('✅ Fichier de clé trouvé:', keyFilePath);
    
    // Initialiser l'authentification
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    
    const drive = google.drive({ version: 'v3', auth });
    
    // Créer le dossier
    const folderName = `Projet Lexia - ${projectName}`;
    console.log('🔄 Création du dossier:', folderName);
    
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };
    
    const file = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id,webViewLink',
    });
    
    const folderId = file.data.id;
    const folderUrl = file.data.webViewLink;
    
    console.log('✅ Dossier créé avec succès !');
    console.log('📁 ID du dossier:', folderId);
    console.log('🔗 URL du dossier:', folderUrl);
    console.log('');
    console.log('📋 Pour configurer dans l\'application :');
    console.log('1. Allez dans la page d\'édition du projet');
    console.log('2. Collez cette URL dans le champ "URL Google Drive" :');
    console.log(folderUrl);
    console.log('3. Sauvegardez le projet');
    console.log('4. Testez la synchronisation dans l\'onglet "Fichiers"');
    
    return { folderId, folderUrl };
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du dossier:', error.message);
  }
}

// Utilisation : node scripts/create-drive-folder.js "Nom du projet"
const projectName = process.argv[2] || 'Test Project';
createDriveFolder(projectName);
