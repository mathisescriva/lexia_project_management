// Script de test pour vérifier le déploiement
const https = require('https');

const BASE_URL = 'https://lexia-onboarding.onrender.com';

async function testEndpoint(endpoint) {
    return new Promise((resolve, reject) => {
        const url = `${BASE_URL}${endpoint}`;
        
        https.get(url, (res) => {
            console.log(`✅ ${endpoint}: ${res.statusCode} ${res.statusMessage}`);
            resolve(res.statusCode);
        }).on('error', (err) => {
            console.log(`❌ ${endpoint}: ${err.message}`);
            reject(err);
        });
    });
}

async function runTests() {
    console.log('🧪 Test du déploiement Render...\n');
    
    try {
        // Test de la page d'accueil
        await testEndpoint('/');
        
        // Test de l'API de santé
        await testEndpoint('/api/health');
        
        // Test de l'API d'authentification
        await testEndpoint('/api/auth/me');
        
        console.log('\n✅ Tous les tests sont passés !');
        console.log(`🌐 Votre application est accessible sur: ${BASE_URL}`);
        
    } catch (error) {
        console.log('\n❌ Certains tests ont échoué');
        console.log('Vérifiez les logs de déploiement sur Render');
    }
}

runTests();
