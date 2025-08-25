// Script de diagnostic pour le déploiement Render
const https = require('https');

const APP_URL = 'https://lexia-onboarding.onrender.com';

async function testEndpoint(url, description) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      console.log(`✅ ${description}: ${res.statusCode} ${res.statusMessage}`);
      resolve({ status: res.statusCode, ok: res.statusCode < 400 });
    });

    req.on('error', (err) => {
      console.log(`❌ ${description}: ${err.message}`);
      resolve({ status: 0, ok: false, error: err.message });
    });

    req.setTimeout(10000, () => {
      console.log(`⏰ ${description}: Timeout (10s)`);
      req.destroy();
      resolve({ status: 0, ok: false, error: 'timeout' });
    });
  });
}

async function diagnoseDeployment() {
  console.log('🔍 Diagnostic du déploiement Render...\n');

  // Test de connectivité de base
  console.log('📡 Tests de connectivité :');
  await testEndpoint(APP_URL, 'Page d\'accueil');
  await testEndpoint(`${APP_URL}/api/health`, 'API Health Check');
  await testEndpoint(`${APP_URL}/api/auth/me`, 'API Auth');

  console.log('\n📋 Analyse des problèmes potentiels :');
  
  // Vérifications locales
  console.log('\n🔧 Vérifications locales :');
  
  // Vérifier si le build fonctionne
  const { execSync } = require('child_process');
  try {
    execSync('npm run build', { stdio: 'pipe' });
    console.log('✅ Build local : OK');
  } catch (error) {
    console.log('❌ Build local : ÉCHEC');
    console.log('   Le problème vient du code, pas de Render');
  }

  // Vérifier les variables d'environnement
  console.log('\n🌍 Variables d\'environnement :');
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      console.log(`✅ ${varName} : Configurée`);
    } else {
      console.log(`❌ ${varName} : Manquante`);
    }
  }

  console.log('\n📋 Recommandations :');
  console.log('1. Allez sur https://dashboard.render.com');
  console.log('2. Vérifiez les logs de déploiement');
  console.log('3. Assurez-vous que toutes les variables d\'environnement sont configurées');
  console.log('4. Vérifiez que la base de données PostgreSQL est accessible');
  console.log('5. Si le build local échoue, corrigez d\'abord les erreurs de code');
  
  console.log('\n🔗 Liens utiles :');
  console.log(`- Dashboard Render: https://dashboard.render.com`);
  console.log(`- Application: ${APP_URL}`);
  console.log(`- Documentation Render: https://render.com/docs`);
}

diagnoseDeployment().catch(console.error);
