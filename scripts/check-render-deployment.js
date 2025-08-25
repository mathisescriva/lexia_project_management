// Script pour vérifier le statut du déploiement Render
const https = require('https');

const RENDER_API_TOKEN = process.env.RENDER_API_TOKEN;
const SERVICE_ID = 'srv-d2m644ruibrs73ft5o9g'; // Service ID de votre application

async function checkRenderDeployment() {
  if (!RENDER_API_TOKEN) {
    console.log('❌ RENDER_API_TOKEN non défini');
    console.log('Pour utiliser ce script, définissez votre token d\'API Render :');
    console.log('export RENDER_API_TOKEN="votre_token_ici"');
    console.log('');
    console.log('Ou allez directement sur : https://dashboard.render.com');
    return;
  }

  const options = {
    hostname: 'api.render.com',
    port: 443,
    path: `/v1/services/${SERVICE_ID}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${RENDER_API_TOKEN}`,
      'Content-Type': 'application/json'
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
          console.log('📡 Réponse brute de l\'API:', data);
          
          const response = JSON.parse(data);
          console.log('📊 Statut du service Render :');
          
          if (response.service) {
            const service = response.service;
            console.log(`Service: ${service.name}`);
            console.log(`Status: ${service.status}`);
            console.log(`URL: ${service.serviceDetails?.url || 'Non disponible'}`);
            console.log(`Dernier déploiement: ${service.updatedAt}`);
            
            if (service.status === 'live') {
              console.log('✅ Service en ligne !');
            } else if (service.status === 'build_failed') {
              console.log('❌ Échec du build');
            } else if (service.status === 'deploy_failed') {
              console.log('❌ Échec du déploiement');
            } else {
              console.log(`⚠️ Statut: ${service.status}`);
            }
          } else if (response.error) {
            console.log(`❌ Erreur API: ${response.error}`);
          } else {
            console.log('❌ Réponse inattendue de l\'API');
            console.log('Réponse complète:', JSON.stringify(response, null, 2));
          }
          
          resolve(response);
        } catch (error) {
          console.error('❌ Erreur lors du parsing de la réponse:', error.message);
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
    await checkRenderDeployment();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

main();
