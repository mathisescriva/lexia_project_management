// Script pour créer un administrateur en utilisant l'API existante
const https = require('https');

const PRODUCTION_URL = 'https://lexia-onboarding.onrender.com';

async function createAdminDirect(name, email, password) {
  console.log('👤 Création d\'un administrateur via l\'API existante...');
  console.log('URL:', PRODUCTION_URL);
  console.log('');

  const postData = JSON.stringify({
    name,
    email,
    password,
    role: 'ADMIN',
    companyId: '',
    avatar: '/avatars/avatar_homme.svg'
  });

  const options = {
    hostname: 'lexia-onboarding.onrender.com',
    port: 443,
    path: '/api/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'Lexia-Admin-Creation'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          console.log('📊 Réponse du serveur:');
          console.log('Status:', res.statusCode);
          
          if (res.statusCode === 201 || res.statusCode === 200) {
            const response = JSON.parse(data);
            console.log('✅ Utilisateur créé avec succès !');
            console.log('📋 Détails:');
            console.log(`   Nom: ${response.name}`);
            console.log(`   Email: ${response.email}`);
            console.log(`   Rôle: ${response.role}`);
            console.log('');
            console.log('🔗 Vous pouvez maintenant vous connecter sur:');
            console.log('https://lexia-onboarding.onrender.com/login');
          } else if (res.statusCode === 401) {
            console.log('❌ Erreur d\'authentification');
            console.log('L\'API nécessite une authentification');
          } else if (res.statusCode === 403) {
            console.log('❌ Accès refusé');
            console.log('Vous n\'avez pas les permissions nécessaires');
          } else {
            console.log('❌ Erreur:', res.statusCode);
            console.log('Réponse:', data);
          }
          
          resolve({ status: res.statusCode, data });
        } catch (error) {
          console.error('❌ Erreur lors du parsing:', error.message);
          console.log('Réponse brute:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Erreur de connexion:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  // Utiliser des valeurs par défaut ou demander à l'utilisateur
  const name = process.argv[2] || 'Administrateur Lexia';
  const email = process.argv[3] || 'admin@lexia.com';
  const password = process.argv[4] || 'admin123';

  console.log('📋 Configuration:');
  console.log(`   Nom: ${name}`);
  console.log(`   Email: ${email}`);
  console.log(`   Mot de passe: ${password}`);
  console.log('');

  try {
    await createAdminDirect(name, email, password);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

main();
