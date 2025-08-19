import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', size = 'lg' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-14 w-14',
    md: 'h-20 w-20',
    lg: 'h-28 w-28'
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <Image
          src="/atlas-logo.png"
          alt="Atlas"
          fill
          sizes="(max-width: 768px) 48px, 96px"
          className="object-contain object-center"
          priority
          quality={100}
        />
      </div>
    </div>
  )
}
