// Script pour exécuter le seeding en production via l'API
const https = require('https');

const PRODUCTION_URL = 'https://lexia-onboarding.onrender.com';

async function triggerProductionSeeding() {
  console.log('🌱 Déclenchement du seeding en production...');
  console.log('URL:', PRODUCTION_URL);
  console.log('');

  // Option 1: Déclencher via une route API (si elle existe)
  try {
    console.log('📡 Tentative de déclenchement via API...');
    
    const options = {
      hostname: 'lexia-onboarding.onrender.com',
      port: 443,
      path: '/api/seed',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Lexia-Seeding-Script'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📊 Réponse du serveur:');
        console.log('Status:', res.statusCode);
        console.log('Headers:', res.headers);
        console.log('Body:', data);
        
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Seeding déclenché avec succès !');
        } else {
          console.log('⚠️ Route de seeding non disponible');
          console.log('');
          console.log('🔧 Solutions alternatives :');
          console.log('1. Créez manuellement un compte admin');
          console.log('2. Ajoutez une route /api/seed dans votre application');
          console.log('3. Utilisez le dashboard Render pour exécuter des commandes');
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Erreur de connexion:', error.message);
      console.log('');
      console.log('🔧 Solutions manuelles :');
      console.log('1. Allez sur https://lexia-onboarding.onrender.com/login');
      console.log('2. Créez un compte administrateur');
      console.log('3. Connectez-vous et ajoutez des données via l\'interface');
    });

    req.write(JSON.stringify({ action: 'seed' }));
    req.end();

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

async function main() {
  await triggerProductionSeeding();
  
  console.log('');
  console.log('📋 Prochaines étapes recommandées :');
  console.log('1. Allez sur https://lexia-onboarding.onrender.com/login');
  console.log('2. Créez un compte administrateur avec :');
  console.log('   - Email: admin@lexia.com');
  console.log('   - Mot de passe: admin123');
  console.log('3. Connectez-vous et ajoutez des données via l\'interface');
  console.log('');
  console.log('🔧 Ou ajoutez cette route API dans votre application :');
  console.log('app/api/seed/route.ts');
}

main();
