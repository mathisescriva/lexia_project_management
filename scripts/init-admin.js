// Script simple pour initialiser le premier administrateur
const https = require('https');

async function initAdmin() {
  console.log('🚀 Initialisation du premier administrateur...');
  console.log('URL: https://lexia-onboarding.onrender.com/api/init');
  console.log('');

  const options = {
    hostname: 'lexia-onboarding.onrender.com',
    port: 443,
    path: '/api/init',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': 0
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
          
          if (res.statusCode === 201) {
            const response = JSON.parse(data);
            console.log('✅ Administrateur créé avec succès !');
            console.log('');
            console.log('🔐 Identifiants de connexion :');
            console.log(`   Email: ${response.credentials.email}`);
            console.log(`   Mot de passe: ${response.credentials.password}`);
            console.log('');
            console.log('🔗 Connectez-vous sur :');
            console.log('https://lexia-onboarding.onrender.com/login');
            console.log('');
            console.log('⚠️ IMPORTANT : Changez le mot de passe après la première connexion !');
          } else if (res.statusCode === 409) {
            console.log('⚠️ Un administrateur existe déjà');
            console.log('Vous pouvez vous connecter directement avec :');
            console.log('   Email: admin@lexia.com');
            console.log('   Mot de passe: admin123');
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

    req.end();
  });
}

async function main() {
  try {
    await initAdmin();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

main();
