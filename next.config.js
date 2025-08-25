/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisations pour la production
  output: 'standalone',
  
  // Configuration des images
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  
  // Configuration des headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Configuration des redirections
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ]
  },


  
  // Optimisations de build
  experimental: {
    // Désactivé pour éviter les problèmes de build
    // optimizeCss: true,
  },
  
  // Configuration pour Render
  env: {
    // Variables d'environnement personnalisées si nécessaire
  },

  // Configuration pour éviter les erreurs de génération statique
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig
