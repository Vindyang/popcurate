import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function formatRating(rating: number): string {
  // Convert decimal rating (e.g., 7.8) to percentage (e.g., 78%)
  return `${Math.round(rating * 10)}%`;
}

export function getImageUrl(
  path: string,
  size: 'w200' | 'w500' | 'w780' | 'original' = 'w500'
): string {
  if (!path) return '/placeholder-movie.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateMovieSlug(
  title: string,
  year: number,
  id: number
): string {
  const slug = slugify(title);
  return `${slug}-${year}-${id}`;
}

export function parseMovieSlug(slug: string): { id: number } | null {
  const parts = slug.split('-');
  const id = parseInt(parts[parts.length - 1]);

  if (isNaN(id)) return null;

  return { id };
}
