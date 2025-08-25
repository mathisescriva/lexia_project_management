// Script pour vérifier les logs de déploiement Render
const https = require('https');

const RENDER_API_TOKEN = process.env.RENDER_API_TOKEN;

async function checkRenderLogs() {
  if (!RENDER_API_TOKEN) {
    console.log('❌ RENDER_API_TOKEN non défini');
    return;
  }

  console.log('🔍 Vérification des logs Render...');
  console.log('');

  // Vérifier les services
  const servicesOptions = {
    hostname: 'api.render.com',
    port: 443,
    path: '/v1/services',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${RENDER_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(servicesOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('📊 Réponse de l\'API Services:');
          console.log(JSON.stringify(response, null, 2));
          
          if (response.services && response.services.length > 0) {
            console.log('✅ Services trouvés:', response.services.length);
            response.services.forEach(service => {
              console.log(`- ${service.name} (${service.id}) - ${service.status}`);
            });
          } else {
            console.log('⚠️ Aucun service trouvé');
            console.log('');
            console.log('🔧 Solutions possibles :');
            console.log('1. Le service n\'a pas encore été créé');
            console.log('2. Le token n\'a pas les bonnes permissions');
            console.log('3. Le service a été supprimé');
            console.log('');
            console.log('📋 Prochaines étapes :');
            console.log('- Allez sur https://dashboard.render.com');
            console.log('- Vérifiez si le service "lexia-onboarding" existe');
            console.log('- Si non, créez un nouveau service ou blueprint');
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
      console.error('❌ Erreur de requête:', error.message);
      reject(error);
    });

    req.end();
  });
}

async function main() {
  try {
    await checkRenderLogs();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

main();
