// Script pour lister tous les services Render
const https = require('https');

const RENDER_API_TOKEN = process.env.RENDER_API_TOKEN;

async function listRenderServices() {
  if (!RENDER_API_TOKEN) {
    console.log('❌ RENDER_API_TOKEN non défini');
    return;
  }

  const options = {
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
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('📋 Vos services Render :');
          console.log('========================');
          
          if (response.services && response.services.length > 0) {
            response.services.forEach((service, index) => {
              console.log(`${index + 1}. ${service.name}`);
              console.log(`   ID: ${service.id}`);
              console.log(`   Type: ${service.type}`);
              console.log(`   Status: ${service.status}`);
              console.log(`   URL: ${service.serviceDetails?.url || 'Non disponible'}`);
              console.log('');
            });
          } else {
            console.log('❌ Aucun service trouvé');
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
    await listRenderServices();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

main();
