'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ProfileImageProps {
  src?: string | null;
  alt?: string;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10', 
  lg: 'h-16 w-16',
  xl: 'h-32 w-32'
};

export function ProfileImage({ 
  src, 
  alt = 'Profile', 
  fallbackText = 'U', 
  size = 'md',
  className 
}: ProfileImageProps) {
  const initials = fallbackText
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage 
        src={src || ''} 
        alt={alt}
        className="object-cover object-center"
        style={{ 
          aspectRatio: '1/1',
          width: '100%',
          height: '100%',
          borderRadius: '50%'
        }}
      />
      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export default ProfileImage;