// Script pour vérifier les déploiements récents Render
const https = require('https');

const RENDER_API_TOKEN = process.env.RENDER_API_TOKEN;
const SERVICE_ID = 'srv-d2m644ruibrs73ft5o9g';

async function checkRenderDeployments() {
  if (!RENDER_API_TOKEN) {
    console.log('❌ RENDER_API_TOKEN non défini');
    return;
  }

  const options = {
    hostname: 'api.render.com',
    port: 443,
    path: `/v1/services/${SERVICE_ID}/deploys`,
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
          console.log('📊 Déploiements récents :');
          console.log('========================');
          
          if (response.deploys && response.deploys.length > 0) {
            response.deploys.slice(0, 5).forEach((deploy, index) => {
              console.log(`${index + 1}. Déploiement ${deploy.id}`);
              console.log(`   Status: ${deploy.status}`);
              console.log(`   Commit: ${deploy.commit?.message || 'N/A'}`);
              console.log(`   Créé: ${deploy.createdAt}`);
              console.log(`   Terminé: ${deploy.finishedAt || 'En cours...'}`);
              
              if (deploy.status === 'live') {
                console.log('   ✅ Déploiement réussi !');
              } else if (deploy.status === 'build_failed') {
                console.log('   ❌ Échec du build');
              } else if (deploy.status === 'deploy_failed') {
                console.log('   ❌ Échec du déploiement');
              } else if (deploy.status === 'canceled') {
                console.log('   ⚠️ Déploiement annulé');
              } else {
                console.log(`   ⏳ Statut: ${deploy.status}`);
              }
              console.log('');
            });
          } else {
            console.log('❌ Aucun déploiement trouvé');
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
    await checkRenderDeployments();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

main();
