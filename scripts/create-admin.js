// Script pour créer le premier administrateur
const https = require('https');

const PRODUCTION_URL = 'https://lexia-onboarding.onrender.com';

async function createAdmin(name, email, password) {
  console.log('👤 Création du premier administrateur...');
  console.log('URL:', PRODUCTION_URL);
  console.log('');

  const postData = JSON.stringify({
    name,
    email,
    password
  });

  const options = {
    hostname: 'lexia-onboarding.onrender.com',
    port: 443,
    path: '/api/setup-admin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'Lexia-Admin-Setup'
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
          const response = JSON.parse(data);
          
          console.log('📊 Réponse du serveur:');
          console.log('Status:', res.statusCode);
          
          if (res.statusCode === 201) {
            console.log('✅ Administrateur créé avec succès !');
            console.log('📋 Détails:');
            console.log(`   Nom: ${response.user.name}`);
            console.log(`   Email: ${response.user.email}`);
            console.log(`   Rôle: ${response.user.role}`);
            console.log('');
            console.log('🔗 Vous pouvez maintenant vous connecter sur:');
            console.log('https://lexia-onboarding.onrender.com/login');
          } else if (res.statusCode === 409) {
            console.log('⚠️ Un administrateur existe déjà');
            console.log('Vous pouvez vous connecter directement');
          } else {
            console.log('❌ Erreur:', response.error);
          }
          
          resolve(response);
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
    await createAdmin(name, email, password);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

main();
