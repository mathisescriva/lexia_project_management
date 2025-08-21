'use client'

import Image from 'next/image'
import { useState } from 'react'

interface AvatarProps {
  user?: {
    name: string
    avatar?: string
    role?: string
  }
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Avatar({ user, size = 'md', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }
  
  const getDefaultAvatar = () => {
    if (!user) return '/avatars/avatar_homme.svg'
    
    if (user.role === 'ADMIN') {
      return '/avatars/avatar_admin.svg'
    }
    
    // Pour les clients, on peut utiliser un avatar par défaut homme/femme
    // Ici on utilise homme par défaut, mais on pourrait ajouter un champ genre
    return '/avatars/avatar_homme.svg'
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  if (!user) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center ${className}`}>
        <Image
          src={getDefaultAvatar()}
          alt="Avatar par défaut"
          width={32}
          height={32}
          className="w-full h-full rounded-full"
        />
      </div>
    )
  }
  
  // Si l'utilisateur a un avatar personnalisé
  if (user.avatar && !imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
        <Image
          src={user.avatar}
          alt={`Avatar de ${user.name}`}
          width={48}
          height={48}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    )
  }
  
  // Avatar par défaut basé sur le rôle
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
      <Image
        src={getDefaultAvatar()}
        alt={`Avatar de ${user.name}`}
        width={48}
        height={48}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
