// Test de l'API de connexion
const testLogin = async () => {
  try {
    console.log('🔍 Testing login API...')
    
    const response = await fetch('https://votre-app.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@lexia.com',
        password: 'password'
      })
    })
    
    console.log('Status:', response.status)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Login successful:', data)
    } else {
      const error = await response.text()
      console.log('❌ Login failed:', error)
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message)
  }
}

testLogin()
