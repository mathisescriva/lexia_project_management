// Script pour tester la connexion et diagnostiquer les problèmes
const https = require('https');

async function testLogin(email, password) {
  console.log('🔍 Test de connexion...');
  console.log('URL: https://lexia-onboarding.onrender.com/api/auth/login');
  console.log('Email:', email);
  console.log('');

  const postData = JSON.stringify({ email, password });

  const options = {
    hostname: 'lexia-onboarding.onrender.com',
    port: 443,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'Lexia-Login-Test'
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
          console.log('Headers:', res.headers);
          console.log('');
          
          if (res.statusCode === 200) {
            const response = JSON.parse(data);
            console.log('✅ Connexion réussie !');
            console.log('Utilisateur:', response.user.name);
            console.log('Rôle:', response.user.role);
            console.log('Token présent:', !!response.token);
          } else if (res.statusCode === 401) {
            console.log('❌ Identifiants invalides');
            console.log('Réponse:', data);
          } else if (res.statusCode === 500) {
            console.log('❌ Erreur interne du serveur');
            console.log('Réponse:', data);
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
  try {
    await testLogin('admin@lexia.com', 'admin123');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

main();
