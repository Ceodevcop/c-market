import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function StarRating({ rating, size = 'medium', className = '' }: StarRatingProps) {
  // Calculate full and half stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Determine star size
  const starSizeClass = size === 'small' 
    ? 'h-3 w-3' 
    : size === 'large' 
      ? 'h-6 w-6' 
      : 'h-4 w-4';

  // Classes for different star states
  const baseClass = `${starSizeClass} ${className}`;
  const filledClass = `${baseClass} text-yellow-400 fill-current`;
  const emptyClass = `${baseClass} text-gray-300`;

  return (
    <div className="flex">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={filledClass} />
      ))}
      
      {/* Half star if needed */}
      {hasHalfStar && <StarHalf className={filledClass} />}
      
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={emptyClass} />
      ))}
    </div>
  );
}
