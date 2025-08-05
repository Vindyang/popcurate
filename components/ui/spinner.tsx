import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'border-primary animate-spin rounded-full border-b-2',
        sizeClasses[size],
        className
      )}
    />
  );
}
