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

  // Construct full URL for uploaded profile pictures
  // If src is already a full URL (starts with http), use it as is
  // If it's a relative path (starts with /), prepend API URL
  // Otherwise, use empty string
  const imageUrl = src ?
    (src.startsWith('http') ? src :
      src.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${src}` :
        src) :
    '';

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage
        src={imageUrl}
        alt={alt}
        className="object-cover object-center"
        style={{
          aspectRatio: '1/1',
          width: '100%',
          height: '100%',
          borderRadius: '50%'
        }}
        onError={(e) => {
          // Hide broken image and show fallback
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <AvatarFallback className="bg-linear-to-br from-purple-500 to-pink-500 text-white font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export default ProfileImage;